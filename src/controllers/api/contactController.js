const contacts = require("../../models/contact");

const getContacts = async (req, res) => {
  try {
    const searchTerm = req.query.search || "";
    const perPage = req.query.perPage || 10;
    const page = req.query.page || 1;

    const contactsToDisplay = contacts.paginate(searchTerm, perPage, page);
    const totalContacts = contacts.count();
    res.status(200).json({
      status: true,
      message: "Contacts fetched successfully",
      data: {
        contacts: contactsToDisplay,
        totalContacts,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: false,
      message: "Internal Server Error",
    });
  }
};

module.exports = {
  getContacts,
};
