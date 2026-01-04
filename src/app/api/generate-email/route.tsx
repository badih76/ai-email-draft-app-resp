// src/app/api/generate-email/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
// import { logDraftGeneration } from '@/drizzle/actions';
import { IDraftInputs, ILogDraftReturn } from '@/lib/interfaces';
import { db } from '@/drizzle';
import { DraftsGenerationLog } from '@/drizzle/schema';

// Initialize the Google Gen AI client. 
// It automatically looks for the GEMINI_API_KEY environment variable.
const ai = new GoogleGenAI({});


export async function POST(request: NextRequest) {
  // Ensure the request is handled within a try-catch block for robustness
  try {
    const { draft, userId }: { draft: IDraftInputs, userId: string } = await request.json();
    const { userRole, recipientRole, tone, details }: IDraftInputs = await draft;

    // Input validation: ensure all required fields are present
    if (!userRole || !recipientRole || !tone || !details) {
      return NextResponse.json({ error: 'Missing required fields: userRole, recipientRole, tone, or details.' }, { status: 400 });
    }

    // 1. Construct a specific prompt to guide the AI's generation
    const prompt = `
      You are MailSmith AI, an expert email drafting assistant.
      Your task is to generate a professional email based on the following context.
      
      Sender's Role: ${userRole}
      Recipient's Role: ${recipientRole}
      Required Tone: ${tone}
      Email Details/Context: "${details}"
      
      Generate the email content. Start with the Subject line, followed by a double newline. Then, provide the salutation and the body of the email. Conclude with a generic closing sign-off like "Best regards," or "Sincerely," followed by a placeholder for the user's name: "[Your Name]".
    `;

    // 2. Call the Gemini model
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash', // A fast, high-quality model for text generation
        contents: prompt,
    });

    // 3. Extract the generated text and clean up whitespace
    const generatedText = response.text?.trim();

    console.log('Generated Email Draft: ', generatedText);

    const res = await db.insert(DraftsGenerationLog).values({ userId: userId })
        
    return NextResponse.json({ email: generatedText }, { status: 200 });

  } catch (error) {
    // Log the error for debugging purposes
    console.error('AI Generation Error:', error);
    
    // Return a generic 500 server error response
    return NextResponse.json(
      { error: 'An internal server error occurred during AI generation. ' + (error as Error).message },
      { status: 500 }
    );
  }
}