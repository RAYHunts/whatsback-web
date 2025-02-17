const database = require("./database");
const crypto = require("node:crypto");

const commands = () => {
  const sql = `CREATE TABLE IF NOT EXISTS commands (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, command TEXT UNIQUE NOT NULL, response TEXT NOT NULL)`;
  return database.prepare(sql);
};

const contacts = () => {
  const sql = `CREATE TABLE IF NOT EXISTS contacts (
    number INTEGER PRIMARY KEY,
    name TEXT
  )`;
  return database.prepare(sql);
};

const addProfilePictureInContact = () => {
  const columns = database.prepare("PRAGMA table_info(contacts)").all();
  const columnExists = columns.some((col) => col.name === "profilePicture");

  if (!columnExists) {
    const contactImage = crypto.randomBytes(4).toString("hex");
    const sql = `
      ALTER TABLE contacts 
      ADD COLUMN profilePicture TEXT NOT NULL DEFAULT 'https://robohash.org/${contactImage}'
    `;
    database.prepare(sql).run();
  }
};

const groups = () => {
  const sql = `CREATE TABLE IF NOT EXISTS groups (
    groupId TEXT PRIMARY KEY,
    groupName TEXT,
    totalParticipants INTEGER
  )`;
  return database.prepare(sql);
};

const init = () => {
  commands().run();
  contacts().run();
  addProfilePictureInContact();
  groups().run();
};

module.exports = init;

