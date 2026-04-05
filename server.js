const express = require('express');
const cors = require('cors');
const Anthropic = require('@anthropic-ai/sdk');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 5000;

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

app.post('/api/chat', async (req, res) => {
  try {
    const { system_prompt, messages } = req.body;

    if (!process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY === 'your_claude_api_key_here') {
      return res.status(500).json({ error: 'Claude API key not configured in .env' });
    }

    console.log(`🤖 Calling Claude (Model: claude-sonnet-4-6, Messages: ${messages.length})...`);

    const message = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1500,
      system: system_prompt,
      messages: messages, // Now sending full chat history
    });

    const reply = message.content?.[0]?.text || "I couldn't generate a response.";
    console.log('✅ Claude responded successfully.');
    res.json({ reply });

  } catch (error) {
    const status = error.status || 500;
    console.error(`❌ Claude API Error [${status}]:`, error.message);

    // Specific friendly messages for common errors
    if (status === 529) {
      return res.status(529).json({ 
        error: "Claude is currently experiencing high traffic. Please wait 5-10 seconds and try your question again." 
      });
    }
    if (status === 401) {
      return res.status(401).json({ error: 'Invalid Claude API key. Check .env' });
    }

    res.status(status).json({ error: "AI is briefly unavailable. Please try again in a few seconds." });
  }
});

app.listen(PORT, () => {
  console.log(`\n🚀 Claude AI Proxy live on http://localhost:${PORT}`);
  console.log(`🧠 Next-Gen Model: claude-sonnet-4-6\n`);
});
