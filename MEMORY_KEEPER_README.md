# Memory Keeper - AI-Powered Story Collection for Grandparents

A "Duolingo for Stories" application that helps grandparents share their precious memories through guided conversations, then transforms those memories into beautiful, shareable stories.

## Features

### 🎯 Memory Quests (Duolingo Style)
- **Pre-defined Quests**: Choose from themed memory journeys like "The High School Years," "A Decade of First Jobs," "Building a Family Home," and "Your Love Story"
- **Custom Quests**: Create personalized memory topics about anything on your mind
- **Guided Experience**: Each quest provides a warm, engaging starting question

### 🤖 AI Story Navigator
- **Emotionally Intelligent Follow-ups**: The AI analyzes responses and generates thoughtful follow-up questions that dig deeper into memories
- **Natural Conversation Flow**: Questions feel like they're coming from a caring grandchild
- **Context-Aware**: Each question builds on the previous response for a coherent narrative

### 📖 Legacy Package
- **Blog Post Generation**: Automatically transforms conversation transcripts into polished, third-person narrative blog posts
- **Extracted Wisdom**: Identifies and highlights 3-5 key life lessons from the conversation
- **Family Connection Prompts**: Generates specific follow-up questions family members can ask to continue the conversation

### 🎙️ User-Friendly Interface
- **Voice Input Support**: Use speech-to-text for easy input (Chrome/Safari)
- **Clean, Accessible Design**: Large text, simple navigation, grandparent-friendly
- **Progress Tracking**: See how many responses you've shared
- **Export Options**: Download or copy stories to share with family

## Getting Started

### Prerequisites
- Node.js 18+ 
- A Google Gemini API key ([Get one here](https://makersuite.google.com/app/apikey))

### Installation

1. **Clone and navigate to the project**:
   ```bash
   cd app-frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` and add your Gemini API key:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. **Run the development server**:
   ```bash
   npm run dev
   ```

5. **Open your browser** and visit `http://localhost:3000`

## How It Works

### 1. Choose Your Memory Quest
Start by selecting one of our pre-defined memory themes or create your own custom topic.

### 2. Share Your Memories
Answer the AI's thoughtful questions about your experiences. The AI listens carefully and asks follow-up questions that help you share more details and emotions.

### 3. Create Your Story
After sharing 3 or more responses, generate a beautiful blog post that captures your memories in narrative form, complete with wisdom insights and family discussion prompts.

### 4. Share With Family
Export your story to share with loved ones, along with conversation starters to keep the memories flowing.

## Technology Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **AI**: Google Gemini Pro for natural language processing
- **Voice Input**: Web Speech API for voice-to-text
- **Icons**: Lucide React

## API Endpoints

- `POST /api/generate-question` - Generate follow-up questions based on conversation history
- `POST /api/generate-custom-question` - Create opening questions for custom topics
- `POST /api/generate-blog-post` - Transform conversations into blog posts

## Contributing

This memory keeper was built to help families preserve and share precious memories. Feel free to contribute improvements or adaptations for your own family's needs.

## License

MIT License - Feel free to adapt this for your family or community.

---

*"Every memory is a treasure to be shared. Life's simple moments often hold the deepest meaning."*
