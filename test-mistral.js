const { Mistral } = require('@mistralai/mistralai');

async function testMistralJSON() {
  try {
    const mistral = new Mistral({ apiKey: process.env.MISTRAL_API_KEY });
    const completion = await mistral.chat.complete({
      messages: [{ role: 'user', content: 'Generate 1 JSON object representing a person.' }],
      model: 'mistral-large-latest',
      maxTokens: 4000,
      responseFormat: { type: 'json_object' },
    });
    console.log("✅ Mistral JSON SUCCESS:", completion.choices[0].message.content);
  } catch (e) {
    console.log("❌ Mistral JSON FAILED:", e.message);
  }
}

testMistralJSON();
