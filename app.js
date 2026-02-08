const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const sequelize = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const chatRoutes = require("./routes/chatRoutes");

const initSocket = require("./socket-io"); // 👈 new socket initializer
const http = require("http");

const app = express();

/* ===== Middleware ===== */
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ===== Static Files ===== */
app.use(express.static("public"));

/* ===== API Routes ===== */
app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);

/* ===== Page Routes ===== */
app.get("/signup", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "signup.html"));
});

app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "login.html"));
});

app.get("/dashboard", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "dashboard.html"));
});

/* ===== Create HTTP Server ===== */
const server = http.createServer(app);

/* ===== Initialize Socket.IO from separate file ===== */
initSocket(server, app);

/* ===== Start Server After DB Sync ===== */
sequelize.sync().then(() => {
  server.listen(3000, () => console.log("Server running on port 3000"));
});
