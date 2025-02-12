const db = require("./db");

const commands = () => {
  const sql = `CREATE TABLE IF NOT EXISTS commands (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, command TEXT UNIQUE NOT NULL, response TEXT NOT NULL)`;
  return db.prepare(sql);
};

const contacts = () => {
  const sql = `CREATE TABLE IF NOT EXISTS contacts (
    number INTEGER PRIMARY KEY,
    name TEXT
  )`;
  return db.prepare(sql);
};

const groups = () => {
  const sql = `CREATE TABLE IF NOT EXISTS groups (
    groupId TEXT PRIMARY KEY,
    groupName TEXT,
    totalParticipants INTEGER
  )`;
  return db.prepare(sql);
}

const init = () => {
    commands().run();
    contacts().run();
    groups().run();
};

module.exports = init;
