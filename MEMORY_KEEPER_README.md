# Note: Please open the website in Safari browser to see all the features in working condition.

# Memory Keeper - AI-Powered Story Collection for Grandparents

A "Duolingo for Stories" application that helps grandparents share their precious memories through guided conversations with Sarah, your warm AI memory guide. Transform grandparent wisdom into beautiful, shareable stories that preserve family legacies for future generations.

## ✨ Meet Sarah - Your Memory Guide for Grandparents

Sarah is your compassionate AI companion who makes memory sharing feel like talking to a caring granddaughter. With her warm voice and curious questions, she helps grandparents explore and preserve their most treasured experiences for their families.

## 🌟 Features

### 🎙️ Sarah, Your Voice Assistant for Grandparents
- **Warm & Human-like Voice**: Sarah speaks with a gentle, curious tone that makes grandparents feel comfortable sharing
- **Active Listening**: Real-time voice-to-text with visual feedback when Sarah is listening to grandparent stories
- **Smart Conversations**: Sarah asks thoughtful follow-up questions that help grandparents remember more details
- **Grandparent-Friendly**: Enhanced compatibility with troubleshooting guides designed for less tech-savvy users

### 🎯 Memory Quests for Grandparents
- **Pre-defined Quests**: Choose from themed memory journeys perfect for grandparents like "The High School Years," "A Decade of First Jobs," "Building a Family Home," and "Your Love Story"
- **Custom Quests**: Grandparents can create personalized memory topics about their unique life experiences
- **Guided Experience**: Each quest provides warm, engaging questions that help grandparents feel comfortable sharing

### 🤖 AI Story Navigator for Family Stories
- **Emotionally Intelligent Follow-ups**: Sarah analyzes grandparent responses and generates thoughtful questions that uncover deeper family history
- **Natural Conversation Flow**: Questions feel like they're coming from an interested grandchild
- **Context-Aware**: Each question builds on previous responses to create coherent family narratives
- **Mock Mode**: Fallback functionality when API keys aren't configured, ensuring grandparents can always use the app

### 📖 Legacy Package for Grandchildren
- **Blog Post Generation**: Automatically transforms grandparent conversations into polished, narrative blog posts for the family
- **Extracted Wisdom**: Identifies and highlights 3-5 key life lessons from grandparent stories
- **Family Connection Prompts**: Generates specific questions grandchildren can ask to continue conversations
- **Persistent Storage**: Grandparent stories are saved to database for permanent family preservation
- **Story Library**: Grandchildren can browse and revisit all grandparent memories

### 🎙️ Enhanced Experience for Grandparents
- **Voice Input Support**: Advanced speech recognition optimized for grandparents with Chrome troubleshooting
- **Sarah's Voice**: Natural text-to-speech with warm, conversational tone that grandparents love
- **Visual Feedback**: Clear, large indicators showing when Sarah is listening to grandparent stories
- **Grandparent-Friendly Design**: Human-like chat interface with large text and simple navigation
- **Progress Tracking**: Help grandparents see how many memories they've shared in each quest
- **Easy Export & Share**: Simple ways for grandparents to download or copy stories to share with grandchildren
- **Accessible Design**: Works beautifully on devices grandparents prefer, with large buttons and clear text

## 🚀 Getting Started

### Prerequisites for Grandparent Families
- Node.js 18+ (family member can help set up)
- A Google Gemini API key ([Get one here](https://makersuite.google.com/app/apikey))
- Supabase account for storing grandparent stories ([Get started free](https://supabase.com))

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

## 🌟 How It Works for Grandparents

### 1. Meet Sarah & Choose Your Memory Quest
- Grandparents start by meeting Sarah, their friendly AI memory guide
- Select from pre-defined memory themes perfect for grandparent stories or create custom topics
- Sarah introduces herself warmly and asks the first question to help grandparents feel comfortable

### 2. Have a Natural Conversation About Your Life
- **Voice Input**: Grandparents click the microphone and speak naturally - Sarah listens and converts speech to text
- **Text Input**: Grandparents can type responses if they prefer
- **Sarah Responds**: She asks thoughtful follow-up questions about grandparent experiences, speaking them aloud
- **Visual Feedback**: Clear indicators show grandparents when Sarah is listening, speaking, or ready for more stories

### 3. Generate Your Family Memory Story
- After grandparents share 3+ meaningful responses, they click "Create Story"
- Sarah transforms grandparent conversations into beautiful, narrative blog posts for the family
- Includes extracted wisdom from grandparent experiences and discussion prompts for grandchildren
- Stories are automatically saved to preserve grandparent memories forever

### 4. Share & Preserve for Future Generations
- Grandparents can download their stories or copy them to share with grandchildren
- Browse all grandparent stories in the Family Story Library
- Use family prompts to help grandchildren continue conversations with grandparents

## 🎤 Voice Assistant Help for Grandparents

### For Grandparents Using Chrome:
1. Click the 🔒 lock icon next to the website address
2. Set Microphone to &ldquo;Allow&rdquo;
3. Reload the page
4. Make sure the website starts with "https://" (required for microphone access)

### Built-in Help for Grandparents:
- The app includes simple troubleshooting guides designed for grandparents
- Sarah will patiently guide grandparents through any technical issues
- Clear status indicators show grandparents when voice features are working
- Family members can help with initial setup if needed

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

## 🤝 Contributing to Grandparent Memory Preservation

This memory keeper was built specifically to help grandparents preserve and share their precious memories with their families. Contributions welcome:

- **Voice Recognition**: Improvements for grandparent speech patterns and accents
- **AI Responses**: Enhanced conversation flow tailored to grandparent storytelling
- **Accessibility**: Better support for grandparents with diverse technical comfort levels
- **Family Features**: Tools to help grandchildren engage with grandparent stories
- **UI/UX**: Design improvements specifically for grandparent users

## 📄 License

MIT License - Feel free to adapt this for your grandparent or family community.

---

*"Every grandparent memory is a treasure to be shared. With Sarah's help, grandparent stories become legacies that connect generations."*

## 🎬 Try It Live

Help your grandparents start preserving their memories with Sarah at: [Your Deployed URL]

**Perfect for Grandparents:**
- 🎙️ Voice conversation with patient, caring Sarah
- 🤖 Thoughtful questions that help grandparents remember more details
- 📖 Beautiful story generation that honors grandparent wisdom
- 💾 Permanent family memory library
- 👥 Easy sharing with grandchildren and family members
