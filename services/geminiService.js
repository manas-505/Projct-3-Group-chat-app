const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-3-flash-preview",
});

/* ================= Predictive Typing ================= */
async function getPredictions(text) {
  const prompt = `
You are a chat assistant.
Suggest 3 short next phrases for this message:

"${text}"

Return ONLY a JSON array of 3 strings.
`;

  const result = await model.generateContent(prompt);
  const response = await result.response.text();

  try {
    return JSON.parse(response);
  } catch {
    return [];
  }
}

/* ================= Smart Replies ================= */
async function getSmartReplies(message) {
  const prompt = `
Provide 3 short smart replies to this message:

"${message}"

Return ONLY a JSON array of 3 replies.
`;

  const result = await model.generateContent(prompt);
  const response = await result.response.text();

  try {
    return JSON.parse(response);
  } catch {
    return [];
  }
}

module.exports = {
  getPredictions,
  getSmartReplies,
};
