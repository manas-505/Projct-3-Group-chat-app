const chatMessages = document.getElementById("chatMessages");
const chatForm = document.getElementById("chatForm");
const messageInput = document.getElementById("messageInput");

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

    addMessage(text, "sent"); // show instantly
    messageInput.value = "";
  } catch (err) {
    console.error("Send error", err);
  }
});


/* Initial scroll */
scrollToBottom();

/* Logout */
document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("token");
  window.location.href = "/login";
});

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

function getUserIdFromToken() {
  const token = localStorage.getItem("token");
  if (!token) return null;

  const payload = JSON.parse(atob(token.split(".")[1]));
  return payload.id;
}

loadMessages();
