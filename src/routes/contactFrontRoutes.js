const express = require("express");
const { displayContacts } = require("../controllers/contactFrontController");
const router = express.Router();

router.get("/", displayContacts);

module.exports = router;
