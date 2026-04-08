const Anthropic = require('@anthropic-ai/sdk');
require('dotenv').config();

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

async function main() {
  const modelsToTest = ['claude-sonnet-4-6', 'claude-3-5-sonnet-20241022', 'claude-3-7-sonnet-20250219'];
  for (const m of modelsToTest) {
    console.log(`\nTesting model: ${m}`);
    try {
      const message = await client.messages.create({
        model: m,
        max_tokens: 10,
        messages: [{ role: 'user', content: 'Say hello' }]
      });
      console.log(`Success! Response:`, message.content[0].text);
    } catch (e) {
      console.error(`Error with ${m}:`, e.message);
    }
  }
}

main();
