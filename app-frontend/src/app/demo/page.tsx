'use client';

import { useState } from 'react';
import { MemoryQuest, MemorySession, PREDEFINED_QUESTS } from '@/types/memory-keeper';
import { PlusCircle, Send, ArrowLeft, BookOpen, Heart, Share2, Download, Copy } from 'lucide-react';

type AppState = 'quest-selection' | 'conversation' | 'blog-post';

// Demo data for preview
const DEMO_SESSION: MemorySession = {
  id: 'demo-1',
  questId: 'high-school-years',
  questTitle: 'The High School Years',
  messages: [
    {
      id: '1',
      type: 'ai',
      content: "Let's start with your high school days. Tell me about your very first day of high school - what did you wear, and how were you feeling that morning?",
      timestamp: new Date()
    },
    {
      id: '2',
      type: 'user',
      content: "I wore a hand-me-down blue dress that belonged to my older sister. I remember being so nervous because I didn't know anyone at the school.",
      timestamp: new Date()
    },
    {
      id: '3',
      type: 'ai',
      content: "That sounds like such a tough day. When you say you felt 'very nervous,' what was the biggest worry in your mind? And did you make one friend that day who helped you feel better?",
      timestamp: new Date()
    },
    {
      id: '4',
      type: 'user',
      content: "My biggest worry was sitting alone at lunch. But actually, a girl named Mary noticed me standing alone and invited me to sit with her group. She became my best friend throughout high school.",
      timestamp: new Date()
    }
  ],
  startedAt: new Date(),
  completedAt: new Date()
};

const DEMO_BLOG_POST = {
  title: "A Blue Dress and the Beginning of a Beautiful Friendship",
  content: `The first day of high school can be daunting for any teenager, but for one young girl, it marked the beginning of a friendship that would last throughout her school years.

She remembers carefully choosing her outfit that morning - a hand-me-down blue dress that had belonged to her older sister. While the dress was beautiful, it couldn't quite mask the nervousness she felt about starting at a new school where she didn't know a single soul.

Her biggest fear, as she walked through those school doors, was the prospect of sitting alone at lunch. The cafeteria can be an intimidating place for any newcomer, and the thought of eating alone while surrounded by established friend groups was almost overwhelming.

But sometimes, life has a way of surprising us with unexpected kindness. Enter Mary - a girl who noticed her standing alone and made a choice that would change everything. With a simple invitation to join her table, Mary not only solved the immediate lunch crisis but also opened the door to what would become a cherished high school friendship.

That blue dress, which had started as a symbol of hand-me-down uncertainty, became part of a memory that would be treasured for years to come. It reminds us that sometimes our most anxious moments can lead to our most precious connections.`,
  wisdom: [
    "Sometimes the kindness of a stranger can change your entire day, and sometimes your entire life.",
    "The moments we fear the most often lead to the experiences we treasure the most.",
    "A simple act of inclusion can mean the world to someone who feels alone."
  ],
  familyPrompts: [
    "Ask about Mary - what was she like and how long did their friendship last?",
    "What other memories do you have of wearing hand-me-downs from family?",
    "Did you ever pay forward Mary's kindness by reaching out to someone who seemed alone?"
  ],
  generatedAt: new Date()
};

