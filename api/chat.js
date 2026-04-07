const Anthropic = require('@anthropic-ai/sdk');

// Vercel Serverless Function for Mentora AI Proxy
module.exports = async (req, res) => {
  // 1. Setup CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { system_prompt, messages } = req.body;

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'ANTHROPIC_API_KEY is not defined in Vercel environment variables.' });
    }

    const anthropic = new Anthropic({ apiKey });

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1500,
      system: system_prompt,
      messages: messages,
    });

    const reply = response.content?.[0]?.text || "I couldn't generate a response.";
    return res.status(200).json({ reply });

  } catch (error) {
    const status = error.status || 500;
    console.error(`❌ Mentora API Error [${status}]:`, error.message);

    if (status === 529) {
      return res.status(529).json({ 
        error: "Mentora is currently busy (Overloaded). Trying again in 5-10 seconds usually works." 
      });
    }

    return res.status(status).json({ 
      error: "AI is briefly unavailable. Please try again in 5 seconds." 
    });
  }
};
