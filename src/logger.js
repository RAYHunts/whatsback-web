const path = require("node:path");
const winston = require("winston");
require("winston-daily-rotate-file");

// Create a transport that rotates logs daily,
// compresses the rotated logs, limits the size to 20MB,
// and keeps logs for 14 days.
const rotate = new winston.transports.DailyRotateFile({
  filename: path.join(__dirname, "..", "logs", "app-%DATE%.log"),
  datePattern: "YYYY-MM-DD",
  zippedArchive: true,
  maxSize: "20m",
  maxFiles: "14d",
  level: "debug",
  format: winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.json()
  ),
});

// Create a Winston logger using the above rotate.
const logger = winston.createLogger({
  level: "debug",
  transports: [
    rotate,
  ],
});

// Listen for errors in the rotation process.
rotate.on("error", (error) => {
  logger.error("Error in log file rotation:", error);
});

// Optionally, listen for the 'rotate' event when a log file is rotated.
rotate.on("rotate", (oldFilename, newFilename) => {
  logger.info(`Rotated log file: ${oldFilename} -> ${newFilename}`);
});

module.exports = logger;
