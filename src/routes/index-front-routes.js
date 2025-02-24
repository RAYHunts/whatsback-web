const express = require("express");
const message_history = require("../models/message_history");
const router = express.Router();

router.get("/", (req, res) => {
  const totalDirectMessages = message_history.countDirectMessage();
  const totalGroupMessages = message_history.countGroupMessage();

  res.render("index", {
    pathname: "dashboard",
    totalDirectMessages,
    totalGroupMessages,
  });
});

router.get("/user-manual", (req, res) => {
  const totalDirectMessages = message_history.countDirectMessage();
  const totalGroupMessages = message_history.countGroupMessage();

  res.render("user-manual", {
    pathname: "user-manual",
    title: 'User Manual',
    totalDirectMessages,
    totalGroupMessages,
  });
});

module.exports = router;
