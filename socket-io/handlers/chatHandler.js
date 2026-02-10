const Message = require("../../models/Message");
const User = require("../../models/User");

module.exports = function chatHandler(io, socket) {

  socket.on("group_message", async (text) => {
    try {
      if (!text) return;

      /* 💾 save in DB */
      const saved = await Message.create({
        text,
        UserId: socket.user.id,
      });

      /* 🔎 fetch with user info */
      const fullMsg = await Message.findByPk(saved.id, {
        include: [{ model: User, attributes: ["id", "name", "email"] }],
      });

      /* 📡 emit SAME structure as DB history */
      io.emit("new_group_message", {
        id: fullMsg.id,
        text: fullMsg.text,
        createdAt: fullMsg.createdAt,
        UserId: fullMsg.UserId,
        senderName: fullMsg.User.name,
        senderEmail: fullMsg.User.email,
      });

    } catch (err) {
      console.error("Group message error:", err);
    }
  });

};
