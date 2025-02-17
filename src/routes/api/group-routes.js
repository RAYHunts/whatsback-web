const express = require("express");
const { getPaginateGroup } = require("../../controllers/api/group-controller");
const router = express.Router();

// GET /api/groups
router.get("/", getPaginateGroup);

// POST /api/groups
// PUT /api/groups/:group_id
// DELETE /api/groups/:group_id

module.exports = router;