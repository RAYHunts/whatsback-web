const { serverLog } = require("../../helper");

/**
 * Handles the "disconnected" event for the WhatsApp client.
 * Logs the disconnection, notifies connected sockets, destroys and reinitializes the client, and handles errors.
 * @param {string} reason - The reason for the disconnection.
 * @param {Client} client - The WhatsApp client instance.
 * @param {Array<Object>} connectedSockets - An array of connected sockets.
 * @returns {Promise<void>}
 */
module.exports = async (reason, client, connectedSockets) => {
  try {
    serverLog(`WhatsApp client disconnected, reason: ${reason}`);
    connectedSockets.forEach((socket) => {
      socket.emit("disconnected", `Client disconnected: ${reason}`);
    });
    await client.destroy();
    await client.initialize();
    connectedSockets.forEach((socket) =>
      socket.emit("logs", "WhatsApp client reinitializing...")
    );
    serverLog("WhatsApp client reinitialized after disconnection");
  } catch (error) {
    serverLog("Error in disconnection handler: " + error);
  }
};