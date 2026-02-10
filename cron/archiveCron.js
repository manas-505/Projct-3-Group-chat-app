const cron = require("node-cron");
const archiveOldMessages = require("../services/archiveService");

/*
   Runs every day at 12:00 AM
   ┌──────────── minute (0)
   │ ┌────────── hour (0)
   │ │ ┌──────── day of month (*)
   │ │ │ ┌────── month (*)
   │ │ │ │ ┌──── day of week (*)
   │ │ │ │ │
   │ │ │ │ │
   0 0 * * *
*/
function startArchiveCron() {
  cron.schedule("0 0 * * *", async () => {
    console.log("⏰ Cron triggered at midnight");
    await archiveOldMessages();
  });

  console.log("📅 Archive cron scheduled (runs every midnight)");
}

module.exports = startArchiveCron;
