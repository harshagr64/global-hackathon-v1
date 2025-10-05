import { NextResponse } from 'next/server';
import { BlogPostService } from '@/services/blog-post-service';

export async function GET() {
  try {
    const blogPosts = await BlogPostService.getAllBlogPosts();
    
    return NextResponse.json({
      success: true,
      data: blogPosts,
      count: blogPosts.length
    });
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fetch blog posts',
        data: [],
        count: 0
      },
      { status: 500 }
    );
  }
}
