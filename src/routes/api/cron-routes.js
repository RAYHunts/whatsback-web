const express = require("express");
const Cron = require("../../libs/cron-parser");
const router = express.Router();

// GET /api/contacts
router.get("/", (req, res) => {
    const { exp } = req.body;
    const cronInstance = new Cron(exp, { tz: process.env.TZ || "UTC" });
    res.json({
        description: cronInstance.translate(),
        nexRuns: cronInstance.getNextRuns(),
    });
});

module.exports = router;
