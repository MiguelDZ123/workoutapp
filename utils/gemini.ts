import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Google Generative AI with the API key
export const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || '');

// Helper function to get the Gemini model
export function getGeminiModel() {
  return genAI.getGenerativeModel({ model: 'gemini-pro' });
} 