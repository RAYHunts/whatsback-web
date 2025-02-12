const { insertOrReplaceMany } = require("../models/contact");

module.exports = async (client) => {
  const allContacts = await client.getContacts();
  const contacts = [];
  if (allContacts) {
    for (let contact of allContacts) {
      if (
        contact.id.server === "c.us" &&
        contact.isMe === false &&
        contact.isUser === true &&
        contact.isGroup === false &&
        contact.isWAContact === true &&
        contact.isBlocked === false
      ) {
        contacts.push({
          name: contact.name,
          number: contact.number,
        });
      }
    }

    insertOrReplaceMany(contacts);
  }
};
