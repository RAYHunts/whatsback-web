/**
 * @module state
 * @property {string|null} lastQR - The last QR code data, or `null` if no QR code is available.
 * @property {boolean} isAuthenticated - Indicates whether the user is authenticated.
 * @property {boolean} isReady - Indicates whether the application is ready.
 */
module.exports = {
  lastQR: null,
  isAuthenticated: false,
  isReady: false,
};
