const groups = require("../../models/group");

const getPaginateGroup = async (req, res) => {
  try {
    // Pagination variables
    const terms = req.query.search || "";
    const perPage = req.query.perPage || 10; // Number of groups per page
    let page = req.query.page || 1; // Current page number

    const groupsToDisplay = groups.paginate(terms, perPage, page);

    res.status(200).json({
      status: true,
      message: `Fetch group page ${page}`,
      data: groupsToDisplay,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: `API Error - ${error}`,
    });
  }
};

module.exports = {
  getPaginateGroup,
};
