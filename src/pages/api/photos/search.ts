import type { APIRoute } from 'astro';
import { searchPhotos } from '../../../utils/unsplash';

export const GET: APIRoute = async ({ url }) => {
  try {
    const query = url.searchParams.get('query');
    const page = Number(url.searchParams.get('page')) || 1;
    const perPage = Number(url.searchParams.get('perPage')) || 10;

    if (!query) {
      return new Response(JSON.stringify({ error: 'Query parameter is required' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }

    const results = await searchPhotos(query, page, perPage);
    
    return new Response(JSON.stringify(results), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Failed to search photos' }), 
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }
};
