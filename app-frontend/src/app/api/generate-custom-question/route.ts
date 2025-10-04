import { NextRequest, NextResponse } from 'next/server';
import { aiNavigator } from '@/services/ai-navigator';
import { mockAINavigator } from '@/services/mock-ai-navigator';

// Check if we should use mock mode
const USE_MOCK_MODE = !process.env.GEMINI_API_KEY || 
  process.env.GEMINI_API_KEY === 'AIzaSyDEMO_KEY_REPLACE_WITH_REAL_KEY_FOR_FULL_FUNCTIONALITY' ||
  process.env.GEMINI_API_KEY.startsWith('placeholder');

export async function POST(request: NextRequest) {
  try {
    const { customTopic } = await request.json();

    if (!customTopic) {
      return NextResponse.json(
        { error: 'Custom topic is required' },
        { status: 400 }
      );
    }

    const navigator = USE_MOCK_MODE ? mockAINavigator : aiNavigator;
    const question = await navigator.generateCustomQuestQuestion(customTopic);

    return NextResponse.json({ 
      question,
      mockMode: USE_MOCK_MODE 
    });
  } catch (error) {
    console.error('Error generating custom question:', error);
    return NextResponse.json(
      { error: 'Failed to generate custom question' },
      { status: 500 }
    );
  }
}
