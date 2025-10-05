const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config({ path: '.env.local' });

const geminiApiKey = process.env.GEMINI_API_KEY;

if (!geminiApiKey) {
  console.error('Missing GEMINI_API_KEY environment variable! Check .env.local');
  process.exit(1);
}

const gemini = new GoogleGenerativeAI(geminiApiKey);

const modelNames = [
  'gemini-2.5-flash'
];

async function testModels() {
  console.log('Testing Gemini models...\n');
  
  for (const modelName of modelNames) {
    try {
      const model = gemini.getGenerativeModel({ model: modelName });
      const result = await model.generateContent('Hello, this is a test message');
      const response = await result.response;
      const text = response.text();
      
      console.log(`✅ ${modelName}: SUCCESS`);
      console.log(`   Response: ${text.substring(0, 50)}...\n`);
    } catch (error) {
      console.log(`❌ ${modelName}: FAILED`);
      console.log(`   Error: ${error.message.substring(0, 100)}...\n`);
    }
  }
}

testModels().catch(console.error);
