# Memory Keeper - AI-Powered Story Collection with Sarah

A "Duolingo for Stories" application that helps people share their precious memories through guided conversations with Sarah, your warm AI memory guide. Transform conversations into beautiful, shareable stories that preserve family legacies.

## ✨ Meet Sarah - Your Memory Guide

Sarah is your compassionate AI companion who makes memory sharing feel like talking to a caring friend. With her warm voice and curious questions, she helps you explore and preserve your most treasured experiences.

## 🌟 Features

### 🎙️ Sarah, Your Voice Assistant
- **Warm & Human-like Voice**: Sarah speaks with a gentle, curious tone that makes conversations feel natural
- **Active Listening**: Real-time voice-to-text with visual feedback when Sarah is listening
- **Smart Conversations**: Sarah asks thoughtful follow-up questions based on your responses
- **Chrome-Optimized**: Enhanced compatibility with troubleshooting guides for seamless voice interaction

### 🎯 Memory Quests (Duolingo Style)
- **Pre-defined Quests**: Choose from themed memory journeys like "The High School Years," "A Decade of First Jobs," "Building a Family Home," and "Your Love Story"
- **Custom Quests**: Create personalized memory topics about anything on your mind
- **Guided Experience**: Each quest provides a warm, engaging starting question from Sarah

### 🤖 AI Story Navigator
- **Emotionally Intelligent Follow-ups**: Sarah analyzes responses and generates thoughtful follow-up questions that dig deeper into memories
- **Natural Conversation Flow**: Questions feel like they're coming from a caring companion
- **Context-Aware**: Each question builds on the previous response for a coherent narrative
- **Mock Mode**: Fallback functionality when API keys aren't configured

### 📖 Legacy Package & Storage
- **Blog Post Generation**: Automatically transforms conversation transcripts into polished, narrative blog posts
- **Extracted Wisdom**: Identifies and highlights 3-5 key life lessons from the conversation
- **Family Connection Prompts**: Generates specific follow-up questions family members can ask
- **Persistent Storage**: Stories are saved to Supabase database for long-term preservation
- **Story Library**: Browse and revisit all your created memories

### 🎙️ Enhanced User Experience
- **Voice Input Support**: Advanced speech recognition with Chrome optimization and troubleshooting
- **Sarah's Voice**: Natural text-to-speech with warm, conversational tone
- **Visual Feedback**: Real-time indicators showing when Sarah is listening or speaking
- **Clean, Accessible Design**: Human-like chat interface with avatars and status indicators
- **Progress Tracking**: See how many memories you've shared in each quest
- **Export & Share**: Download or copy stories to share with family
- **Responsive Design**: Works beautifully on desktop and mobile devices

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- A Google Gemini API key ([Get one here](https://makersuite.google.com/app/apikey))
- Supabase account for database ([Get started free](https://supabase.com))

### Quick Setup

1. **Clone and navigate to the project**:
   ```bash
   git clone https://github.com/harshagr64/global-hackathon-v1.git
   cd global-hackathon-v1/app-frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   Create `.env.local` with:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. **Set up database**:
   ```bash
   # Run the setup.sql file in your Supabase SQL editor
   # This creates the blog_posts table with proper indexes and security
   ```

5. **Run the development server**:
   ```bash
   npm run dev
   ```

6. **Open your browser** and visit `http://localhost:3000`

## 🌟 How It Works

### 1. Meet Sarah & Choose Your Quest
- Start by meeting Sarah, your friendly AI memory guide
- Select from pre-defined memory themes or create your own custom topic
- Sarah introduces herself and asks your first question with warmth and curiosity

### 2. Have a Natural Conversation
- **Voice Input**: Click the microphone and speak naturally - Sarah listens and converts speech to text
- **Text Input**: Type your responses if you prefer
- **Sarah Responds**: She asks thoughtful follow-up questions, speaking them aloud with her warm voice
- **Visual Feedback**: See when Sarah is listening, speaking, or ready for your response

### 3. Generate Your Memory Story
- After sharing 3+ meaningful responses, click "Create Story"
- Sarah transforms your conversation into a beautiful, narrative blog post
- Includes extracted wisdom and family discussion prompts
- Stories are automatically saved to your personal library

### 4. Share & Preserve
- Download your story as text or copy to share with family
- Browse all your stories in the Story Library
- Use family prompts to continue conversations with loved ones

## 🎤 Voice Assistant Troubleshooting

### For Chrome Users:
1. Click the 🔒 lock icon next to the URL
2. Set Microphone to "Allow"
3. Reload the page
4. Ensure you're using HTTPS (required for microphone access)

### Built-in Help:
- The app includes troubleshooting guides
- Sarah will guide you through any technical issues
- Real-time status indicators show voice feature availability

## 🛠️ Technology Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **AI & Voice**: 
  - Google Gemini Pro for natural language processing and conversation
  - Web Speech API for voice-to-text recognition
  - Speech Synthesis API for Sarah's warm voice responses
- **Database**: Supabase (PostgreSQL) for story persistence and management
- **Styling**: Tailwind CSS with warm, human-centered design
- **Icons**: Lucide React for beautiful, accessible icons
- **Deployment**: Optimized for Vercel with HTTPS support

## 📡 API Endpoints

- `POST /api/generate-question` - Sarah generates follow-up questions based on conversation history
- `POST /api/generate-custom-question` - Create opening questions for custom memory topics
- `POST /api/generate-blog-post` - Transform conversations into narrative blog posts
- `GET /api/blog-posts` - Retrieve all stored memory stories
- `GET /api/blog-posts/[id]` - Get a specific memory story
- `DELETE /api/blog-posts/[id]` - Remove a memory story

## 🚀 Deployment

### Recommended: Vercel
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on every push

### Environment Variables for Production:
```env
NEXT_PUBLIC_SUPABASE_URL=your_production_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_production_supabase_key
GEMINI_API_KEY=your_gemini_api_key
```

### Database Setup:
Run the provided `sql/setup.sql` in your Supabase SQL editor to create the required tables and indexes.

## 🤝 Contributing

This memory keeper was built to help families preserve and share precious memories. Contributions welcome:

- **Voice Recognition**: Improvements to speech-to-text accuracy
- **AI Responses**: Enhanced conversation flow and question generation
- **Accessibility**: Better support for diverse users and devices
- **Languages**: Multi-language support for global families
- **UI/UX**: Design improvements for better user experience

## 📄 License

MIT License - Feel free to adapt this for your family or community.

---

*"Every memory is a treasure to be shared. With Sarah's help, your stories become legacies that connect generations."*

## 🎬 Try It Live

Experience Sarah and start preserving your memories at: [Your Deployed URL]

**Demo Features:**
- 🎙️ Voice conversation with Sarah
- 🤖 Intelligent follow-up questions  
- 📖 Beautiful story generation
- 💾 Persistent memory library
- 👥 Family sharing capabilities
