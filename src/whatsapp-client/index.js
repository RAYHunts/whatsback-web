const { Client, LocalAuth } = require("whatsapp-web.js");

/**
 * WhatsApp client instance configured with LocalAuth and custom Puppeteer settings.
 * @type {Client}
 */
const client = new Client({
  authStrategy: new LocalAuth(),
  restartOnAuthFail: true,
  takeoverOnConflict: true,
  puppeteer: {
    headless: true,
    args: [
      "--disable-gpu",
      "--disable-dev-shm-usage",
      "--disable-setuid-sandbox",
      "--no-first-run",
      "--no-sandbox",
      "--no-zygote",
      "--deterministic-fetch",
      "--disable-features=IsolateOrigins",
      "--disable-site-isolation-trials",
    ],
  },
  qrMaxRetries: 10,
});

/**
 * Array of connected sockets.
 * @type {Array<Object>}
 */
let connectedSockets = [];

// Import event listeners (each is in its own module)
const readyListener = require("./listeners/ready");
const authenticatedListener = require("./listeners/authenticated");
const authFailureListener = require("./listeners/auth_failure");
const qrListener = require("./listeners/qr");
const disconnectedListener = require("./listeners/disconnected");
const messageListener = require("./listeners/message");

const state = require("./state");

// Register WhatsApp client event listeners, passing in the client, sockets, and state.
client.on("ready", () => readyListener(client, connectedSockets, state));
client.on("authenticated", () => authenticatedListener(client, connectedSockets, state));
client.on("auth_failure", () => authFailureListener(connectedSockets));
client.on("qr", (qr) => qrListener(qr, connectedSockets, state));
client.on("disconnected", (reason) => disconnectedListener(reason, client, connectedSockets));
client.on("message", (msg) => messageListener(msg, client));

client.initialize();

/**
 * Updates the reference to the connected sockets.
 * @param {Array<Object>} sockets - The new array of connected sockets.
 * @returns {void}
 */
const setSocketManager = (sockets) => {
  connectedSockets = sockets;
};

/**
 * Exported module containing the WhatsApp client and a setter for the socket manager.
 * @module WhatsAppClient
 * @property {Client} client - The WhatsApp client instance.
 * @property {Function} setSocketManager - Function to update the connected sockets.
 */
module.exports = { client, setSocketManager };
