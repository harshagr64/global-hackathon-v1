import { NextRequest, NextResponse } from 'next/server';
import { gemini } from '@/lib/supbase/client';

export async function GET() {
  try {
    // Try different model names to see which one works
    const modelNames = [
      'gemini-pro',
      'gemini-1.5-flash',
      'gemini-1.5-pro',
      'models/gemini-pro',
      'models/gemini-1.5-flash',
      'models/gemini-1.5-pro'
    ];

    const results = [];

    for (const modelName of modelNames) {
      try {
        const model = gemini.getGenerativeModel({ model: modelName });
        const result = await model.generateContent('Hello, test message');
        const response = await result.response;
        const text = response.text();
        
        results.push({
          modelName,
          status: 'success',
          response: text.substring(0, 100) + '...'
        });
      } catch (error: unknown) {
        results.push({
          modelName,
          status: 'error',
          error: error instanceof Error ? error.message.substring(0, 200) : 'Unknown error'
        });
      }
    }

    return NextResponse.json({ results });
  } catch (error) {
    console.error('Error testing models:', error);
    return NextResponse.json(
      { error: 'Failed to test models' },
      { status: 500 }
    );
  }
}
