const { OpenAI } = require('openai');
const { Mistral } = require('@mistralai/mistralai');

async function testModels() {
  console.log("Testing OpenAI...");
  try {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const completion = await openai.chat.completions.create({
      messages: [{ role: 'user', content: 'Hello' }],
      model: 'gpt-4o-mini',
      max_tokens: 5,
    });
    console.log("✅ OpenAI SUCCESS:", completion.choices[0].message.content);
  } catch (e) {
    console.log("❌ OpenAI FAILED:", e.message);
  }

  console.log("\nTesting Mistral...");
  try {
    const mistral = new Mistral({ apiKey: process.env.MISTRAL_API_KEY });
    const completion = await mistral.chat.complete({
      messages: [{ role: 'user', content: 'Hello' }],
      model: 'mistral-large-latest',
      maxTokens: 5,
    });
    console.log("✅ Mistral SUCCESS:", completion.choices[0].message.content);
  } catch (e) {
    console.log("❌ Mistral FAILED:", e.message);
  }
  
  console.log("\nTesting DeepSeek...");
  try {
    const deepseek = new OpenAI({ 
      apiKey: process.env.DEEPSEEK_API_KEY,
      baseURL: 'https://api.deepseek.com/v1' 
    });
    const completion = await deepseek.chat.completions.create({
      messages: [{ role: 'user', content: 'Hello' }],
      model: 'deepseek-chat',
      max_tokens: 5,
    });
    console.log("✅ DeepSeek SUCCESS:", completion.choices[0].message.content);
  } catch (e) {
    console.log("❌ DeepSeek FAILED:", e.message);
  }
}

testModels();
