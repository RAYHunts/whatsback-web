const { insertOrReplaceMany } = require("../models/group");

module.exports = async (client) => {
  const chats = await client.getChats();
  const groupChats = chats.filter((chat) => chat.isGroup);
  const groups = groupChats.map((group) => ({
    groupId: group.id._serialized,
    groupName: group.name,
    totalParticipants: group.participants.length,
  }));

  insertOrReplaceMany(groups);
};
