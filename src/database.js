const Database = require("better-sqlite3");

const database = new Database("whatsback.db", {
  busyTimeout: 7000, // Wait up to 7 seconds for the database to be available
});
database.pragma("journal_mode = WAL");

module.exports = database;
