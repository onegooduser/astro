import OpenAI from 'openai';

// Initialize the OpenAI client with the API key from environment variables
const openai = new OpenAI({
    apiKey: import.meta.env.OPENAI_API_KEY,
});

export default openai;
