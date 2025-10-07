const Groq = require("groq-sdk");

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const getAIAnalysis = async (text) => {
  const prompt = `Based on the following health data, generate a JSON response with risk factors, a risk score, and recommendations. The JSON object should have three keys: "factors", "risk", and "recommendations".
Data:
${text}
`;

  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "llama-3.1-8b-instant",
    });

    const jsonText = chatCompletion.choices[0]?.message?.content || "{}";
    const sanitizedJson = jsonText.replace(/,(\s*[}\]])/g, '$1');
    return JSON.parse(sanitizedJson);
  } catch (error) { 
    console.error("Error getting AI analysis:", error);
    throw new Error("Failed to get AI analysis.");
  }
};

module.exports = {
  getAIAnalysis,
};