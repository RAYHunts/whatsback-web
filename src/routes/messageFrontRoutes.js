const express = require("express");
const {
  displaySendMessageToUser,
  displaySendMessageToGroup,
} = require("../controllers/messageFrontController");
const router = express.Router();

router.get("/send", displaySendMessageToUser);
router.get("/send-group", displaySendMessageToGroup);

module.exports = router;
