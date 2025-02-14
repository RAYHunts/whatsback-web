/**
 * Delays execution for a specified amount of time.
 * @param {number} ms - The number of milliseconds to sleep.
 * @returns {Promise<void>} A promise that resolves after the specified time.
 */
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Logs a message to the console with a formatted timestamp in the "Asia/Jakarta" timezone.
 * @param {string} message - The message to log.
 * @returns {void}
 */
const serverLog = (message) => {
  const now = new Date();
  const options = { timeZone: "Asia/Jakarta", hour12: false };
  const dateParts = now.toLocaleDateString("id-ID", options).split("/");
  const timeParts = now.toLocaleTimeString("id-ID", options).split(".");
  const formattedTimestamp = `${dateParts[2]}-${dateParts[1].padStart(
    2,
    "0"
  )}-${dateParts[0].padStart(2, "0")} ${timeParts[0].padStart(
    2,
    "0"
  )}:${timeParts[1].padStart(2, "0")}:${timeParts[2].padStart(2, "0")}`;

  console.log(`${formattedTimestamp} - BACKEND_LOG: ${message}`.toUpperCase());
};

/**
 * Formats a given phone number into a WhatsApp-compatible format.
 * @param {string} number - The phone number to format.
 * @returns {string} The formatted phone number.
 */
const phoneNumberFormatter = function (number) {
  let formatted = number.replace(/\D/g, "");

  if (formatted.startsWith("0")) {
    formatted = "62" + formatted.substr(1);
  }

  if (!formatted.endsWith("@c.us")) {
    formatted += "@c.us";
  }

  return formatted;
};

/**
 * Removes duplicate contacts based on their number.
 * @param {Array} contacts - Array of contact objects.
 * @returns {Array} - Array of unique contact objects.
 */
const removeDuplicateContacts = (contacts) => {
  const uniqueContactsMap = new Map();

  // Iterate through all contacts
  contacts.forEach((contact) => {
    // Use the contact's number as the unique key
    if (
      !uniqueContactsMap.has(contact.number) &&
      uniqueContactsMap.id.server === "c.us"
    ) {
      uniqueContactsMap.set(contact.number, contact);
    }
  });

  // Convert the Map back to an array
  return Array.from(uniqueContactsMap.values());
};

/**
 * Formats a given phone number into a WhatsApp-compatible international format.
 * @param {string} number - The phone number to format.
 * @returns {string} The formatted phone number.
 */
const formatInternationalPhoneNumber = (number) => {
  number = number.toString();
  // Ensure the number starts with "62" (Indonesia's country code)
  if (!number.startsWith("62")) {
    return number;
  }

  // Remove the country code and add the plus sign
  let localNumber = number.slice(2); // Remove "62"

  // Format based on number length (handling 10-15 digit local numbers)
  if (localNumber.length === 10) {
    return `+62 ${localNumber.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3")}`;
  } else if (localNumber.length === 11) {
    return `+62 ${localNumber.replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3")}`;
  } else if (localNumber.length === 12) {
    return `+62 ${localNumber.replace(/(\d{4})(\d{4})(\d{4})/, "$1-$2-$3")}`;
  } else if (localNumber.length === 13) {
    return `+62 ${localNumber.replace(/(\d{4})(\d{4})(\d{5})/, "$1-$2-$3")}`;
  } else if (localNumber.length === 14) {
    return `+62 ${localNumber.replace(/(\d{4})(\d{5})(\d{5})/, "$1-$2-$3")}`;
  } else if (localNumber.length === 15) {
    return `+62 ${localNumber.replace(/(\d{4})(\d{5})(\d{6})/, "$1-$2-$3")}`;
  } else {
    return "Invalid length for an Indonesian number";
  }
};

/**
 * Takes a string of comma-separated origins and returns an array of valid origins.
 * If the input is empty, not a string, or contains only whitespace, returns "*".
 * @param {string} value - The string of comma-separated origins
 * @returns {string[]|string} - The array of valid origins or "*".
 */
const parseOrigins = (value) => {
  if (!value || typeof value !== 'string') return "*";
  // Split on comma, trim spaces, and filter out any empty entries
  const origins = value.split(',').map(o => o.trim()).filter(o => o.length > 0);
  // Return the array if any valid entries exist, otherwise default to "*"
  return origins.length > 0 ? origins : "*";
};

module.exports = {
  sleep,
  serverLog,
  phoneNumberFormatter,
  removeDuplicateContacts,
  formatInternationalPhoneNumber,
  parseOrigins
};
