import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

// Initialize the Google Generative AI with the API key
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || '');

export async function POST(request: NextRequest) {
  try {
    const { prompt, fitnessLevel, workoutGoal } = await request.json();
    
    // Validate input
    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }
    
    // Create a more detailed prompt that includes the fitness level and goal
    let enhancedPrompt = prompt;
    
    if (fitnessLevel) {
      enhancedPrompt += `\nFitness Level: ${fitnessLevel}`;
    }
    
    if (workoutGoal) {
      enhancedPrompt += `\nPrimary Goal: ${workoutGoal}`;
    }
    
    enhancedPrompt += "\n\nPlease provide a detailed workout plan that includes:\n" +
      "1. A weekly schedule\n" +
      "2. Specific exercises with sets and reps\n" +
      "3. Rest periods\n" +
      "4. Progression guidelines\n" +
      "5. Brief nutrition tips related to the goal";
    
    // Get the generative model (Gemini Pro)
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    
    // Generate content
    const result = await model.generateContent(enhancedPrompt);
    const response = await result.response;
    const text = response.text();
    
    return NextResponse.json({ workout: text });
  } catch (error: any) {
    console.error('Error generating workout:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate workout' },
      { status: 500 }
    );
  }
} 