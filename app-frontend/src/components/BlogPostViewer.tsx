'use client';

import { useState, useEffect } from 'react';
import { MemorySession, BlogPost } from '@/types/memory-keeper';
import { ArrowLeft, Download, Share2, Heart, Copy, Check } from 'lucide-react';

interface BlogPostViewerProps {
  session: MemorySession;
  onBack: () => void;
  onStartNewQuest: () => void;
}

export default function BlogPostViewer({ session, onBack, onStartNewQuest }: BlogPostViewerProps) {
  const [blogPost, setBlogPost] = useState<BlogPost | null>(null);
  const [isGenerating, setIsGenerating] = useState(true);
  const [copiedText, setCopiedText] = useState<string | null>(null);

  useEffect(() => {
    generateBlogPost();
  }, [session]); // generateBlogPost is stable and doesn't need to be in deps

  const generateBlogPost = async () => {
    setIsGenerating(true);
    
    try {
      const response = await fetch('/api/generate-blog-post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questTitle: session.questTitle,
          messages: session.messages
        })
      });

      if (!response.ok) throw new Error('Failed to generate blog post');

      const post = await response.json();
      setBlogPost(post);
    } catch (error) {
      console.error('Error generating blog post:', error);
      // Fallback blog post
      setBlogPost({
        title: `Memories from ${session.questTitle}`,
        content: `This is a collection of precious memories shared about ${session.questTitle}.`,
        wisdom: ["Every memory is a treasure to be shared"],
        familyPrompts: ["What other memories do you have from this time?"],
        generatedAt: new Date()
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(type);
      setTimeout(() => setCopiedText(null), 2000);
    } catch (error) {
      console.error('Failed to copy text:', error);
    }
  };

  const downloadAsText = () => {
    if (!blogPost) return;

    const content = `${blogPost.title}\n\n${blogPost.content}\n\nWisdom to Remember:\n${blogPost.wisdom.map(w => `• ${w}`).join('\n')}\n\nQuestions for the Family:\n${blogPost.familyPrompts.map(p => `• ${p}`).join('\n')}`;
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${blogPost.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (isGenerating) {
    return (
      <div className="max-w-4xl mx-auto p-6 h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Creating Your Story</h2>
          <p className="text-gray-600">
            Our AI is carefully crafting your memories into a beautiful story...
          </p>
        </div>
      </div>
    );
  }

  if (!blogPost) {
    return (
      <div className="max-w-4xl mx-auto p-6 h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Something went wrong</h2>
          <p className="text-gray-600 mb-4">We couldn&apos;t generate your story. Please try again.</p>
          <button
            onClick={onBack}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <button
            onClick={onBack}
            className="mr-4 text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Your Memory Story</h1>
            <p className="text-sm text-gray-600">
              Generated on {new Date(blogPost.generatedAt).toLocaleDateString()}
            </p>
          </div>
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={downloadAsText}
            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2"
          >
            <Download size={16} />
            Download
          </button>
          <button
            onClick={() => copyToClipboard(`${blogPost.title}\n\n${blogPost.content}`, 'story')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            {copiedText === 'story' ? <Check size={16} /> : <Copy size={16} />}
            {copiedText === 'story' ? 'Copied!' : 'Copy Story'}
          </button>
        </div>
      </div>

      {/* Blog Post Content */}
      <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          {blogPost.title}
        </h1>
        
        <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
          {blogPost.content.split('\n').map((paragraph, index) => (
            paragraph.trim() && (
              <p key={index} className="mb-4">
                {paragraph}
              </p>
            )
          ))}
        </div>
      </div>

      {/* Wisdom Section */}
      {blogPost.wisdom && blogPost.wisdom.length > 0 && (
        <div className="bg-amber-50 border-l-4 border-amber-400 rounded-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-amber-800 flex items-center gap-2">
              <Heart className="text-amber-600" size={20} />
              Grandparent&apos;s Wisdom
            </h3>
            <button
              onClick={() => copyToClipboard(blogPost.wisdom.join('\n'), 'wisdom')}
              className="text-amber-600 hover:text-amber-800 transition-colors"
            >
              {copiedText === 'wisdom' ? <Check size={16} /> : <Copy size={16} />}
            </button>
          </div>
          <div className="space-y-3">
            {blogPost.wisdom.map((wisdom, index) => (
              <blockquote key={index} className="text-amber-800 italic border-l-2 border-amber-300 pl-4">
                &quot;{wisdom}&quot;
              </blockquote>
            ))}
          </div>
        </div>
      )}

      {/* Family Connection Prompts */}
      {blogPost.familyPrompts && blogPost.familyPrompts.length > 0 && (
        <div className="bg-blue-50 border-l-4 border-blue-400 rounded-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-blue-800 flex items-center gap-2">
              <Share2 className="text-blue-600" size={20} />
              What to Ask Next
            </h3>
            <button
              onClick={() => copyToClipboard(blogPost.familyPrompts.join('\n'), 'prompts')}
              className="text-blue-600 hover:text-blue-800 transition-colors"
            >
              {copiedText === 'prompts' ? <Check size={16} /> : <Copy size={16} />}
            </button>
          </div>
          <p className="text-blue-700 mb-4">
            Perfect conversation starters for family gatherings:
          </p>
          <ul className="space-y-2">
            {blogPost.familyPrompts.map((prompt, index) => (
              <li key={index} className="text-blue-800 flex items-start gap-2">
                <span className="text-blue-400 mt-1">•</span>
                {prompt}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Actions */}
      <div className="text-center">
        <button
          onClick={onStartNewQuest}
          className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-colors text-lg font-medium"
        >
          Share Another Memory
        </button>
        <p className="text-gray-600 mt-4">
          Ready to share more precious memories with your family?
        </p>
      </div>
    </div>
  );
}
