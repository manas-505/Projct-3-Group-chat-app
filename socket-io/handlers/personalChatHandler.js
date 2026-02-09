const PrivateMessage = require("../../models/PrivateMessage");

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

      /* 📡 Emit ONLY to that room */
      io.to(roomId).emit("new_message", {
        id: saved.id,
        roomId,
        text,
        senderEmail: socket.user.email,
        createdAt: saved.createdAt,
      });
    } catch (err) {
      console.error("Private message error:", err);
    }
  });
};
