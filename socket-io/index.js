const { Server } = require("socket.io");
const authMiddleware = require("./middleware");
const chatHandler = require("./handlers/chatHandler");
const personalChatHandler = require("./handlers/personalChatHandler");

module.exports = function initSocket(server, app) {
  const io = new Server(server, {
    cors: { origin: "*" },
  });

  app.set("io", io);

  /* 🔐 auth */
  io.use(authMiddleware);

  io.on("connection", (socket) => {
    console.log("✅ User connected:", socket.user.id);

    /* existing group chat */
    chatHandler(io, socket);

    /* ⭐ NEW personal chat */
    personalChatHandler(io, socket);

    socket.on("disconnect", () => {
      console.log("❌ User disconnected:", socket.user.id);
    });
  });
};
