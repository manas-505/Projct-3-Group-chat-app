const PrivateMessage = require("../models/PrivateMessage");

exports.getPrivateMessages = async (req, res) => {
  try {
    const { roomId } = req.query;

    if (!roomId) {
      return res.status(400).json({ message: "roomId required" });
    }

    const messages = await PrivateMessage.findAll({
      where: { roomId },
      order: [["createdAt", "ASC"]],
    });

    res.json(messages);
  } catch (err) {
    console.error("Fetch private messages error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
