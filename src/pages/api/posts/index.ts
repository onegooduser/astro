import type { APIRoute } from 'astro';
import db from '../../../db/setup';
import openai from '../../../utils/openai';

export const GET: APIRoute = async () => {
  try {
    const posts = db.prepare('SELECT * FROM posts WHERE draft = 0 ORDER BY pubDate DESC').all();
    return new Response(JSON.stringify(posts), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to fetch posts' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { title, slug, description } = body;

    if (!title || !slug) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }

    // Generate content using OpenAI
    const prompt = `Write a detailed blog post about "${title}". 
    Description/Context: ${description}
    
    The blog post should be well-structured with sections, engaging, and informative. 
    Use markdown formatting for headings and sections.
    Include a brief introduction and conclusion.`;

    const completion = await openai.chat.completions.create({
      messages: [{ role: "system", content: "You are a professional blog writer skilled in creating engaging, well-researched content." },
                { role: "user", content: prompt }],
      model: "gpt-3.5-turbo",
      temperature: 0.7,
      max_tokens: 2000
    });

    const generatedContent = completion.choices[0].message.content || '';
    const pubDate = new Date().toISOString();
    
    const stmt = db.prepare(`
      INSERT INTO posts (title, slug, description, content, heroImage, pubDate)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(title, slug, description, generatedContent, body.heroImage, pubDate);

    return new Response(JSON.stringify({ id: result.lastInsertRowid }), {
      status: 201,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: 'Failed to create post' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};
