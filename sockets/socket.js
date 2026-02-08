const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

function initSocket(server, app) {
  const io = new Server(server, {
    cors: { origin: "*" },
  });

  /* 🔐 Socket authentication */
  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth.token;

      if (!token) {
        return next(new Error("Authentication error"));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.user = decoded;

      next();
    } catch (err) {
      next(new Error("Authentication error"));
    }
  });

  /* 🔌 Connection handler */
  io.on("connection", async (socket) => {
    console.log("✅ Authenticated user connected:", socket.user.id);

    try {
      const user = await User.findByPk(socket.user.id, {
        attributes: ["id", "name", "email"],
      });

      socket.emit("userConnected", user);
    } catch (err) {
      console.error("User fetch error:", err);
    }

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.user.id);
    });
  });

  /* make io accessible in controllers */
  app.set("io", io);
}

module.exports = initSocket;
