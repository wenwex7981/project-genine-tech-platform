const { GoogleGenAI } = require('@google/genai');

async function testGemini() {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: 'Hello',
      config: {
        maxOutputTokens: 5,
      }
    });
    console.log("✅ Gemini SUCCESS:", response.text);
  } catch (e) {
    console.log("❌ Gemini FAILED:", e.message);
  }
}

testGemini();
