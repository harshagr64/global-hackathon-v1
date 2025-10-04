'use client';

import { useState, useRef, useEffect } from 'react';
import { MemoryQuest, ConversationMessage, MemorySession } from '@/types/memory-keeper';
import { Send, ArrowLeft, BookOpen, Mic, MicOff } from 'lucide-react';

interface ConversationInterfaceProps {
  quest: MemoryQuest;
  onBack: () => void;
  onSessionComplete: (session: MemorySession) => void;
}

export default function ConversationInterface({ 
  quest, 
  onBack, 
  onSessionComplete 
}: ConversationInterfaceProps) {
  const [messages, setMessages] = useState<ConversationMessage[]>([
    {
      id: '1',
      type: 'ai',
      content: quest.initialQuestion,
      timestamp: new Date()
    }
  ]);
  const [currentInput, setCurrentInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isMockMode, setIsMockMode] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null); // eslint-disable-line @typescript-eslint/no-explicit-any

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition; // eslint-disable-line @typescript-eslint/no-explicit-any
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onresult = (event: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }
        if (finalTranscript) {
          setCurrentInput(prev => prev + finalTranscript);
        }
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in your browser');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const handleSendMessage = async () => {
    if (!currentInput.trim() || isLoading) return;

    const userMessage: ConversationMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: currentInput.trim(),
      timestamp: new Date()
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setCurrentInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/generate-question', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questTheme: quest.title,
          conversationHistory: newMessages
        })
      });

      if (!response.ok) throw new Error('Failed to generate follow-up question');

      const { question, mockMode } = await response.json();
      setIsMockMode(mockMode);

      const aiMessage: ConversationMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: question,
        timestamp: new Date()
      };

      setMessages([...newMessages, aiMessage]);
    } catch (error) {
      console.error('Error generating follow-up:', error);
      const errorMessage: ConversationMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: "I'd love to hear more about that. Can you tell me another detail that stood out to you?",
        timestamp: new Date()
      };
      setMessages([...newMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFinishSession = () => {
    const session: MemorySession = {
      id: Date.now().toString(),
      questId: quest.id,
      questTitle: quest.title,
      messages,
      startedAt: new Date(messages[0].timestamp),
      completedAt: new Date()
    };

    onSessionComplete(session);
  };

  const userMessageCount = messages.filter(m => m.type === 'user').length;

  return (
    <div className="max-w-4xl mx-auto p-6 h-screen flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 bg-white rounded-lg shadow-sm p-4">
        <div className="flex items-center">
          <button
            onClick={onBack}
            className="mr-4 text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft size={24} />
          </button>
          <span className="text-2xl mr-3">{quest.icon}</span>
          <div>
            <h2 className="text-xl font-semibold text-gray-800">{quest.title}</h2>
            <p className="text-sm text-gray-600">
              {userMessageCount} responses shared
              {isMockMode && ' • Mock Mode Active'}
            </p>
          </div>
        </div>
        
        {isMockMode && (
          <div className="bg-orange-100 border border-orange-300 rounded-lg px-3 py-2 mr-4">
            <p className="text-xs text-orange-800">
              🤖 <strong>Mock Mode</strong> - Add your Gemini API key for real AI responses
            </p>
          </div>
        )}
        
        {userMessageCount >= 3 && (
          <button
            onClick={handleFinishSession}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
          >
            <BookOpen size={16} />
            Create Story
          </button>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto bg-gray-50 rounded-lg p-4 mb-4">
        <div className="space-y-4">
          {messages.map((message) => (
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
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white text-gray-800 shadow-sm mr-12 px-4 py-3 rounded-lg">
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent"></div>
                  <span className="text-sm">Thinking of a thoughtful question...</span>
                </div>
              </div>
            </div>
          )}
        </div>
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex gap-3">
          <button
            onClick={toggleListening}
            className={`px-3 py-2 rounded-lg transition-colors ${
              isListening 
                ? 'bg-red-600 text-white hover:bg-red-700' 
                : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
            }`}
            title={isListening ? 'Stop recording' : 'Start voice input'}
          >
            {isListening ? <MicOff size={20} /> : <Mic size={20} />}
          </button>
          
          <textarea
            value={currentInput}
            onChange={(e) => setCurrentInput(e.target.value)}
            placeholder="Share your memory here... Feel free to include as many details as you'd like!"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none min-h-[60px]"
            rows={2}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            disabled={isLoading}
          />
          
          <button
            onClick={handleSendMessage}
            disabled={!currentInput.trim() || isLoading}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 flex items-center gap-2"
          >
            <Send size={16} />
            Share
          </button>
        </div>
        
        <p className="text-xs text-gray-500 mt-2">
          Press Enter to send, Shift+Enter for new line. 
          {userMessageCount < 3 
            ? ` Share ${3 - userMessageCount} more responses to create your story.`
            : ' You can create your story now or continue sharing!'
          }
        </p>
      </div>
    </div>
  );
}
