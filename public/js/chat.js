const chatMessages = document.getElementById("chatMessages");
const chatForm = document.getElementById("chatForm");
const messageInput = document.getElementById("messageInput");

/* 🔥 connect socket */
const socket = io("http://localhost:3000", {
  auth: {
    token: localStorage.getItem("token"),
  },
});


/* Auto scroll to bottom */
function scrollToBottom() {
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

/* Add message to UI */
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

/* Handle send */
chatForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const text = messageInput.value.trim();
  if (!text) return;

  try {
    await api.post("/chat/send", { text });

    // ❌ DO NOT addMessage here (socket will handle it)
    messageInput.value = "";
  } catch (err) {
    console.error("Send error", err);
  }
});

/* 🔥 Listen for live messages from server */
socket.on("newMessage", (msg) => {
  const type = msg.UserId === getUserIdFromToken() ? "sent" : "received";
  addMessage(msg.text, type);
});

/* 🔐 Receive authenticated user info from server */
socket.on("userConnected", (user) => {
  console.log("Connected user:", user);

  // Show user ID in chat header (optional UI update)
  const header = document.querySelector(".chat-header h5");
  if (header) {
    header.innerText = `My Group Chat (User ${user.name})`;
  }
});

/* Logout */
document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("token");
  window.location.href = "/login";
});

/* Load old messages from DB */
async function loadMessages() {
  try {
    const res = await api.get("/chat/messages");

    chatMessages.innerHTML = "";

    res.data.forEach((msg) => {
      const type = msg.UserId === getUserIdFromToken() ? "sent" : "received";
      addMessage(msg.text, type);
    });
  } catch (err) {
    console.error("Load messages error", err);
  }
}

/* Decode user ID from JWT */
function getUserIdFromToken() {
  const token = localStorage.getItem("token");
  if (!token) return null;

  const payload = JSON.parse(atob(token.split(".")[1]));
  return payload.id;
}

/* Initial load */
loadMessages();
