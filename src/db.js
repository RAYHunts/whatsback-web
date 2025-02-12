const Database = require("better-sqlite3");

const db = new Database("whatsback.db", {
  busyTimeout: 7000, // Wait up to 7 seconds for the database to be available
});
db.pragma("journal_mode = WAL");

module.exports = db;
