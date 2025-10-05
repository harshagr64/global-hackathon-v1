import { gemini } from '@/lib/supbase/client';
import { ConversationMessage, BlogPost } from '@/types/memory-keeper';

export class AIStoryNavigator {
  private model = gemini.getGenerativeModel({ model: 'gemini-2.5-flash' });

  private extractJsonFromResponse(text: string): string {
    // Remove markdown code block formatting if present
    const codeBlockRegex = /```(?:json)?\s*([\s\S]*?)\s*```/;
    const match = text.match(codeBlockRegex);
    
    if (match) {
      return match[1].trim();
    }
    
    // If no code blocks, return the text as is (might already be clean JSON)
    return text.trim();
  }

  async generateFollowUpQuestion(
    questTheme: string,
    conversationHistory: ConversationMessage[]
  ): Promise<string> {
    const lastUserMessage = conversationHistory
      .filter(msg => msg.type === 'user')
      .slice(-1)[0];

    if (!lastUserMessage) {
      throw new Error('No user message found to generate follow-up');
    }

    const prompt = `You are a loving, curious grandchild who is absolutely fascinated by your grandparent's life stories and memories.

Quest Theme: "${questTheme}"
Last response from grandparent: "${lastUserMessage.content}"

Your personality:
- Warm, gentle, and genuinely excited to hear every detail
- Curious like a child who never gets tired of hearing stories
- Emotionally connected and caring
- Uses warm, affectionate language
- Shows genuine enthusiasm and wonder

Generate exactly ONE follow-up question that sounds like a loving grandchild asking:
- Be genuinely curious and excited about their memories
- Use warm, personal language ("Oh wow!", "That sounds amazing!", "I love hearing about...")
- Ask for vivid details that bring the story to life
- Show emotional connection to what they shared
- Express how much you treasure hearing their stories

Examples of your tone:
- "Oh my goodness, that sounds incredible! What did it feel like when...?"
- "I love hearing about this! Can you tell me more about...?"
- "Wow, I can almost picture it! What do you remember most about...?"
- "That's such a wonderful memory! I'm so curious about..."

Keep the question under 50 words and make it sound genuinely excited and caring.

Follow-up question:`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text().trim();
    } catch (error) {
      console.error('Error generating follow-up question:', error);
      return "Oh, that sounds so wonderful! I'm really enjoying hearing about this. Can you tell me more about what made that moment special for you?";
    }
  }

  async generateCustomQuestQuestion(customTopic: string): Promise<string> {
    const prompt = `
You are a loving, excited grandchild who just heard your grandparent wants to share memories about: "${customTopic}"

Generate a warm, enthusiastic opening question that sounds like a curious grandchild:
- Show genuine excitement about hearing their story
- Use warm, personal language with enthusiasm
- Ask for vivid details that bring memories to life  
- Express how much you treasure hearing about their experiences
- Sound eager and genuinely interested

Examples of your tone:
- "Oh wow, I'd love to hear about ${customTopic}! What's your favorite memory about...?"
- "That sounds so interesting! Can you tell me about a special time when...?"
- "I'm so excited to hear this story! What do you remember most about...?"

Keep it under 40 words and sound genuinely thrilled to hear their story.

Opening question:`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text().trim();
    } catch (error) {
      console.error('Error generating custom question:', error);
      return `Oh, I'm so excited to hear about ${customTopic}! Can you share a special memory that always makes you smile when you think about it?`;
    }
  }

  async generateBlogPost(
    questTitle: string,
    messages: ConversationMessage[]
  ): Promise<BlogPost> {
    const userMessages = messages
      .filter(msg => msg.type === 'user')
      .map(msg => msg.content)
      .join('\n\n');

    const prompt = `
You are a skilled narrative writer creating a legacy blog post from a grandparent's memories.

Quest: "${questTitle}"
Raw conversation transcript:
${userMessages}

Create a polished, third-person narrative blog post that:

1. BLOG POST CONTENT:
- Write in an engaging, warm third-person narrative style
- Organize the memories chronologically or thematically 
- Include emotional details and sensory descriptions they shared
- Make it suitable for family sharing
- Target length: 400-600 words
- Start with an engaging title

2. EXTRACT WISDOM:
- Identify 3-5 key life lessons or pieces of wisdom from their stories
- Format as quotable insights
- Keep each wisdom point to 1-2 sentences

3. FAMILY CONNECTION PROMPTS:
- Create 3-5 specific follow-up questions family members could ask
- Make them personal and based on details they shared
- Encourage deeper family conversations

Format your response as JSON:
{
  "title": "Blog post title",
  "content": "Full blog post content in markdown format",
  "wisdom": ["wisdom quote 1", "wisdom quote 2", ...],
  "familyPrompts": ["question 1", "question 2", ...]
}`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const cleanJsonText = this.extractJsonFromResponse(response.text());
      const jsonResponse = JSON.parse(cleanJsonText);
      
      return {
        title: jsonResponse.title,
        content: jsonResponse.content,
        wisdom: jsonResponse.wisdom,
        familyPrompts: jsonResponse.familyPrompts,
        generatedAt: new Date()
      };
    } catch (error) {
      console.error('Error generating blog post:', error);
      if (error instanceof SyntaxError) {
        // Log the raw response to help debug JSON parsing issues
        try {
          const result = await this.model.generateContent(prompt);
          const response = await result.response;
          console.error('Raw response that failed to parse:', response.text());
        } catch (debugError) {
          console.error('Could not retrieve raw response for debugging:', debugError);
        }
      }
      return {
        title: `Memories from ${questTitle}`,
        content: `This is a collection of precious memories shared about ${questTitle}. ${userMessages.slice(0, 200)}...`,
        wisdom: ["Every memory is a treasure to be shared", "Life's simple moments often hold the deepest meaning"],
        familyPrompts: ["What other memories do you have from this time?", "How did these experiences shape who you became?"],
        generatedAt: new Date()
      };
    }
  }
}

export const aiNavigator = new AIStoryNavigator();
