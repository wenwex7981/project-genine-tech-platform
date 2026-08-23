const Groq = require('groq-sdk');

async function testGroq() {
  try {
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    const completion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: 'Hello' }],
      model: 'mixtral-8x7b-32768',
      max_tokens: 5,
    });
    console.log("✅ Groq SUCCESS:", completion.choices[0].message.content);
  } catch (e) {
    console.log("❌ Groq FAILED:", e.message);
  }
}

testGroq();
