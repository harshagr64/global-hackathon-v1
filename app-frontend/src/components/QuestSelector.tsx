'use client';

import { useState } from 'react';
import { MemoryQuest, PREDEFINED_QUESTS } from '@/types/memory-keeper';
import { PlusCircle, Send } from 'lucide-react';

interface QuestSelectorProps {
  onQuestSelected: (quest: MemoryQuest) => void;
}

export default function QuestSelector({ onQuestSelected }: QuestSelectorProps) {
  const [showCustomQuest, setShowCustomQuest] = useState(false);
  const [customTopic, setCustomTopic] = useState('');
  const [isGeneratingCustom, setIsGeneratingCustom] = useState(false);

  const handleCustomQuestSubmit = async () => {
    if (!customTopic.trim()) return;

    setIsGeneratingCustom(true);
    
    try {
      const response = await fetch('/api/generate-custom-question', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customTopic: customTopic.trim() })
      });

      if (!response.ok) throw new Error('Failed to generate custom question');

      const { question } = await response.json();

      const customQuest: MemoryQuest = {
        id: `custom-${Date.now()}`,
        title: customTopic.trim(),
        description: `Share your memories about ${customTopic.trim()}`,
        icon: '💭',
        initialQuestion: question,
        isCustom: true
      };

      onQuestSelected(customQuest);
    } catch (error) {
      console.error('Error creating custom quest:', error);
      alert('Sorry, there was an error creating your custom memory quest. Please try again.');
    } finally {
      setIsGeneratingCustom(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Memory Keeper
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Share your precious memories and create beautiful stories for your family. 
          Choose a memory quest below or tell us about anything else on your mind.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {PREDEFINED_QUESTS.map((quest) => (
          <div
            key={quest.id}
            onClick={() => onQuestSelected(quest)}
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
        
        {!showCustomQuest ? (
          <div>
            <p className="text-gray-600 mb-4">
              Have something else on your mind? Tell us what you&apos;d like to share memories about.
            </p>
            <button
              onClick={() => setShowCustomQuest(true)}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create Custom Quest
            </button>
          </div>
        ) : (
          <div>
            <p className="text-gray-600 mb-4">
              What would you like to share memories about today?
            </p>
            <div className="flex gap-3">
              <input
                type="text"
                value={customTopic}
                onChange={(e) => setCustomTopic(e.target.value)}
                placeholder="e.g., My childhood pets, Family traditions, Travel adventures..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                onKeyPress={(e) => e.key === 'Enter' && handleCustomQuestSubmit()}
                disabled={isGeneratingCustom}
              />
              <button
                onClick={handleCustomQuestSubmit}
                disabled={!customTopic.trim() || isGeneratingCustom}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 flex items-center gap-2"
              >
                {isGeneratingCustom ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                ) : (
                  <Send size={16} />
                )}
                {isGeneratingCustom ? 'Creating...' : 'Start'}
              </button>
            </div>
            <button
              onClick={() => {
                setShowCustomQuest(false);
                setCustomTopic('');
              }}
              className="text-gray-500 text-sm mt-2 hover:text-gray-700"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
