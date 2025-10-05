'use client';

import { useState, useRef, useEffect } from 'react';
import { MemoryQuest, ConversationMessage, MemorySession } from '@/types/memory-keeper';
import { Send, ArrowLeft, BookOpen, Mic, MicOff, Volume2, VolumeX } from 'lucide-react';

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
  console.log('ConversationInterface: Voice Assistant Component Loaded');
  
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
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [autoSpeak, setAutoSpeak] = useState(true);
  const [voicesLoaded, setVoicesLoaded] = useState(false);
  const [userInteracted, setUserInteracted] = useState(false);
  const lastSpeechRequest = useRef<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null); // eslint-disable-line @typescript-eslint/no-explicit-any

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Track user interaction for speech synthesis (required by browsers)
  useEffect(() => {
    const handleUserInteraction = () => {
      setUserInteracted(true);
      console.log('User interaction detected - speech synthesis enabled');
    };

    document.addEventListener('click', handleUserInteraction);
    document.addEventListener('keydown', handleUserInteraction);

    return () => {
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('keydown', handleUserInteraction);
    };
  }, []);

  // Load voices and set up speech synthesis
  useEffect(() => {
    if ('speechSynthesis' in window) {
      const loadVoices = () => {
        const voices = window.speechSynthesis.getVoices();
        console.log('Loading voices, found:', voices.length);
        if (voices.length > 0) {
          setVoicesLoaded(true);
          console.log('Voices loaded successfully:', voices.map(v => v.name));
        } else {
          // Sometimes voices take time to load, retry after a short delay
          setTimeout(() => {
            const retryVoices = window.speechSynthesis.getVoices();
            if (retryVoices.length > 0) {
              setVoicesLoaded(true);
              console.log('Voices loaded on retry:', retryVoices.length);
            }
          }, 100);
        }
      };

      // Load voices immediately if available
      loadVoices();

      // Also listen for the voiceschanged event
      window.speechSynthesis.addEventListener('voiceschanged', loadVoices);

      return () => {
        window.speechSynthesis.removeEventListener('voiceschanged', loadVoices);
      };
    } else {
      console.warn('Speech synthesis not supported in this browser');
    }
  }, []);

  // Speak the initial question when component loads and voices are ready
  useEffect(() => {
    if (autoSpeak && voicesLoaded && userInteracted && messages.length === 1 && messages[0].type === 'ai') {
      // Delay to ensure component is fully loaded and voices are available
      setTimeout(() => {
        console.log('Speaking initial message:', messages[0].content);
        speakText(messages[0].content);
      }, 800);
    }
  }, [autoSpeak, voicesLoaded, userInteracted, messages]);

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition; // eslint-disable-line @typescript-eslint/no-explicit-any
      
      if (SpeechRecognition) {
        try {
          recognitionRef.current = new SpeechRecognition();
          recognitionRef.current.continuous = true;
          recognitionRef.current.interimResults = true;
          recognitionRef.current.lang = 'en-US';
          recognitionRef.current.maxAlternatives = 1;

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
            console.log('Speech recognition ended');
            setIsListening(false);
          };

          recognitionRef.current.onerror = (event: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
            console.error('Speech recognition error:', event.error);
            setIsListening(false);
            
            // Handle specific errors
            switch(event.error) {
              case 'not-allowed':
                alert('Microphone access denied. Please allow microphone access and try again.');
                break;
              case 'no-speech':
                console.log('No speech detected, continuing...');
                break;
              case 'audio-capture':
                alert('No microphone found. Please check your audio settings.');
                break;
              case 'network':
                alert('Network error occurred during speech recognition.');
                break;
              default:
                console.log('Speech recognition error:', event.error);
            }
          };

          recognitionRef.current.onstart = () => {
            console.log('Speech recognition started');
          };

        } catch (error) {
          console.error('Error initializing speech recognition:', error);
        }
      } else {
        console.log('Speech recognition not supported in this browser');
      }
    }
  }, []);

  // Cleanup effect - stop speech and recognition when component unmounts
  useEffect(() => {
    return () => {
      // Stop speech synthesis
      if ('speechSynthesis' in window && window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
      }
      
      // Stop speech recognition
      if (recognitionRef.current && isListening) {
        try {
          recognitionRef.current.stop();
        } catch (error) {
          console.log('Error stopping recognition on cleanup:', error);
        }
      }
    };
  }, [isListening]);

  // Text-to-Speech functionality
  const speakText = (text: string) => {
    console.log('Attempting to speak:', text);
    console.log('Auto-speak:', autoSpeak, 'User interacted:', userInteracted, 'Voices loaded:', voicesLoaded);
    
    // Prevent duplicate requests for the same text
    if (lastSpeechRequest.current === text && isSpeaking) {
      console.log('Ignoring duplicate speech request');
      return;
    }
    
    lastSpeechRequest.current = text;
    
    if (!('speechSynthesis' in window)) {
      console.error('Speech synthesis not supported');
      return;
    }

    if (!autoSpeak) {
      console.log('Auto-speak is disabled');
      return;
    }

    if (!userInteracted) {
      console.log('Waiting for user interaction before speaking');
      return;
    }

    try {
      // Only cancel if something is currently speaking
      if (window.speechSynthesis.speaking) {
        console.log('Canceling previous speech...');
        window.speechSynthesis.cancel();
        // Small delay to allow cancellation to complete
        setTimeout(() => startSpeech(text), 150);
      } else {
        startSpeech(text);
      }
    } catch (error) {
      console.error('Error in speakText:', error);
      setIsSpeaking(false);
    }
  };

  const startSpeech = (text: string) => {
    try {
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Enhanced voice parameters for warmth, curiosity, and human-like quality
      utterance.rate = 0.75; // Slower, more conversational pace - like a caring grandparent
      utterance.pitch = 1.2; // Warmer, more nurturing pitch 
      utterance.volume = 0.8; // Clear but gentle volume
      
      // Add natural pauses for curiosity and warmth
      const enhancedText = text
        .replace(/\?/g, '? ') // Slight pause after questions for curiosity
        .replace(/\./g, '. ') // Pause after statements for thoughtfulness
        .replace(/,/g, ', ') // Natural pauses for flow
        .replace(/!/g, '! '); // Enthusiastic pauses
      
      utterance.text = enhancedText;
      
      // Get voices and select the warmest, most human-like voice
      const voices = window.speechSynthesis.getVoices();
      console.log('Available voices for speech:', voices.length);
      
      if (voices.length > 0) {
        // Prioritize warm, nurturing voices - like a caring friend or family member
        const preferredVoice = voices.find(voice => 
          voice.lang.startsWith('en') && (
            // Premium warm voices
            voice.name.includes('Samantha') || // macOS warm voice
            voice.name.includes('Moira') ||    // macOS friendly voice
            voice.name.includes('Fiona') ||    // macOS Scottish accent
            voice.name.includes('Karen') ||    // Australian warm voice
            voice.name.includes('Tessa') ||    // South African warm voice
            // Google female voices (usually warmer)
            (voice.name.includes('Google') && voice.name.toLowerCase().includes('female')) ||
            // Microsoft warm voices
            voice.name.includes('Zira') ||     // Microsoft warm female voice
            voice.name.includes('Hazel') ||    // Microsoft UK voice
            // Generic female indicators
            voice.name.toLowerCase().includes('female') ||
            voice.name.toLowerCase().includes('woman') ||
            voice.name.toLowerCase().includes('girl')
          )
        ) || voices.find(voice => 
          // Fallback to any good English voice
          voice.lang.startsWith('en') && (
            voice.name.includes('Google') || 
            voice.name.includes('Microsoft') ||
            voice.name.includes('Apple') ||
            voice.name.includes('Natural') ||
            voice.name.includes('Enhanced')
          )
        ) || voices.find(voice => 
          // Any English voice
          voice.lang.startsWith('en-US') || voice.lang.startsWith('en-GB')
        ) || voices.find(voice => 
          voice.lang.startsWith('en')
        ) || voices[0];
        
        if (preferredVoice) {
          utterance.voice = preferredVoice;
          console.log('Using warm voice:', preferredVoice.name, 'Language:', preferredVoice.lang);
        } else {
          console.log('No preferred voice found, using default');
        }
      } else {
        console.warn('No voices available for speech synthesis');
      }
      
      utterance.onstart = () => {
        console.log('Speech started');
        setIsSpeaking(true);
      };
      
      utterance.onend = () => {
        console.log('Speech ended');
        setIsSpeaking(false);
      };
      
      utterance.onerror = (event) => {
        // Don't log "canceled" errors as they're expected when interrupting speech
        if (event.error !== 'canceled') {
          console.error('Speech synthesis error:', event.error);
          // Handle specific errors
          switch(event.error) {
            case 'network':
              console.log('Network error during speech synthesis');
              break;
            case 'synthesis-failed':
              console.log('Speech synthesis failed');
              break;
            case 'synthesis-unavailable':
              console.log('Speech synthesis unavailable');
              break;
            default:
              console.log('Unknown speech synthesis error:', event.error);
          }
        } else {
          console.log('Speech was canceled (this is normal when switching between messages)');
        }
        setIsSpeaking(false);
      };
      
      console.log('Starting speech synthesis for text:', text.substring(0, 50) + '...');
      window.speechSynthesis.speak(utterance);
      
    } catch (error) {
      console.error('Error in startSpeech:', error);
      setIsSpeaking(false);
    }
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      console.log('Stopping speech...');
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const toggleAutoSpeak = () => {
    setAutoSpeak(!autoSpeak);
    if (!autoSpeak) {
      // If turning on auto-speak, speak the last AI message
      const lastAiMessage = messages.filter(m => m.type === 'ai').slice(-1)[0];
      if (lastAiMessage) {
        speakText(lastAiMessage.content);
      }
    } else {
      stopSpeaking();
    }
  };

  const testVoice = () => {
    speakText("Hi there! I'm Sarah, your memory guide. I'm so excited to hear your stories! Can you hear my voice clearly?");
  };

  const toggleListening = async () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in your browser. Please use Chrome, Edge, or Safari.');
      return;
    }

    if (isListening) {
      try {
        recognitionRef.current.stop();
        setIsListening(false);
      } catch (error) {
        console.error('Error stopping speech recognition:', error);
        setIsListening(false);
      }
    } else {
      try {
        // Check microphone permission first
        if (navigator.permissions) {
          const permission = await navigator.permissions.query({ name: 'microphone' as PermissionName });
          if (permission.state === 'denied') {
            alert('Microphone access is denied. Please enable microphone access in your browser settings and reload the page.');
            return;
          }
        }

        recognitionRef.current.start();
        setIsListening(true);
      } catch (error) {
        console.error('Error starting speech recognition:', error);
        setIsListening(false);
        
        // Check if it's a permission error
        if (error instanceof Error && error.message.includes('not-allowed')) {
          alert('Microphone access denied. Please allow microphone access and try again.');
        } else {
          alert('Could not start voice recognition. Please check your microphone and try again.');
        }
      }
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
      
      // Speak the AI response if auto-speak is enabled
      if (autoSpeak) {
        setTimeout(() => speakText(question), 500); // Small delay to ensure message is rendered
      }
    } catch (error) {
      console.error('Error generating follow-up:', error);
      const errorMessage: ConversationMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: "Oh, that sounds so wonderful! I'm absolutely loving hearing about this. Please tell me more - what details do you remember most vividly?",
        timestamp: new Date()
      };
      setMessages([...newMessages, errorMessage]);
      
      // Speak the error message if auto-speak is enabled
      if (autoSpeak) {
        setTimeout(() => speakText(errorMessage.content), 500);
      }
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
      <div className="flex items-center justify-between mb-6 bg-white rounded-lg shadow-sm p-4 border border-gray-100">
        <div className="flex items-center">
          <button
            onClick={onBack}
            className="mr-4 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          
          {/* AI Companion Info */}
          <div className="flex items-center mr-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-200 to-purple-200 flex items-center justify-center shadow-sm border-2 border-white mr-3">
              <span className="text-2xl">👩‍💻</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold text-purple-700">Sarah</h3>
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" title="Online & Ready"></div>
              </div>
              <p className="text-xs text-gray-500">Your Memory Guide & Storytelling Companion</p>
            </div>
          </div>
          
          {/* Quest Info */}
          <div className="border-l border-gray-200 pl-4">
            <div className="flex items-center">
              <span className="text-2xl mr-2">{quest.icon}</span>
              <div>
                <h2 className="text-lg font-semibold text-gray-800">{quest.title}</h2>
                <p className="text-sm text-gray-600">
                  {userMessageCount} memories shared
                  {isMockMode && ' • Mock Mode Active'}
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Voice Feature Status */}
          <div className="flex items-center gap-2 text-xs">
            {recognitionRef.current ? (
              <div className="flex items-center gap-2 bg-green-50 px-3 py-2 rounded-full border border-green-200">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-green-700 font-medium">Sarah can hear you</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-full border border-gray-200">
                <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                <span className="text-gray-600">Voice chat unavailable</span>
              </div>
            )}
          </div>
          
          {/* TTS Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleAutoSpeak}
              className={`p-2 rounded-lg transition-colors ${
                autoSpeak 
                  ? 'bg-purple-100 text-purple-600 hover:bg-purple-200' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              title={autoSpeak ? "Mute Sarah's voice" : "Unmute Sarah's voice"}
            >
              {autoSpeak ? <Volume2 size={20} /> : <VolumeX size={20} />}
            </button>
            
            {/* Test voice button */}
            <button
              onClick={testVoice}
              className="px-3 py-1 text-xs bg-pink-100 text-pink-700 rounded-full hover:bg-pink-200 transition-colors font-medium"
              title="Test Sarah's voice"
            >
              👋 Say Hi
            </button>
            
            {isSpeaking && (
              <button
                onClick={stopSpeaking}
                className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-colors animate-pulse"
                title="Stop Sarah from speaking"
              >
                <VolumeX size={20} />
              </button>
            )}
          </div>
          
          {isMockMode && (
            <div className="bg-orange-100 border border-orange-300 rounded-lg px-3 py-2">
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
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto bg-gray-50 rounded-lg p-4 mb-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {/* AI Avatar */}
              {message.type === 'ai' && (
                <div className="flex-shrink-0 mr-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-200 to-purple-200 flex items-center justify-center shadow-sm border-2 border-white">
                    <span className="text-lg">👩‍💻</span>
                  </div>
                </div>
              )}
              
              <div
                className={`max-w-3xl px-4 py-3 rounded-lg relative ${
                  message.type === 'user'
                    ? 'bg-blue-600 text-white ml-12 rounded-tr-sm'
                    : 'bg-white text-gray-800 shadow-md border border-gray-100 rounded-tl-sm'
                }`}
              >
                {message.type === 'ai' && (
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-purple-600">Sarah, Your Memory Guide</span>
                      <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" title="Online"></div>
                    </div>
                    {isSpeaking && (
                      <div className="flex items-center gap-1 ml-auto">
                        <div className="flex gap-1">
                          <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce"></div>
                          <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                          <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                        </div>
                        <span className="text-xs text-blue-600 ml-1">Speaking...</span>
                      </div>
                    )}
                    {autoSpeak && !isSpeaking && (
                      <button
                        onClick={() => speakText(message.content)}
                        className="text-xs text-gray-400 hover:text-purple-600 transition-colors ml-auto px-2 py-1 rounded hover:bg-purple-50"
                        title="Hear this question again"
                      >
                        � Hear again
                      </button>
                    )}
                  </div>
                )}
                <p className={`${message.type === 'ai' ? 'text-gray-700' : 'text-white'} leading-relaxed`}>
                  {message.content}
                </p>
                <p className={`text-xs mt-2 ${
                  message.type === 'user' ? 'text-blue-100' : 'text-gray-400'
                }`}>
                  {message.timestamp.toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </p>
                
                {/* Chat bubble tail for AI messages */}
                {message.type === 'ai' && (
                  <div className="absolute left-0 top-4 transform -translate-x-1 w-2 h-2 bg-white border-l border-b border-gray-100 rotate-45"></div>
                )}
              </div>
              
              {/* User Avatar */}
              {message.type === 'user' && (
                <div className="flex-shrink-0 ml-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-200 to-indigo-200 flex items-center justify-center shadow-sm border-2 border-white">
                    <span className="text-lg">👤</span>
                  </div>
                </div>
              )}
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
      <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
        {/* Voice status indicator */}
        {isListening && (
          <div className="mb-3 flex items-center gap-2 text-sm bg-red-50 px-3 py-2 rounded-lg border border-red-200">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-red-700 font-medium">Sarah is listening... Speak now</span>
            <div className="ml-auto flex gap-1">
              <div className="w-1 h-4 bg-red-400 rounded animate-pulse"></div>
              <div className="w-1 h-3 bg-red-400 rounded animate-pulse" style={{animationDelay: '0.1s'}}></div>
              <div className="w-1 h-5 bg-red-400 rounded animate-pulse" style={{animationDelay: '0.2s'}}></div>
              <div className="w-1 h-2 bg-red-400 rounded animate-pulse" style={{animationDelay: '0.3s'}}></div>
            </div>
          </div>
        )}
        
        <div className="flex gap-3">
          <button
            onClick={toggleListening}
            className={`px-3 py-2 rounded-lg transition-all duration-200 relative ${
              isListening 
                ? 'bg-red-500 text-white hover:bg-red-600 shadow-lg scale-105' 
                : recognitionRef.current 
                  ? 'bg-purple-100 text-purple-600 hover:bg-purple-200 hover:shadow-md' 
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
            title={
              !recognitionRef.current 
                ? 'Voice input not supported in this browser' 
                : isListening 
                  ? 'Stop recording (Sarah is listening)' 
                  : 'Start voice chat with Sarah'
            }
            disabled={!recognitionRef.current}
          >
            {isListening ? <MicOff size={20} /> : <Mic size={20} />}
            {isListening && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping"></div>
            )}
          </button>
          
          <textarea
            value={currentInput}
            onChange={(e) => setCurrentInput(e.target.value)}
            placeholder="Tell Sarah about your memory... I'm here to listen and would love to hear every detail! 💕"
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-none min-h-[60px] placeholder:text-gray-400"
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
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200 disabled:bg-gray-400 flex items-center gap-2 shadow-sm hover:shadow-md"
          >
            <Send size={16} />
            Share with Sarah
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
