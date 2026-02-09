const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const { getPrivateMessages } = require("../controllers/privateChatController");

router.get("/messages", authMiddleware, getPrivateMessages);

module.exports = router;
