-- Create blog_posts table
CREATE TABLE blog_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  wisdom TEXT[] NOT NULL DEFAULT '{}',
  family_prompts TEXT[] NOT NULL DEFAULT '{}',
  quest_title TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create an index on created_at for faster sorting
CREATE INDEX idx_blog_posts_created_at ON blog_posts(created_at DESC);

-- Create an index on quest_title for filtering
CREATE INDEX idx_blog_posts_quest_title ON blog_posts(quest_title);

-- Enable Row Level Security (optional, for future user authentication)
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows all operations for now (you can restrict this later)
CREATE POLICY "Allow all operations on blog_posts" ON blog_posts
  FOR ALL USING (true) WITH CHECK (true);
