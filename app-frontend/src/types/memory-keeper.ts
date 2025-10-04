export interface MemoryQuest {
  id: string;
  title: string;
  description: string;
  icon: string;
  initialQuestion: string;
  isCustom?: boolean;
}

export interface ConversationMessage {
  id: string;
  type: 'ai' | 'user';
  content: string;
  timestamp: Date;
}

export interface MemorySession {
  id: string;
  questId: string;
  questTitle: string;
  messages: ConversationMessage[];
  startedAt: Date;
  completedAt?: Date;
  blogPost?: string;
  wisdom?: string[];
  familyPrompts?: string[];
}

export interface BlogPost {
  title: string;
  content: string;
  wisdom: string[];
  familyPrompts: string[];
  generatedAt: Date;
}

export const PREDEFINED_QUESTS: MemoryQuest[] = [
  {
    id: 'high-school-years',
    title: 'The High School Years',
    description: 'Journey back to your teenage years and share the memories that shaped you',
    icon: '🎓',
    initialQuestion: "Let's start with your high school days. Tell me about your very first day of high school - what did you wear, and how were you feeling that morning?"
  },
  {
    id: 'first-jobs',
    title: 'A Decade of First Jobs',
    description: 'Share stories about your early working life and career beginnings',
    icon: '💼',
    initialQuestion: "I'd love to hear about your first real job. How did you find it, and what was your very first day like at work?"
  },
  {
    id: 'building-home',
    title: 'Building a Family Home',
    description: 'Tell us about creating a home and the memories within those walls',
    icon: '🏠',
    initialQuestion: "Tell me about a home that was really special to you. What made it feel like home, and what's your favorite memory from that place?"
  },
  {
    id: 'love-story',
    title: 'Your Love Story',
    description: 'Share the romantic journey that brought you together with your partner',
    icon: '❤️',
    initialQuestion: "Let's talk about love! Tell me about the moment you first met your partner - where were you, and what was your first impression?"
  }
];
