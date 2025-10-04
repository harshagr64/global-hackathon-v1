import { createClient } from '@supabase/supabase-js';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Supabase configuration (optional)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Gemini AI configuration
const geminiApiKey = process.env.GEMINI_API_KEY;

if (!geminiApiKey) {
  throw new Error('Missing GEMINI_API_KEY environment variable! Check .env.local');
}

// Initialize Supabase client only if environment variables are provided
export const supabase = supabaseUrl && supabaseKey 
  ? createClient(supabaseUrl, supabaseKey)
  : null;

// Initialize and export the Gemini AI client
export const gemini = new GoogleGenerativeAI(geminiApiKey);