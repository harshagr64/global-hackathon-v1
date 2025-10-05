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

    const prompt = `You are an empathetic AI story navigator helping a grandparent share their life memories. 

Quest Theme: "${questTheme}"
Last response from grandparent: "${lastUserMessage.content}"

Your role is to:
1. Be emotionally intelligent and pick up on emotional cues in their response
2. Ask follow-up questions that add depth and detail to their story
3. Help them explore the feelings and significance behind their memories
4. Keep questions conversational and warm, like a caring grandchild would ask

Generate exactly ONE follow-up question that:
- Builds on their previous answer specifically
- Adds emotional depth or asks for more sensory details
- Feels natural and caring
- Encourages them to share more of the story

Keep the question under 50 words and make it feel personal and genuine.

Follow-up question:`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text().trim();
    } catch (error) {
      console.error('Error generating follow-up question:', error);
      return "That sounds fascinating! Can you tell me more about how that made you feel?";
    }
  }

  async generateCustomQuestQuestion(customTopic: string): Promise<string> {
    const prompt = `
You are an empathetic AI helping a grandparent share memories about: "${customTopic}"

Generate a warm, engaging opening question that:
- Invites them to share a specific memory or story about this topic
- Feels conversational and caring
- Asks for concrete details (where, when, who, what they felt)
- Is under 40 words

Opening question:`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text().trim();
    } catch (error) {
      console.error('Error generating custom question:', error);
      return `Tell me about a special memory you have related to ${customTopic}. What made it so meaningful to you?`;
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
