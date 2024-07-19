const express = require("express");
const router = express.Router();
const databaseController = require("../Controllers/databaseController");
const transactionController = require("../Controllers/transactionController");

// Initialize Database
router.get("/initialize", databaseController.initializeDatabase);

// Get Transactions
router.get("/transactions", transactionController.getTransactionsForMonth);

// Get Statistics
router.get("/statistics/:month", transactionController.getStatisticsForMonth);

// Get Bar Chart Data
router.get("/bar-chart/:month", transactionController.getBarChartDataForMonth);

// Get Pie Chart Data
router.get("/pie-chart/:month", transactionController.getPieChartDataForMonth);

// Get Combined Data
router.get("/combined", transactionController.getCombinedData);

module.exports = router;
