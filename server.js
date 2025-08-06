const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const OpenAI = require('openai');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// Initialize OpenAI client for OpenRouter
const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: 'https://openrouter.ai/api/v1',
  defaultHeaders: {
    'HTTP-Referer': 'https://excuses-app.com', // Optional: for analytics
    'X-Title': 'Excuses App' // Optional: for analytics
  }
});

// Webhook endpoint for generating excuses
app.post('/api/generate-excuse', async (req, res) => {
  try {
    const { problem } = req.body;
    
    if (!problem) {
      return res.status(400).json({ error: 'Problem description is required' });
    }

    // Debug: Check if API key is loaded
    console.log('API Key loaded:', process.env.OPENROUTER_API_KEY ? 'YES' : 'NO');
    console.log('Problem received:', problem);

    const completion = await openai.chat.completions.create({
      model: "z-ai/glm-4.5-air:free", // Using OpenRouter's GLM-4.5-AIR model
      messages: [
        {
          role: "system",
          content: `#Overview
You are an smart AI excuse generator. Your job is to create a clever, clear and creative excuses that someone can use to avoid the situation they are in.

##Output
-only return the excuse
-Add a touch of humour in it.`
        },
        {
          role: "user",
          content: problem
        }
      ],
      max_tokens: 150,
      temperature: 0.8
    });

    const excuse = completion.choices[0].message.content.trim();
    console.log('Generated excuse:', excuse);
    
    res.json({ excuse });
  } catch (error) {
    console.error('Detailed error:', error);
    console.error('Error message:', error.message);
    console.error('Error code:', error.code);
    console.error('Error status:', error.status);
    
    // More specific error messages
    if (error.code === 'invalid_api_key') {
      res.status(500).json({ error: 'Invalid OpenRouter API key. Please check your API key.' });
    } else if (error.code === 'insufficient_quota') {
      res.status(500).json({ error: 'OpenRouter API quota exceeded. Please check your billing.' });
    } else if (error.code === 'rate_limit_exceeded') {
      res.status(500).json({ error: 'Rate limit exceeded. Please try again in a moment.' });
    } else {
      res.status(500).json({ error: `Failed to generate excuse: ${error.message}` });
    }
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Excuses app is running!' });
});

// Test OpenRouter API endpoint
app.get('/test-openrouter', async (req, res) => {
  try {
    console.log('Testing OpenRouter API...');
    console.log('API Key:', process.env.OPENROUTER_API_KEY ? 'Present' : 'Missing');
    
    const completion = await openai.chat.completions.create({
      model: "z-ai/glm-4.5-air:free",
      messages: [
        {
          role: "user",
          content: "Say 'Hello World'"
        }
      ],
      max_tokens: 10
    });

    res.json({ 
      success: true, 
      message: completion.choices[0].message.content,
      apiKeyStatus: process.env.OPENROUTER_API_KEY ? 'Present' : 'Missing',
      model: 'z-ai/glm-4.5-air:free'
    });
  } catch (error) {
    console.error('OpenRouter Test Error:', error);
    res.json({ 
      success: false, 
      error: error.message,
      apiKeyStatus: process.env.OPENROUTER_API_KEY ? 'Present' : 'Missing',
      model: 'z-ai/glm-4.5-air:free'
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('Environment check:');
  console.log('- PORT:', process.env.PORT || 3000);
  console.log('- OPENROUTER_API_KEY exists:', !!process.env.OPENROUTER_API_KEY);
  console.log('- Using model: z-ai/glm-4.5-air:free');
}); 
