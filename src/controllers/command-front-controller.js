const command = require("../models/command");

const displayCommand = (req, res) => {
  const commands = command.iterate();
  const totalCommand = command.count();
  res.render("commands", { title: "Commands", commands, totalCommand });
};

module.exports = {
  displayCommand,
};