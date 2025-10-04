import { NextRequest, NextResponse } from 'next/server';
import { aiNavigator } from '@/services/ai-navigator';
import { mockAINavigator } from '@/services/mock-ai-navigator';

// Check if we should use mock mode
const USE_MOCK_MODE = !process.env.GEMINI_API_KEY || 
  process.env.GEMINI_API_KEY === 'AIzaSyDEMO_KEY_REPLACE_WITH_REAL_KEY_FOR_FULL_FUNCTIONALITY' ||
  process.env.GEMINI_API_KEY.startsWith('placeholder');

export async function POST(request: NextRequest) {
  try {
    const { questTheme, conversationHistory } = await request.json();

    if (!questTheme || !conversationHistory) {
      return NextResponse.json(
        { error: 'Quest theme and conversation history are required' },
        { status: 400 }
      );
    }

    const navigator = USE_MOCK_MODE ? mockAINavigator : aiNavigator;
    const followUpQuestion = await navigator.generateFollowUpQuestion(
      questTheme,
      conversationHistory
    );

    return NextResponse.json({ 
      question: followUpQuestion,
      mockMode: USE_MOCK_MODE 
    });
  } catch (error) {
    console.error('Error generating follow-up question:', error);
    return NextResponse.json(
      { error: 'Failed to generate follow-up question' },
      { status: 500 }
    );
  }
}
