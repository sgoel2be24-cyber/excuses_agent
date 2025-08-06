const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

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

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://excuses-app.com',
        'X-Title': 'Excuses App'
      },
      body: JSON.stringify({
        model: "google/gemini-1.5-flash:free",
        messages: [
          {
            role: "system",
            content: "You are a smart AI excuse generator. Create clever, clear and creative excuses that someone can use to avoid the situation they are in. Only return the excuse with a touch of humour."
          },
          {
            role: "user",
            content: `Generate an excuse for: ${problem}`
          }
        ],
        max_tokens: 200,
        temperature: 0.8
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenRouter API Error:', errorData);
      throw new Error(`OpenRouter API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const excuse = data.choices[0].message.content.trim();
    console.log('Generated excuse:', excuse);
    
    if (!excuse || excuse.length === 0) {
      throw new Error('No response generated from model');
    }
    
    res.json({ excuse });
  } catch (error) {
    console.error('Detailed error:', error);
    console.error('Error message:', error.message);
    
    // More specific error messages
    if (error.message.includes('401')) {
      res.status(500).json({ error: 'Invalid OpenRouter API key. Please check your API key.' });
    } else if (error.message.includes('quota')) {
      res.status(500).json({ error: 'OpenRouter API quota exceeded. Please check your billing.' });
    } else if (error.message.includes('rate_limit')) {
      res.status(500).json({ error: 'Rate limit exceeded. Please try again in a moment.' });
    } else if (error.message.includes('No response generated')) {
      res.status(500).json({ error: 'Model returned empty response. Please try again.' });
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
    
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://excuses-app.com',
        'X-Title': 'Excuses App'
      },
      body: JSON.stringify({
        model: "google/gemini-1.5-flash:free",
        messages: [
          {
            role: "user",
            content: "Say 'Hello World' in one sentence"
          }
        ],
        max_tokens: 50,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenRouter Test Error:', errorData);
      throw new Error(`OpenRouter API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const testResponse = data.choices[0].message.content.trim();
    console.log('Test response:', testResponse);

    res.json({ 
      success: true, 
      message: testResponse,
      apiKeyStatus: process.env.OPENROUTER_API_KEY ? 'Present' : 'Missing',
      model: 'google/gemini-1.5-flash:free'
    });
  } catch (error) {
    console.error('OpenRouter Test Error:', error);
    res.json({ 
      success: false, 
      error: error.message,
      apiKeyStatus: process.env.OPENROUTER_API_KEY ? 'Present' : 'Missing',
      model: 'google/gemini-1.5-flash:free'
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('Environment check:');
  console.log('- PORT:', process.env.PORT || 3000);
  console.log('- OPENROUTER_API_KEY exists:', !!process.env.OPENROUTER_API_KEY);
  console.log('- Using model: google/gemini-1.5-flash:free');
});
