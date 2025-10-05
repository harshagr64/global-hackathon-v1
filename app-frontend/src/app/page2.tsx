'use client';

import { useState } from 'react';
import { MemoryQuest, MemorySession } from '@/types/memory-keeper';
import QuestSelector from '@/components/QuestSelector';
import ConversationInterface from '@/components/ConversationInterface';
import BlogPostViewer from '@/components/BlogPostViewer';

type AppState = 'quest-selection' | 'conversation' | 'blog-post';

export default function Home() {
  const [appState, setAppState] = useState<AppState>('quest-selection');
  const [selectedQuest, setSelectedQuest] = useState<MemoryQuest | null>(null);
  const [completedSession, setCompletedSession] = useState<MemorySession | null>(null);

  const handleQuestSelected = (quest: MemoryQuest) => {
    setSelectedQuest(quest);
    setAppState('conversation');
  };

  const handleBackToQuestSelection = () => {
    setSelectedQuest(null);
    setCompletedSession(null);
    setAppState('quest-selection');
  };

  const handleSessionComplete = (session: MemorySession) => {
    setCompletedSession(session);
    setAppState('blog-post');
  };

  const handleBackToConversation = () => {
    setAppState('conversation');
  };

  const handleStartNewQuest = () => {
    setSelectedQuest(null);
    setCompletedSession(null);
    setAppState('quest-selection');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {appState === 'quest-selection' && (
        <QuestSelector onQuestSelected={handleQuestSelected} />
      )}

      {appState === 'conversation' && selectedQuest && (
        <ConversationInterface
          quest={selectedQuest}
          onBack={handleBackToQuestSelection}
          onSessionComplete={handleSessionComplete}
        />
      )}

      {appState === 'blog-post' && completedSession && (
        <BlogPostViewer
          session={completedSession}
          onBack={handleBackToConversation}
          onStartNewQuest={handleStartNewQuest}
        />
      )}
    </div>
  );
}
