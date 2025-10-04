import { NextRequest, NextResponse } from 'next/server';
import { aiNavigator } from '@/services/ai-navigator';
import { mockAINavigator } from '@/services/mock-ai-navigator';

// Check if we should use mock mode
const USE_MOCK_MODE = !process.env.GEMINI_API_KEY || 
  process.env.GEMINI_API_KEY === 'AIzaSyDEMO_KEY_REPLACE_WITH_REAL_KEY_FOR_FULL_FUNCTIONALITY' ||
  process.env.GEMINI_API_KEY.startsWith('placeholder');

export async function POST(request: NextRequest) {
  try {
    const { questTitle, messages } = await request.json();

    if (!questTitle || !messages) {
      return NextResponse.json(
        { error: 'Quest title and messages are required' },
        { status: 400 }
      );
    }

    const navigator = USE_MOCK_MODE ? mockAINavigator : aiNavigator;
    const blogPost = await navigator.generateBlogPost(questTitle, messages);

    return NextResponse.json({
      ...blogPost,
      mockMode: USE_MOCK_MODE
    });
  } catch (error) {
    console.error('Error generating blog post:', error);
    return NextResponse.json(
      { error: 'Failed to generate blog post' },
      { status: 500 }
    );
  }
}
