const database = require("./src/database");
const cron = require("node-cron");
const { serverLog } = require("./src/helper");
require("dotenv").config();

const APP_HOST =
  process.env.NODE_ENV === "production"
    ? process.env.APP_HOST || "app"
    : "localhost";
const APP_PORT = process.env.APP_PORT || 5001;
const APP_URL = `http://${APP_HOST}:${APP_PORT}`;

// In-memory map to keep track of scheduled jobs
const scheduledJobs = new Map();

function getDetailContact(job) {
  const detail = job.target_contact_or_group.split("|");
  const name = detail[0];
  const number = detail[1];

  return [name, number];
}

// Example functions for different job triggers
async function sendMessage(job) {
  const [name, number] = getDetailContact(job);
  const response = await fetch(`${APP_URL}/api/message/send-message`, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
      "WHATSBACK-SOURCE": "cronjob",
    },
    body: JSON.stringify({
      number,
      message: job.message,
    }),
  });
  const result = await response.json();
  if (result.status) {
    serverLog(`send_message: Sending "${job.message}" to ${name} ${number}`);
    return;
  }

  serverLog(
    `send_message: Failed to send "${job.message}" to ${name} ${number}`
  );
}

async function sendGroupMessage(job) {
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
      .prepare(
        "SELECT * FROM jobs WHERE target_contact_or_group IS NOT NULL AND message IS NOT NULL AND job_status = 1 AND deleted_at IS NULL AND job_status = 1"
      )
      .all();
    for (let job of rows) {
      if (!scheduledJobs.has(job.id)) {
        scheduleJob(job);
      }
    }
  } catch (error) {
    serverLog("Error fetching jobs:", error.message);
  }
}

async function startCronJobs() {
  serverLog("Cron job started!");

  // Add retry logic for health check
  let retries = 5;
  while (retries > 0) {
    try {
      const response = await fetch(`${APP_URL}/health`, {
        method: "GET",
        timeout: 5000, // Add timeout
      });

      if (response.ok) {
        serverLog("Health check successful");
        break;
      }
    } catch (error) {
      serverLog(
        `Health check failed (${retries} retries left):`,
        error.message
      );
      retries--;
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }
  }

  if (retries === 0) {
    serverLog("Failed to connect to app after 5 attempts");
    process.exit(1);
  }

  // Poll the database every 20 seconds for new jobs
  setInterval(loadJobs, 20_000);
  loadJobs(); // Initial load on startup
}

startCronJobs();
