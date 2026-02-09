// const chatMessages = document.getElementById("chatMessages");
// const chatForm = document.getElementById("chatForm");
// const messageInput = document.getElementById("messageInput");

// let currentRoom = null;

// /* SOCKET CONNECT */
// const socket = io("http://localhost:3000", {
//   auth: { token: localStorage.getItem("token") },
// });

// /* scroll */
// function scrollToBottom() {
//   chatMessages.scrollTop = chatMessages.scrollHeight;
// }

// /* add message */
// function addMessage(text, type = "sent") {
//   const msg = document.createElement("div");
//   msg.classList.add("message", type);

//   const time = new Date().toLocaleTimeString([], {
//     hour: "2-digit",
//     minute: "2-digit",
//   });

//   msg.innerHTML = `
//     <div class="text">${text}</div>
//     <div class="time">${time}</div>
//   `;

//   chatMessages.appendChild(msg);
//   scrollToBottom();
// }

// /* helpers */
// function getEmailFromToken() {
//   const token = localStorage.getItem("token");
//   if (!token) return null;
//   return JSON.parse(atob(token.split(".")[1])).email;
// }

// function getUserIdFromToken() {
//   const token = localStorage.getItem("token");
//   if (!token) return null;
//   return JSON.parse(atob(token.split(".")[1])).id;
// }

// /* ================= JOIN ROOM BY EMAIL ================= */
// async function searchAndJoinRoom() {
//   const targetEmail = document.getElementById("searchEmail").value.trim();

//   if (!targetEmail) return alert("Enter email first");

//   try {
//     const res = await api.get(`/auth/user-by-email?email=${targetEmail}`);
//     const otherUser = res.data;

//     const myEmail = getEmailFromToken();

//     /* SAME room id for both users */
//     const roomId = [myEmail, otherUser.email].sort().join("__");

//     /* leave old room */
//     if (currentRoom) {
//       socket.emit("leave_room", currentRoom);
//     }

//     currentRoom = roomId;

//     socket.emit("join_room", roomId);

//     await loadPrivateMessages(roomId);

//     console.log("✅ Joined private room:", roomId);
//   } catch (err) {
//     alert("❌ User not found in database");
//   }
// }

// /* expose to button */
// window.searchAndJoinRoom = searchAndJoinRoom;

// /* ================= LOAD PRIVATE HISTORY ================= */
// async function loadPrivateMessages(roomId) {
//   try {
//     const res = await api.get(`/private-chat/messages?roomId=${roomId}`);

//     chatMessages.innerHTML = "";

//     res.data.forEach((msg) => {
//       const type =
//         msg.UserId === getUserIdFromToken() ? "sent" : "received";

//       addMessage(msg.text, type);
//     });
//   } catch (err) {
//     console.error("Load private messages error:", err);
//   }
// }

// /* ================= SEND MESSAGE ================= */
// chatForm.addEventListener("submit", (e) => {
//   e.preventDefault();

//   const text = messageInput.value.trim();
//   if (!text) return;

//   if (currentRoom) {
//     socket.emit("new_message", { roomId: currentRoom, text });
//   } else {
//     socket.emit("group_message", text);
//   }

//   messageInput.value = "";
// });

// /* ================= RECEIVE GROUP ================= */
// socket.on("new_group_message", (msg) => {
//   if (currentRoom) return;

//   const type =
//     msg.senderEmail === getEmailFromToken() ? "sent" : "received";

//   addMessage(msg.text, type);
// });

// /* ================= RECEIVE PRIVATE ================= */
// socket.on("new_message", (msg) => {
//   if (msg.roomId !== currentRoom) return;

//   const type =
//     msg.fromUserId === getUserIdFromToken() ? "sent" : "received";

//   addMessage(msg.text, type);
// });

// /* ================= EXIT ROOM ================= */
// document.getElementById("exitRoomBtn").addEventListener("click", () => {
//   if (!currentRoom) return;

