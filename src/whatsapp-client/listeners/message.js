const db = require("../../db");
const { phoneNumberFormatter } = require("../../helper");

/**
 * Handles incoming messages for the WhatsApp client.
 * Responds to specific commands or messages with predefined replies.
 * @param {Message} msg - The incoming message object.
 * @param {Client} client - The WhatsApp client instance.
 * @returns {void}
 */
module.exports = async (msg, client) => {
  try {
    if (msg.body.startsWith("!")) {
      const stmt = db.prepare(
        "SELECT command, response FROM commands WHERE command = ?"
      );
      const data = stmt.get(msg.body);

      if (msg.body === data.command) {
        msg.reply(data.response);
      } else if (msg.body === "!whois") {
        msg.reply(`I am ${client.info?.pushname || "unknown"}`);
      } else if (msg.body === "!whoami") {
        const contact = await msg.getContact();
        const contactName = contact.pushname || contact.name || "Unknown";
        const contactNumber = phoneNumberFormatter(contact.number);
        client.sendMessage(
          contactNumber,
          `Hi! Your name is *${contactName}* and your number is ${contact.number}`
        );
      } else {
        console.warn("Command not found");
        msg.reply("Command not found!");
      }
    }
  } catch (error) {}
};
