const database = require("./src/database");
const cron = require("node-cron");
const { client } = require("./src/whatsapp-client");
const { serverLog } = require("./src/helper");

// Create tables if they don't exist
database
  .prepare(
    `
  CREATE TABLE IF NOT EXISTS jobs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    job_name TEXT,
    job_trigger TEXT,
    target_contact_or_group TEXT,
    message TEXT,
    job_cron_expression TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME,
    deleted_at DATETIME
  )
`
  )
  .run();

database
  .prepare(
    `
  CREATE TABLE IF NOT EXISTS job_histories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    job_name TEXT,
    job_execute_time DATETIME,
    job_complete_time DATETIME,
    job_error_message TEXT
  )
`
  )
  .run();

// In-memory map to keep track of scheduled jobs
const scheduledJobs = new Map();

// Example functions for different job triggers
function sendMessage(job) {
  serverLog(
    `send_message: Sending "${job.message}" to ${job.target_contact_or_group}`
  );
}

function sendGroupMessage(job) {
  serverLog(
    `send_group_message: Sending "${job.message}" to group ${job.target_contact_or_group}`
  );
}

// Function to log job history (synchronously using better-sqlite3)
function logJobHistory(job, executeTime, completeTime, errorMessage) {
  try {
    const stmt = database.prepare(`
      INSERT INTO job_histories (job_name, job_execute_time, job_complete_time, job_error_message)
      VALUES (?, ?, ?, ?)
    `);
    stmt.run(job.job_name, executeTime, completeTime, errorMessage);
    serverLog(`Job history logged for job "${job.job_name}"`);
  } catch (error) {
    serverLog(`Error logging history for job ${job.id}:`, error.message);
  }
}

// Function to schedule an individual job
function scheduleJob(job) {
  // Validate the cron expression
  if (!cron.validate(job.job_cron_expression)) {
    serverLog(
      `Invalid cron expression for job "${job.job_name}" (ID: ${job.id})`
    );
    return;
  }

  // If the job is already scheduled, skip it
  if (scheduledJobs.has(job.id)) {
    return;
  }

  // Schedule the job using node-cron
  const task = cron.schedule(job.job_cron_expression, () => {
    const executeTime = new Date().toISOString();
    serverLog(
      `Executing job "${job.job_name}" (ID: ${job.id}) at ${executeTime}`
    );

    try {
      if (job.job_trigger === "send_message") {
        sendMessage(job);
      } else if (job.job_trigger === "send_group_message") {
        sendGroupMessage(job);
      } else {
        console.warn(
          `Unknown trigger "${job.job_trigger}" for job "${job.job_name}"`
        );
      }

      const completeTime = new Date().toISOString();
      logJobHistory(job, executeTime, completeTime);
    } catch (error) {
      const completeTime = new Date().toISOString();
      logJobHistory(job, executeTime, completeTime, error.message);
      serverLog(
        `Error executing job "${job.job_name}" (ID: ${job.id}):`,
        error.message
      );
    }
  });

  scheduledJobs.set(job.id, task);
  serverLog(
    `Scheduled job "${job.job_name}" (ID: ${job.id}) with cron expression: ${job.job_cron_expression}`
  );
}

// Function to load jobs from the database synchronously
function loadJobs() {
  try {
    const rows = database
      .prepare("SELECT * FROM jobs WHERE deleted_at IS NULL")
      .all();
    for (let job of rows) {
      // Schedule the job if it's not already scheduled
      if (!scheduledJobs.has(job.id)) {
        scheduleJob(job);
      }
    }
  } catch (error) {
    serverLog("Error fetching jobs:", error.message);
  }
}

function startCronJobs() {
  serverLog("Cron job started!");
  // Poll the database every 20 seconds for new jobs
  setInterval(loadJobs, 20_000);
  loadJobs(); // Initial load on startup
}

// Check if WhatsApp client is already authenticated
if (client.info) {
  serverLog("WhatsApp Client is authenticated!");
  startCronJobs();
} else {
  serverLog(
    "WhatsApp Client is not authenticated! Waiting for authentication..."
  );
  // Listen for the authentication event
  client.on("authenticated", () => {
    serverLog("WhatsApp Client is authenticated!");
    startCronJobs();
  });
}
