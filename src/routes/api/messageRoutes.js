const express = require("express");
const router = express.Router();
const validateRequestBody = require("../../middlewares/validateRequestBody");
const {
  sendMessageToUser,
  sendMessageToGroup,
} = require("../../controllers/api/messageController");

router.post(
  "/send-message",
  validateRequestBody({ number: "string", message: "string" }),
  sendMessageToUser
);
router.post(
  "/send-group-message",
  validateRequestBody({ groupId: "string", message: "string" }),
  sendMessageToGroup
);

module.exports = router;
