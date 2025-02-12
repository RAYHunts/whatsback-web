const express = require("express");
const { getContacts } = require("../../controllers/api/contactController");
const router = express.Router();

// GET /api/contacts
router.get("/", getContacts);

// POST /api/contacts
// PUT /api/contacts/:contact_id
// DELETE /api/contacts/:contact_id

module.exports = router;
