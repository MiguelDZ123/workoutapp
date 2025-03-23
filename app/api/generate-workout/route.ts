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
    
    let enhancedPrompt = `Based on the following information, generate a workout plan in JSON format:

Input: ${prompt}
Fitness Level: ${fitnessLevel || 'Not specified'}
Primary Goal: ${workoutGoal || 'Not specified'}

Return ONLY the raw JSON without any markdown formatting or code blocks. The JSON structure should be:
{
  "title": "Name of the workout plan",
  "overview": "Brief description of the workout plan",
  "weeklySchedule": {
    "monday": {
      "focus": "Main focus of the day",
      "exercises": [
        {
          "name": "Exercise name",
          "sets": number,
          "reps": "number or range",
          "rest": "rest period"
        }
      ],
      "notes": "Additional notes for the day"
    },
    "tuesday": { ... similar structure ... },
    "wednesday": { ... similar structure ... },
    "thursday": { ... similar structure ... },
    "friday": { ... similar structure ... },
    "saturday": { ... similar structure ... },
    "sunday": { ... similar structure ... }
  },
  "nutritionTips": [
    "Tip 1",
    "Tip 2",
    "Tip 3"
  ]
}

Important: Return only the raw JSON data without any markdown formatting, code blocks, or additional text.`;

    // Get the generative model
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    
    // Generate content
    const result = await model.generateContent(enhancedPrompt);
    const response = await result.response;
    let text = response.text();
    
    // Clean up the response by removing any markdown formatting
    text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    // Parse the response as JSON
    const workoutPlan = JSON.parse(text);
    
    return NextResponse.json({ workout: workoutPlan });
  } catch (error: any) {
    console.error('Error generating workout:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate workout' },
      { status: 500 }
    );
  }
} 