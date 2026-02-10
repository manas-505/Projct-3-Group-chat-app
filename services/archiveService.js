const { Op } = require("sequelize");
const Chat = require("../models/Message");
const ArchivedChat = require("../models/ArchivedChat");

async function archiveOldMessages() {
  try {
    console.log("🕛 Running nightly archive job...");

    /* 1️⃣ find messages older than 1 day */
    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);

    const oldMessages = await Chat.findAll({
      where: {
        createdAt: {
          [Op.lt]: oneDayAgo,
        },
      },
    });

    if (!oldMessages.length) {
      console.log("✅ No messages to archive");
      return;
    }

    /* 2️⃣ move to ArchivedChat table */
    const archiveData = oldMessages.map((msg) => ({
      text: msg.text,
      UserId: msg.UserId,
      createdAt: msg.createdAt,
      updatedAt: msg.updatedAt,
    }));

    await ArchivedChat.bulkCreate(archiveData);

    /* 3️⃣ delete from Chat table */
    await Chat.destroy({
      where: {
        createdAt: {
          [Op.lt]: oneDayAgo,
        },
      },
    });

    console.log(`📦 Archived ${oldMessages.length} messages`);
  } catch (err) {
    console.error("❌ Archive job error:", err);
  }
}

module.exports = archiveOldMessages;
