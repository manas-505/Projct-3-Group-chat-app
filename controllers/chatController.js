const Message = require("../models/Message");
const User = require("../models/User");

// POST → store new message
exports.sendMessage = async (req, res) => {
  try {
    const { text } = req.body;
    const userId = req.user.id;

    if (!text) {
      return res.status(400).json({ message: "Message required" });
    }

    const message = await Message.create({
      text,
      UserId: userId,
    });

    /* fetch message with user info */
    const fullMessage = await Message.findByPk(message.id, {
      include: [{ model: User, attributes: ["id", "name"] }],
    });

    /* 🔥 emit to all connected clients */
    const io = req.app.get("io");
    io.emit("newMessage", fullMessage);

    res.status(201).json(fullMessage);
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
