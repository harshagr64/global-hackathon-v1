'use client';

import { useState, useEffect } from 'react';
import { StoredBlogPost } from '@/services/blog-post-service';
import { ArrowLeft, Calendar, BookOpen, Trash2, Eye } from 'lucide-react';
import Link from 'next/link';

export default function BlogListPage() {
  const [blogPosts, setBlogPosts] = useState<StoredBlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchBlogPosts();
  }, []);

  const fetchBlogPosts = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/blog-posts');
      if (!response.ok) throw new Error('Failed to fetch blog posts');
      
      const result = await response.json();
      setBlogPosts(result.data || []);
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      setError('Failed to load blog posts');
    } finally {
      setIsLoading(false);
    }
  };

  const deleteBlogPost = async (id: string) => {
    if (!confirm('Are you sure you want to delete this blog post?')) return;
    
    try {
      const response = await fetch(`/api/blog-posts/${id}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) throw new Error('Failed to delete blog post');
      
      // Remove from local state
      setBlogPosts(prev => prev.filter(post => post.id !== id));
    } catch (error) {
      console.error('Error deleting blog post:', error);
      alert('Failed to delete blog post');
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
          <p className="text-gray-600">Loading your memory stories...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="p-2 rounded-lg bg-white hover:bg-gray-50 transition-colors shadow-sm"
            >
              <ArrowLeft size={24} className="text-gray-600" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Memory Stories</h1>
              <p className="text-gray-600">
                {blogPosts.length} {blogPosts.length === 1 ? 'story' : 'stories'} preserved
              </p>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-600">{error}</p>
            <button
              onClick={fetchBlogPosts}
              className="mt-2 text-red-700 hover:text-red-800 underline"
            >
              Try again
            </button>
          </div>
        )}

        {blogPosts.length === 0 && !isLoading && !error ? (
          <div className="text-center py-16">
            <BookOpen size={64} className="text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-600 mb-2">No Stories Yet</h2>
            <p className="text-gray-500 mb-6">Start creating memory stories to see them here</p>
            <Link
              href="/"
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Create Your First Story
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {blogPosts.map((post) => (
              <div
                key={post.id}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden"
              >
                {/* Card Header */}
                <div className="p-6 border-b border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
                    {post.title}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                    <Calendar size={14} />
                    <span>{formatDate(post.createdAt)}</span>
                  </div>
                  <div className="text-sm text-indigo-600 font-medium">
                    Quest: {post.questTitle}
                  </div>
                </div>

                {/* Content Preview */}
                <div className="p-6">
                  <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                    {post.content.substring(0, 150)}...
                  </p>
                  
                  {/* Wisdom & Prompts Count */}
                  <div className="flex gap-4 text-xs text-gray-500 mb-4">
                    <span>{post.wisdom.length} wisdom insights</span>
                    <span>{post.familyPrompts.length} family prompts</span>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="px-6 pb-6 flex gap-2">
                  <Link
                    href={`/blog/${post.id}`}
                    className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors text-center text-sm flex items-center justify-center gap-2"
                  >
                    <Eye size={14} />
                    View Story
                  </Link>
                  <button
                    onClick={() => deleteBlogPost(post.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete story"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
