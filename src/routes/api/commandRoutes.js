const express = require("express");
const router = express.Router();
const validateRequestBody = require("../../middlewares/validateRequestBody");
const {
  getAllCommands,
  createCommand,
  updateCommand,
  deleteCommand,
} = require("../../controllers/api/commandController");

// GET /api/command
router.get("/", getAllCommands);

// POST /api/command
router.post(
  "/",
  validateRequestBody({ command: "string", response: "string" }),
  createCommand
);

// PUT /api/command/:command_id
router.put(
  "/:command_id",
  validateRequestBody({ command: "string", response: "string" }),
  updateCommand
);

// DELETE /api/command/:command_id
router.delete("/:command_id", deleteCommand);

module.exports = router;
