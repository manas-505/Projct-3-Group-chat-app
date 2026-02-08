const { Server } = require("socket.io");
const socketAuth = require("./middleware");
const chatHandler = require("./handlers/chatHandler");

function initSocket(server, app) {
  const io = new Server(server, {
    cors: { origin: "*" },
  });

  /* 🔐 attach auth middleware */
  io.use(socketAuth);

  /* 🔌 connection handler */
  io.on("connection", (socket) => {
    chatHandler(io, socket);
  });

  /* make io accessible in controllers */
  app.set("io", io);
}

module.exports = initSocket;
