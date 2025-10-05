import { ConversationMessage, BlogPost } from '@/types/memory-keeper';

// Mock AI responses for development/demo purposes
const MOCK_FOLLOW_UP_QUESTIONS = [
  "That sounds fascinating! Can you tell me more about how that made you feel?",
  "What a wonderful memory! What details from that day still stand out to you?",
  "That must have been quite an experience. Who else was there with you?",
  "How interesting! What happened next in that story?",
  "That sounds like it was really meaningful to you. What made it so special?",
  "I'd love to hear more about that. What was going through your mind at the time?",
  "What a great story! Can you describe what you saw, heard, or smelled that day?",
  "That sounds like it shaped who you are today. How did that experience change you?"
];

const MOCK_CUSTOM_QUESTIONS = [
  "Tell me about a special memory you have related to that topic. What made it so meaningful to you?",
  "I'd love to hear about your experiences with that. Can you share a story that comes to mind?",
  "That sounds like something important to you. What's your favorite memory related to that?",
  "Can you take me back to a moment when that was particularly significant in your life?"
];

export class MockAINavigator {
  private questionIndex = 0;

  async generateFollowUpQuestion(
    _questTheme: string,
    _conversationHistory: ConversationMessage[]
  ): Promise<string> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

    const question = MOCK_FOLLOW_UP_QUESTIONS[this.questionIndex % MOCK_FOLLOW_UP_QUESTIONS.length];
    this.questionIndex++;
    return question;
  }

  async generateCustomQuestQuestion(customTopic: string): Promise<string> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    const baseQuestion = MOCK_CUSTOM_QUESTIONS[Math.floor(Math.random() * MOCK_CUSTOM_QUESTIONS.length)];
    return baseQuestion.replace('that topic', customTopic).replace('that', customTopic);
  }

  async generateBlogPost(
    questTitle: string,
    messages: ConversationMessage[]
  ): Promise<BlogPost> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 3000));

    const userMessages = messages
      .filter(msg => msg.type === 'user')
      .map(msg => msg.content);

    const mockBlogPost: BlogPost = {
      title: `Memories from ${questTitle}`,
      content: `This is a beautiful collection of memories shared about ${questTitle}.

${userMessages.length > 0 ? userMessages[0].substring(0, 200) + '...' : 'These precious memories tell a story of experiences that have shaped a lifetime of wisdom and love.'}

The stories shared reveal not just events, but the emotions, relationships, and moments that truly matter. Each memory is a thread in the rich tapestry of a life well-lived.

These memories remind us that our experiences, both big and small, create the foundation of who we are and the wisdom we pass on to future generations.`,
      wisdom: [
        "Every memory is a treasure to be shared with those we love.",
        "Life's most precious moments often come from the simplest experiences.",
        "The stories we tell become the legacy we leave behind."
      ],
      familyPrompts: [
        `What other memories do you have from the time period of ${questTitle}?`,
        "How did these experiences influence the person you became?",
        "Are there similar stories from your own life that this reminds you of?"
      ],
      generatedAt: new Date()
    };

    return mockBlogPost;
  }
}

export const mockAINavigator = new MockAINavigator();
