const express = require("express");
const router = express.Router();

const { signup, login, getUserByEmail, getAllUsers } = require("../controllers/authController");

const authMiddleware = require("../middleware/authMiddleware");

/* Auth routes */
router.post("/signup", signup);
router.post("/login", login);

/* 🔍 find user by email (used for private chat) */
router.get("/user-by-email", authMiddleware, getUserByEmail);
router.get("/all-users", authMiddleware, getAllUsers);


module.exports = router;