export default function DemoPage() {
  const [appState, setAppState] = useState<AppState>('quest-selection');
  const [selectedQuest, setSelectedQuest] = useState<MemoryQuest | null>(null);

  const DemoQuestSelector = () => (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Memory Keeper
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Share your precious memories and create beautiful stories for your family. 
          Choose a memory quest below or tell us about anything else on your mind.
        </p>
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            🎭 <strong>Demo Mode</strong> - This is a preview of the Memory Keeper interface. 
            Click any quest to see how the conversation and story generation works!
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {PREDEFINED_QUESTS.map((quest) => (
          <div
            key={quest.id}
            onClick={() => {
              setSelectedQuest(quest);
              setAppState('conversation');
            }}
            className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer p-6 border-2 border-gray-200 hover:border-blue-300"
          >
            <div className="flex items-center mb-4">
              <span className="text-3xl mr-3">{quest.icon}</span>
              <h3 className="text-xl font-semibold text-gray-800">{quest.title}</h3>
            </div>
            <p className="text-gray-600 mb-4">{quest.description}</p>
            <div className="text-sm text-blue-600 font-medium">
              Click to start sharing →
            </div>
          </div>
        ))}
      </div>

      <div className="bg-gray-50 rounded-lg p-6 border-2 border-dashed border-gray-300">
        <div className="flex items-center mb-4">
          <PlusCircle className="text-2xl mr-3 text-blue-600" size={32} />
          <h3 className="text-xl font-semibold text-gray-800">
            Create Your Own Memory Quest
          </h3>
        </div>
        <p className="text-gray-600 mb-4">
          Have something else on your mind? Tell us what you&apos;d like to share memories about.
        </p>
        <button
          onClick={() => {
            setSelectedQuest({
              id: 'demo-custom',
              title: 'Custom Memory Topic',
              description: 'Demo custom quest',
              icon: '💭',
              initialQuestion: 'Tell me about a special memory that comes to mind...',
              isCustom: true
            });
            setAppState('conversation');
          }}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Try Custom Quest (Demo)
        </button>
      </div>
    </div>
  );

  const DemoConversation = () => (
    <div className="max-w-4xl mx-auto p-6 h-screen flex flex-col">
      <div className="flex items-center justify-between mb-6 bg-white rounded-lg shadow-sm p-4">
        <div className="flex items-center">
          <button
            onClick={() => setAppState('quest-selection')}
            className="mr-4 text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft size={24} />
          </button>
          <span className="text-2xl mr-3">{selectedQuest?.icon}</span>
          <div>
            <h2 className="text-xl font-semibold text-gray-800">{selectedQuest?.title}</h2>
            <p className="text-sm text-gray-600">Demo conversation with sample responses</p>
          </div>
        </div>
        
        <button
          onClick={() => setAppState('blog-post')}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
        >
          <BookOpen size={16} />
          Create Story
        </button>
      </div>

      <div className="flex-1 overflow-y-auto bg-gray-50 rounded-lg p-4 mb-4">
        <div className="space-y-4">
          {DEMO_SESSION.messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-3xl px-4 py-3 rounded-lg ${
                  message.type === 'user'
                    ? 'bg-blue-600 text-white ml-12'
                    : 'bg-white text-gray-800 shadow-sm mr-12'
                }`}
              >
                <p className="text-sm leading-relaxed">{message.content}</p>
                <p className={`text-xs mt-2 ${
                  message.type === 'user' ? 'text-blue-100' : 'text-gray-500'
                }`}>
                  {message.timestamp.toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex gap-3">
          <textarea
            placeholder="In demo mode, you can see the sample conversation above. Click 'Create Story' to see the blog post generation!"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none min-h-[60px]"
            rows={2}
            disabled
          />
          
          <button
            disabled
            className="bg-gray-400 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <Send size={16} />
            Demo Mode
          </button>
        </div>
        
        <p className="text-xs text-gray-500 mt-2">
          🎭 Demo Mode: Experience how the AI generates thoughtful follow-up questions. 
          Click &apos;Create Story&apos; to see the beautiful blog post generation!
        </p>
      </div>
    </div>
  );

  const DemoBlogPost = () => (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <button
            onClick={() => setAppState('conversation')}
            className="mr-4 text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Your Memory Story</h1>
            <p className="text-sm text-gray-600">
              Demo generated story • {DEMO_BLOG_POST.generatedAt.toLocaleDateString()}
            </p>
          </div>
        </div>
        
        <div className="flex gap-3">
          <button className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2">
            <Download size={16} />
            Download
          </button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
            <Copy size={16} />
            Copy Story
          </button>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <p className="text-sm text-blue-800">
          🎭 <strong>Demo Generated Story</strong> - This is an example of how the AI transforms 
          raw conversation into a beautiful, shareable narrative with wisdom and family prompts.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          {DEMO_BLOG_POST.title}
        </h1>
        
        <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
          {DEMO_BLOG_POST.content.split('\n\n').map((paragraph, index) => (
            <p key={index} className="mb-4">
              {paragraph}
            </p>
          ))}
        </div>
      </div>

      <div className="bg-amber-50 border-l-4 border-amber-400 rounded-lg p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-amber-800 flex items-center gap-2">
            <Heart className="text-amber-600" size={20} />
            Grandparent&apos;s Wisdom
          </h3>
        </div>
        <div className="space-y-3">
          {DEMO_BLOG_POST.wisdom.map((wisdom, index) => (
            <blockquote key={index} className="text-amber-800 italic border-l-2 border-amber-300 pl-4">
              &quot;{wisdom}&quot;
            </blockquote>
          ))}
        </div>
      </div>

      <div className="bg-blue-50 border-l-4 border-blue-400 rounded-lg p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-blue-800 flex items-center gap-2">
            <Share2 className="text-blue-600" size={20} />
            What to Ask Next
          </h3>
        </div>
        <p className="text-blue-700 mb-4">
          Perfect conversation starters for family gatherings:
        </p>
        <ul className="space-y-2">
          {DEMO_BLOG_POST.familyPrompts.map((prompt, index) => (
            <li key={index} className="text-blue-800 flex items-start gap-2">
              <span className="text-blue-400 mt-1">•</span>
              {prompt}
            </li>
          ))}
        </ul>
      </div>

      <div className="text-center">
        <button
          onClick={() => setAppState('quest-selection')}
          className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-colors text-lg font-medium"
        >
          Try Another Memory Quest
        </button>
        <p className="text-gray-600 mt-4">
          🎭 Demo complete! In the real app, you&apos;d have many more conversation turns and even richer stories.
        </p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {appState === 'quest-selection' && <DemoQuestSelector />}
      {appState === 'conversation' && <DemoConversation />}
      {appState === 'blog-post' && <DemoBlogPost />}
    </div>
  );
}
