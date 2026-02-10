const PrivateMessage = require("../../models/PrivateMessage");
const User = require("../../models/User");

module.exports = function personalChatHandler(io, socket) {

  /* ================= JOIN ROOM ================= */
  socket.on("join_room", (roomId) => {
    if (!roomId) return;

    socket.join(roomId);
    console.log(`👥 ${socket.user.email} joined room → ${roomId}`);
  });

  /* ================= LEAVE ROOM ================= */
  socket.on("leave_room", (roomId) => {
    if (!roomId) return;

    socket.leave(roomId);
    console.log(`🚪 ${socket.user.email} left room → ${roomId}`);
  });

  /* ================= PRIVATE MESSAGE ================= */
  socket.on("new_message", async ({ roomId, text }) => {
    try {
      if (!roomId || !text) return;

      /* 💾 Save in DB */
      const saved = await PrivateMessage.create({
        roomId,
        text,
        UserId: socket.user.id,
      });

      /* 🔎 fetch with sender info */
      const fullMsg = await PrivateMessage.findByPk(saved.id, {
        include: [{ model: User, attributes: ["id", "name", "email"] }],
      });

      /* 📡 emit SAME structure as DB history */
      io.to(roomId).emit("new_message", {
        id: fullMsg.id,
        roomId,
        text: fullMsg.text,
        createdAt: fullMsg.createdAt,
        UserId: fullMsg.UserId,
        senderName: fullMsg.User.name,
        senderEmail: fullMsg.User.email,
      });

    } catch (err) {
      console.error("Private message error:", err);
    }
  });

};
