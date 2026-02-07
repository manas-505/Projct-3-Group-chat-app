const express = require("express");
const path = require("path");
const sequelize = require("./config/db");
const authRoutes = require("./routes/authRoutes");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use("/", authRoutes);

// HTML pages
app.get("/signup", (req, res) =>
  res.sendFile(path.join(__dirname, "views/signup.html"))
);

app.get("/login", (req, res) =>
  res.sendFile(path.join(__dirname, "views/login.html"))
);

app.get("/dashboard", (req, res) =>
  res.sendFile(path.join(__dirname, "views/dashboard.html"))
);

// DB connection
sequelize
  .sync()
  .then(() => {
    console.log("MySQL connected");
    app.listen(3000, () => console.log("Server running on port 3000"));
  })
  .catch(console.error);
