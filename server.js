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

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Webhook endpoint for generating excuses
app.post('/api/generate-excuse', async (req, res) => {
  try {
    const { problem } = req.body;
    
    if (!problem) {
      return res.status(400).json({ error: 'Problem description is required' });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
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
    
    res.json({ excuse });
  } catch (error) {
    console.error('Error generating excuse:', error);
    res.status(500).json({ error: 'Failed to generate excuse' });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Excuses app is running!' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 
