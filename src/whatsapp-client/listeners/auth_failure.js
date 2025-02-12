const { serverLog } = require("../../helper");

/**
 * Handles the "auth_failure" event for the WhatsApp client.
 * Logs the authentication failure and notifies all connected sockets.
 * @param {Array<Object>} connectedSockets - An array of connected sockets.
 * @returns {void}
 */
module.exports = (connectedSockets) => {
  serverLog("WhatsApp client failed to authenticate");
  connectedSockets.forEach((socket) => {
    socket.emit("logs", "Auth failure, restarting...");
  });
};