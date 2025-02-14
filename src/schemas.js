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

const addProfilePictureInContact = () => {
  const columns = db.prepare("PRAGMA table_info(contacts)").all();
  const columnExists = columns.some((col) => col.name === "profilePicture");

  if (!columnExists) {
    const contactImage = Math.random().toString(36).substring(2);
    const sql = `
      ALTER TABLE contacts 
      ADD COLUMN profilePicture TEXT NOT NULL DEFAULT 'https://robohash.org/${contactImage}'
    `;
    db.prepare(sql).run();
  }
};

const groups = () => {
  const sql = `CREATE TABLE IF NOT EXISTS groups (
    groupId TEXT PRIMARY KEY,
    groupName TEXT,
    totalParticipants INTEGER
  )`;
  return db.prepare(sql);
};

const init = () => {
  commands().run();
  contacts().run();
  addProfilePictureInContact();
  groups().run();
};

module.exports = init;
