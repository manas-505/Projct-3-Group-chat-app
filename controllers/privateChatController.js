const PrivateMessage = require("../models/PrivateMessage");
const User = require("../models/User");

exports.getPrivateMessages = async (req, res) => {
  try {
    const { roomId } = req.query;

    if (!roomId) {
      return res.status(400).json({ message: "roomId required" });
    }

    const messages = await PrivateMessage.findAll({
      where: { roomId },
      include: [{ model: User, attributes: ["id", "name", "email"] }],
      order: [["createdAt", "ASC"]],
    });

    /* format for frontend */
    const formatted = messages.map((msg) => ({
      id: msg.id,
      text: msg.text,
      createdAt: msg.createdAt,
      UserId: msg.UserId,
      senderName: msg.User?.name,
      senderEmail: msg.User?.email,
    }));

    res.json(formatted);
  } catch (err) {
    console.error("Fetch private messages error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
