const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const sequelize = require("./config/db");
const authRoutes = require("./routes/authRoutes");

const app = express();
const chatRoutes = require("./routes/chatRoutes");

app.use(express.json());

app.use("/api/chat", chatRoutes);

app.use(cors());

app.use(express.urlencoded({ extended: true }));

// static files (css, js)
app.use(express.static("public"));

// API routes
app.use("/api/auth", authRoutes);

// ✅ PAGE ROUTES (IMPORTANT)
app.get("/signup", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "signup.html"));
});

app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "login.html"));
});

app.get("/dashboard", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "dashboard.html"));
});

const http = require("http");
const { Server } = require("socket.io");

/* create http server from express */
const server = http.createServer(app);

/* socket.io setup */
const io = new Server(server, {
  cors: { origin: "*" },
});

/* make io accessible in controllers */
app.set("io", io);

/* socket connection */
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

/* start server after DB sync */
sequelize.sync().then(() => {
  server.listen(3000, () => console.log("Server running on port 3000"));
});

