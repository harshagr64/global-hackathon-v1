import { supabase } from '@/lib/supbase/client';
import { BlogPost } from '@/types/memory-keeper';

export interface StoredBlogPost extends Omit<BlogPost, 'generatedAt'> {
  id: string;
  questTitle: string;
  createdAt: string;
  updatedAt: string;
}

export class BlogPostService {
  static async saveBlogPost(
    blogPost: BlogPost, 
    questTitle: string
  ): Promise<StoredBlogPost | null> {
    if (!supabase) {
      console.warn('Supabase not configured, cannot save blog post');
      return null;
    }

    try {
      // Check if a blog post with same quest and similar content length already exists recently
      // This is a simple heuristic to prevent duplicates
      const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000).toISOString();
      const { data: recentPosts, error: checkError } = await supabase
        .from('blog_posts')
        .select('id, title, content, quest_title, created_at')
        .eq('quest_title', questTitle)
        .gte('created_at', tenMinutesAgo)
        .limit(5);

      if (checkError) {
        console.error('Error checking for recent blog posts:', checkError);
        // Continue with save even if check fails
      } else if (recentPosts && recentPosts.length > 0) {
        // Check if any recent post has very similar content length (rough duplicate detection)
        const currentLength = blogPost.content.length;
        const similarPost = recentPosts.find(post => 
          Math.abs(post.content.length - currentLength) < 100 // Within 100 characters
        );
        
        if (similarPost) {
          console.log('Similar blog post created recently, skipping save to prevent duplicate');
          return {
            id: similarPost.id,
            title: blogPost.title,
            content: blogPost.content,
            wisdom: blogPost.wisdom,
            familyPrompts: blogPost.familyPrompts,
            questTitle: questTitle,
            createdAt: similarPost.created_at,
            updatedAt: similarPost.created_at
          };
        }
      }

      const { data, error } = await supabase
        .from('blog_posts')
        .insert({
          title: blogPost.title,
          content: blogPost.content,
          wisdom: blogPost.wisdom,
          family_prompts: blogPost.familyPrompts,
          quest_title: questTitle
        })
        .select()
        .single();

      if (error) {
        console.error('Error saving blog post:', error);
        return null;
      }

      return {
        id: data.id,
        title: data.title,
        content: data.content,
        wisdom: data.wisdom,
        familyPrompts: data.family_prompts,
        questTitle: data.quest_title,
        createdAt: data.created_at,
        updatedAt: data.updated_at
      };
    } catch (error) {
      console.error('Error saving blog post:', error);
      return null;
    }
  }

  static async getAllBlogPosts(): Promise<StoredBlogPost[]> {
    if (!supabase) {
      console.warn('Supabase not configured, cannot fetch blog posts');
      return [];
    }

    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching blog posts:', error);
        return [];
      }

      return data.map(post => ({
        id: post.id,
        title: post.title,
        content: post.content,
        wisdom: post.wisdom,
        familyPrompts: post.family_prompts,
        questTitle: post.quest_title,
        createdAt: post.created_at,
        updatedAt: post.updated_at
      }));
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      return [];
    }
  }

  static async getBlogPost(id: string): Promise<StoredBlogPost | null> {
    if (!supabase) {
      console.warn('Supabase not configured, cannot fetch blog post');
      return null;
    }

    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching blog post:', error);
        return null;
      }

      return {
        id: data.id,
        title: data.title,
        content: data.content,
        wisdom: data.wisdom,
        familyPrompts: data.family_prompts,
        questTitle: data.quest_title,
        createdAt: data.created_at,
        updatedAt: data.updated_at
      };
    } catch (error) {
      console.error('Error fetching blog post:', error);
      return null;
    }
  }

  static async deleteBlogPost(id: string): Promise<boolean> {
    if (!supabase) {
      console.warn('Supabase not configured, cannot delete blog post');
      return false;
    }

    try {
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting blog post:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error deleting blog post:', error);
      return false;
    }
  }
}
