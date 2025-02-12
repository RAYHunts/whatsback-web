const { sleep, serverLog } = require("../../helper");
const userInfo = require("../getProfile");
const getContacts = require("../getContacts");
const getGroups = require("../getGroups");

/**
 * Handles the "authenticated" event for the WhatsApp client.
 * Updates the state and notifies all connected sockets that the WhatsApp client is authenticated.
 * @param {Client} client - The WhatsApp client instance.
 * @param {Array<Object>} connectedSockets - An array of connected sockets.
 * @param {Object} state - The application state object.
 * @returns {Promise<void>}
 */
module.exports = async (client, connectedSockets, state) => {
  serverLog("WhatsApp client is authenticated");
  state.isAuthenticated = true;

  await sleep(2000);

  const info = await userInfo(client);
  getContacts(client);
  getGroups(client);

  connectedSockets.forEach((socket) => {
    socket.emit("authenticated", {
      log: "WhatsApp is authenticated!",
      user_info: {
        name: info.name,
        picture: info.picture,
      },
    });
  });
};
