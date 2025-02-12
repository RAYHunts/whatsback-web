const { serverLog } = require("../../helper");
const userInfo = require("../getProfile");

/**
 * Handles the "ready" event for the WhatsApp client.
 * Updates the state and notifies all connected sockets that the WhatsApp client is ready.
 * @param {Client} client - The WhatsApp client instance.
 * @param {Array<Object>} connectedSockets - An array of connected sockets.
 * @param {Object} state - The application state object.
 * @returns {void}
 */
module.exports = async (client, connectedSockets, state) => {
  serverLog("WhatsApp client is ready");
  state.isReady = true;

  const info = await userInfo(client);

  connectedSockets.forEach((socket) => {
    socket.emit("ready", {
      log: "WhatsApp is ready!",
      user_info: {
        name: info.name,
        picture: info.picture,
      },
    });
    socket.emit("logs", "WhatsApp is ready!");
  });
};
