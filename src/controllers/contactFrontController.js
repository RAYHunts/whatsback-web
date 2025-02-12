const contact = require("../models/contact");

const displayContacts = (req, res) => {
  const contacts = contact.iterate();
  const totalContacts = contact.count();
  res.render("contacts", { title: "Contacts", contacts, totalContacts });
};

module.exports = {
  displayContacts,
};