//   socket.emit("leave_room", currentRoom);
//   currentRoom = null;
//   chatMessages.innerHTML = "";
// });





const chatMessages = document.getElementById("chatMessages");
const chatForm = document.getElementById("chatForm");
const messageInput = document.getElementById("messageInput");

let currentRoom = null;

/* SOCKET CONNECT */
const socket = io("http://localhost:3000", {
  auth: { token: localStorage.getItem("token") },
});

/* scroll */
function scrollToBottom() {
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

/* add message */
function addMessage(text, type = "sent") {
  const msg = document.createElement("div");
  msg.classList.add("message", type);

  const time = new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  msg.innerHTML = `
    <div class="text">${text}</div>
    <div class="time">${time}</div>
  `;

  chatMessages.appendChild(msg);
  scrollToBottom();
}

/* helpers */
function getEmailFromToken() {
  const token = localStorage.getItem("token");
  if (!token) return null;
  return JSON.parse(atob(token.split(".")[1])).email;
}

function getUserIdFromToken() {
  const token = localStorage.getItem("token");
  if (!token) return null;
  return JSON.parse(atob(token.split(".")[1])).id;
}

/* ================= JOIN ROOM BY EMAIL ================= */
async function searchAndJoinRoom() {
  const targetEmail = document.getElementById("searchEmail").value.trim();
  if (!targetEmail) return alert("Enter email first");

  try {
    const res = await api.get(`/auth/user-by-email?email=${targetEmail}`);
    const otherUser = res.data;

    const myEmail = getEmailFromToken();
    const roomId = [myEmail, otherUser.email].sort().join("__");

    if (currentRoom) socket.emit("leave_room", currentRoom);

    currentRoom = roomId;

    socket.emit("join_room", roomId);
    await loadPrivateMessages(roomId);

    console.log("✅ Joined private room:", roomId);
  } catch {
    alert("❌ User not found in database");
  }
}

window.searchAndJoinRoom = searchAndJoinRoom;

/* ================= LOAD PRIVATE HISTORY ================= */
async function loadPrivateMessages(roomId) {
  const res = await api.get(`/private-chat/messages?roomId=${roomId}`);

  chatMessages.innerHTML = "";

  res.data.forEach((msg) => {
    const type =
      msg.UserId === getUserIdFromToken() ? "sent" : "received";
    addMessage(msg.text, type);
  });
}

/* ================= LOAD GROUP HISTORY ================= */
async function loadGroupMessages() {
  try {
    const res = await api.get("/chat/messages");

    chatMessages.innerHTML = "";

    res.data.forEach((msg) => {
      const type =
        msg.UserId === getUserIdFromToken() ? "sent" : "received";
      addMessage(msg.text, type);
    });
  } catch (err) {
    console.error("Load group messages error:", err);
  }
}

/* ================= SEND MESSAGE ================= */
chatForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const text = messageInput.value.trim();
  if (!text) return;

  if (currentRoom) {
    socket.emit("new_message", { roomId: currentRoom, text });
  } else {
    socket.emit("group_message", text);
  }

  messageInput.value = "";
});

/* ================= RECEIVE GROUP ================= */
socket.on("new_group_message", (msg) => {
  if (currentRoom) return;

  const type =
    msg.senderEmail === getEmailFromToken() ? "sent" : "received";

  addMessage(msg.text, type);
});

/* ================= RECEIVE PRIVATE ================= */
socket.on("new_message", (msg) => {
  if (msg.roomId !== currentRoom) return;

  const type =
    msg.fromUserId === getUserIdFromToken() ? "sent" : "received";

  addMessage(msg.text, type);
});

/* ================= EXIT ROOM ================= */
document.getElementById("exitRoomBtn").addEventListener("click", async () => {
  if (!currentRoom) return;

  socket.emit("leave_room", currentRoom);
  currentRoom = null;

  /* 🔥 reload group chat history */
  await loadGroupMessages();
});

/* ================= INITIAL LOAD ================= */
loadGroupMessages();
