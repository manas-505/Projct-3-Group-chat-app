const gemini = require("../services/geminiService");

/* Predictive typing */
exports.predictText = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.json([]);

    const suggestions = await gemini.getPredictions(text);
    res.json(suggestions);
  } catch (err) {
    console.error("AI predict error:", err);
    res.status(500).json([]);
  }
};

/* Smart replies */
exports.smartReplies = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.json([]);

    const replies = await gemini.getSmartReplies(message);
    res.json(replies);
  } catch (err) {
    console.error("AI smart reply error:", err);
    res.status(500).json([]);
  }
};
