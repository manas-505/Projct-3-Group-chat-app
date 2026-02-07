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
chatForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const text = messageInput.value.trim();
  if (!text) return;

  addMessage(text, "sent"); // UI only (real-time later)

  messageInput.value = "";
});

/* Initial scroll */
scrollToBottom();

/* Logout */
document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("token");
  window.location.href = "/login";
});
