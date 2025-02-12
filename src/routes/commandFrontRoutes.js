const express = require("express");
const { displayCommand } = require("../controllers/commandFrontController");
const router = express.Router();

router.get("/", displayCommand);

module.exports = router;
