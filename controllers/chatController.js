const Message = require("../models/Message");
const User = require("../models/User");

// POST → store new message
exports.sendMessage = async (req, res) => {
  try {
    const { text } = req.body;
    const userId = req.user.id; // from JWT middleware (next step)

    if (!text) {
      return res.status(400).json({ message: "Message required" });
    }

    const message = await Message.create({
      text,
      UserId: userId,
    });

    res.status(201).json(message);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// GET → fetch all messages with user info
exports.getMessages = async (req, res) => {
  try {
    const messages = await Message.findAll({
      include: [{ model: User, attributes: ["id", "name"] }],
      order: [["createdAt", "ASC"]],
    });

    res.json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
