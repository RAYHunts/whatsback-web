const contacts = require("../models/contact");
const groups = require("../models/group");

const displaySendMessageToUser = (req, res) => {
  const contactsToDisplay = contacts.paginate(undefined, 10, 1);
  const totalContacts = contacts.count();
  res.render("message", {
    title: "Send Message",
    contactsToDisplay,
    totalContacts,
  });
};

const displaySendMessageToGroup = (req, res) => {
  const groupsToDisplay = groups.paginate(undefined, 10, 1);
  const totalGroups = groups.count();
  res.render("group", {
    title: "Send Group Message",
    groupsToDisplay,
    totalGroups,
  });
};

module.exports = {
  displaySendMessageToUser,
  displaySendMessageToGroup,
};
