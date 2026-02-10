const chatMessages = document.getElementById("chatMessages");
const chatForm = document.getElementById("chatForm");
const messageInput = document.getElementById("messageInput");

let currentRoom = null;

/* ================= AUTH CHECK ================= */
(function checkAuth() {
  const token = localStorage.getItem("token");

  /* if token missing → go to signup */
  if (!token) {
    window.location.href = "/signup";
  }
})();

/* ================= LOGOUT ================= */
const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  });
}

/* SOCKET CONNECT */
const socket = io("http://localhost:3000", {
  auth: { token: localStorage.getItem("token") },
});

/* scroll */
function scrollToBottom() {
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

/* format DB/socket time */
function formatTime(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

/* ================= SAFE MESSAGE UI ================= */
function addMessage(msg, type = "sent") {
  const sender =
    msg.senderName ||        // socket live
    msg.User?.name ||        // DB history
    msg.senderEmail ||       // fallback
    "Unknown";

  const time = formatTime(msg.createdAt);

  const div = document.createElement("div");
  div.classList.add("message", type);

  div.innerHTML = `
    <div class="sender">${sender}</div>
    <div class="text">${msg.text}</div>
    <div class="time">${time}</div>
  `;

  chatMessages.appendChild(div);
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

    addMessage(msg, type);
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

      addMessage(msg, type);
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
    msg.UserId === getUserIdFromToken() ? "sent" : "received";

  addMessage(msg, type);
});

/* ================= RECEIVE PRIVATE ================= */
socket.on("new_message", (msg) => {
  if (msg.roomId !== currentRoom) return;

  const type =
    msg.UserId === getUserIdFromToken() ? "sent" : "received";

  addMessage(msg, type);
});

/* ================= EXIT ROOM ================= */
document.getElementById("exitRoomBtn").addEventListener("click", async () => {
  if (!currentRoom) return;

  socket.emit("leave_room", currentRoom);
  currentRoom = null;

  await loadGroupMessages();
});

/* ================= INITIAL LOAD ================= */
loadGroupMessages();
