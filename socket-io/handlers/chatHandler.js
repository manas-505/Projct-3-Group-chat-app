module.exports = function chatHandler(io, socket) {

  socket.on("group_message", (text) => {
    const message = {
      text,
      senderEmail: socket.user.email,
    };

    io.emit("new_group_message", message);
  });
};
