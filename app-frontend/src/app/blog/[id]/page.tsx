'use client';

import { useState, useEffect, use } from 'react';
import { StoredBlogPost } from '@/services/blog-post-service';
import { ArrowLeft, Calendar, Download, Share2, Copy, Check } from 'lucide-react';
import Link from 'next/link';

export default function BlogDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [blogPost, setBlogPost] = useState<StoredBlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copiedText, setCopiedText] = useState<string | null>(null);

  useEffect(() => {
    fetchBlogPost();
  }, [resolvedParams.id]);

  const fetchBlogPost = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/blog-posts/${resolvedParams.id}`);
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Blog post not found');
        }
        throw new Error('Failed to fetch blog post');
      }
      
      const result = await response.json();
      setBlogPost(result.data);
    } catch (error) {
      console.error('Error fetching blog post:', error);
      setError(error instanceof Error ? error.message : 'Failed to load blog post');
    } finally {
      setIsLoading(false);
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

  const shareStory = async () => {
    if (!blogPost) return;

    const shareData = {
      title: blogPost.title,
      text: `Check out this memory story: ${blogPost.title}`,
      url: window.location.href
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback: copy URL to clipboard
        await navigator.clipboard.writeText(window.location.href);
        setCopiedText('url');
        setTimeout(() => setCopiedText(null), 2000);
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading memory story...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-4 mb-8">
            <Link
              href="/blog-list"
              className="p-2 rounded-lg bg-white hover:bg-gray-50 transition-colors shadow-sm"
            >
              <ArrowLeft size={24} className="text-gray-600" />
            </Link>
            <h1 className="text-2xl font-bold text-gray-800">Error</h1>
          </div>
          
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={fetchBlogPost}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!blogPost) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link
              href="/blog-list"
              className="p-2 rounded-lg bg-white hover:bg-gray-50 transition-colors shadow-sm"
            >
              <ArrowLeft size={24} className="text-gray-600" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Memory Story</h1>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar size={14} />
                <span>{formatDate(blogPost.createdAt)}</span>
                <span>•</span>
                <span>Quest: {blogPost.questTitle}</span>
              </div>
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
              onClick={shareStory}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
            >
              <Share2 size={16} />
              Share
            </button>
          </div>
        </div>

        {/* Blog Content */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">{blogPost.title}</h2>
          
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
        {blogPost.wisdom.length > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-amber-800">Wisdom to Remember</h3>
              <button
                onClick={() => copyToClipboard(blogPost.wisdom.join('\n'), 'wisdom')}
                className="text-amber-700 hover:text-amber-800 p-1"
                title="Copy wisdom"
              >
                {copiedText === 'wisdom' ? <Check size={16} /> : <Copy size={16} />}
              </button>
            </div>
            <ul className="space-y-3">
              {blogPost.wisdom.map((wisdom, index) => (
                <li key={index} className="text-amber-900 italic border-l-4 border-amber-400 pl-4">
                  "{wisdom}"
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Family Prompts Section */}
        {blogPost.familyPrompts.length > 0 && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-green-800">Questions for the Family</h3>
              <button
                onClick={() => copyToClipboard(blogPost.familyPrompts.join('\n'), 'prompts')}
                className="text-green-700 hover:text-green-800 p-1"
                title="Copy questions"
              >
                {copiedText === 'prompts' ? <Check size={16} /> : <Copy size={16} />}
              </button>
            </div>
            <ul className="space-y-3">
              {blogPost.familyPrompts.map((prompt, index) => (
                <li key={index} className="text-green-900 flex items-start">
                  <span className="text-green-600 mr-2 mt-1">•</span>
                  {prompt}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
