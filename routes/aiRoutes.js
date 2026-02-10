const express = require("express");
const router = express.Router();
const aiController = require("../controllers/aiController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/predict", authMiddleware, aiController.predictText);
router.post("/smart-replies", authMiddleware, aiController.smartReplies);

module.exports = router;
