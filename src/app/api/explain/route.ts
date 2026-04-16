import { NextResponse } from 'next/server';
import { generateText } from 'ai';
import { groq } from '@ai-sdk/groq';

export const runtime = "edge";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { topic, level } = body;

    // validation
    if (!topic || typeof topic !== 'string' || topic.trim().length < 3 || topic.length > 300) {
      return NextResponse.json({ 
        data: null, 
        error: { code: 'INVALID_INPUT', message: 'Topic must be between 3 and 300 characters' } 
      }, { status: 400 });
    }

    if (!['eli5', 'beginner', 'detailed'].includes(level)) {
      return NextResponse.json({ 
        data: null, 
        error: { code: 'INVALID_INPUT', message: 'Level must be eli5, beginner, or detailed' } 
      }, { status: 400 });
    }

    const prompt = `Topic: ${topic.trim()}\nLevel: ${level}`;
    const system = `You are an expert teacher. Return ONLY valid JSON. Explain the topic based on the selected level:
- eli5: explain like to a 5-year-old
- beginner: simple explanation with basic clarity
- detailed: slightly deeper but still easy to understand

Always include explanation, example, and analogy. Keep language clear and concise. No extra fields.
Format output strictly as:
{
  "explanation": "...",
  "example": "...",
  "analogy": "..."
}`;

    const { text } = await generateText({
      model: groq('llama-3.1-8b-instant'),
      system,
      prompt,
    });
    
    let object;
    try {
      // Safely extract the JSON block out of the text if the model spits out markdown formatting
      const match = text.match(/\{[\s\S]*\}/);
      object = JSON.parse(match ? match[0] : text);
    } catch(e) {
      throw new Error("Failed to parse JSON explanation.");
    }

    return NextResponse.json({ data: object, error: null });

  } catch (error: any) {
    console.error("API Explain Error:", error);

    return NextResponse.json({ 
      data: null, 
      error: { code: 'MODEL_ERROR', message: error.message || 'Error generating explanation' } 
    }, { status: 500 });
  }
}
