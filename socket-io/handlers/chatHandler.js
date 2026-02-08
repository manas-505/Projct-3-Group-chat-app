const User = require("../../models/User");

module.exports = async function chatHandler(io, socket) {
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
};
