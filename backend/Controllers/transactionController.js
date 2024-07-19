const ProductTransaction = require("../models/ProductTransaction");
const moment = require("moment");

// Helper function to validate and parse the month
const parseMonth = (month) => {
  const startOfMonth = moment(month, "YYYY-MM").startOf("month").toDate();
  const endOfMonth = moment(month, "YYYY-MM").endOf("month").toDate();

  if (!moment(startOfMonth).isValid() || !moment(endOfMonth).isValid()) {
    return { startOfMonth: null, endOfMonth: null };
  }
  return { startOfMonth, endOfMonth };
};

// List transactions with search and pagination
exports.getTransactionsForMonth = async (req, res) => {
  const { month, search = "", page = 1 } = req.query;
  const limit = 10;
  const skip = (page - 1) * limit;

  console.log(`Received request with month=${month}, search=${search}, page=${page}`);

  if (!month || !moment(month, "YYYY-MM", true).isValid()) {
    return res.status(400).json({ message: 'Invalid month format' });
  }

  const { startOfMonth, endOfMonth } = parseMonth(month);

  if (!startOfMonth || !endOfMonth) {
    return res.status(400).json({ message: 'Invalid date range' });
  }

  try {
    const query = {
      dateOfSale: { $gte: startOfMonth, $lte: endOfMonth },
      description: { $regex: search, $options: "i" },
    };

    console.log("Constructed Query:", JSON.stringify(query, null, 2));

    const transactions = await ProductTransaction.find(query)
      .skip(skip)
      .limit(limit);

    const count = await ProductTransaction.countDocuments(query);

    res.json({ rows: transactions, count });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).send("Error fetching transactions");
  }
};

// Statistics for a specific month
exports.getStatisticsForMonth = async (req, res) => {
  const { month } = req.params;
  const { startOfMonth, endOfMonth } = parseMonth(month);

  if (!startOfMonth || !endOfMonth) {
    return res.status(400).json({ message: 'Invalid date' });
  }

  try {
    const totalSales = await ProductTransaction.aggregate([
      {
        $match: {
          dateOfSale: { $gte: startOfMonth, $lte: endOfMonth },
          sold: true,
        },
      },
      { $group: { _id: null, total: { $sum: "$price" } } },
    ]);

    const totalSoldItems = await ProductTransaction.countDocuments({
      dateOfSale: { $gte: startOfMonth, $lte: endOfMonth },
      sold: true,
    });

    const totalNotSoldItems = await ProductTransaction.countDocuments({
      dateOfSale: { $gte: startOfMonth, $lte: endOfMonth },
      sold: false,
    });

    res.json({
      totalSaleAmount: totalSales[0]?.total || 0,
      totalSoldItems,
      totalNotSoldItems,
    });
  } catch (error) {
    console.error("Error fetching statistics:", error);
    res.status(500).send("Error fetching statistics");
  }
};

// Bar chart data for a specific month
exports.getBarChartDataForMonth = async (req, res) => {
  const { month } = req.params;
  const { startOfMonth, endOfMonth } = parseMonth(month);

  if (!startOfMonth || !endOfMonth) {
    return res.status(400).json({ message: 'Invalid date' });
  }

  try {
    const data = await ProductTransaction.aggregate([
      { $match: { dateOfSale: { $gte: startOfMonth, $lte: endOfMonth } } },
      {
        $bucket: {
          groupBy: "$price",
          boundaries: [0, 100, 200, 300, 400, 500, 600, 700, 800, 900, Infinity],
          default: "Other",
          output: {
            count: { $sum: 1 },
          },
        },
      },
    ]);

    res.json(data);
  } catch (error) {
    console.error("Error fetching bar chart data:", error);
    res.status(500).send("Error fetching bar chart data");
  }
};

// Pie chart data for a specific month
exports.getPieChartDataForMonth = async (req, res) => {
  const { month } = req.params;
  const { startOfMonth, endOfMonth } = parseMonth(month);

  if (!startOfMonth || !endOfMonth) {
    return res.status(400).json({ message: 'Invalid date' });
  }

  try {
    const data = await ProductTransaction.aggregate([
      { $match: { dateOfSale: { $gte: startOfMonth, $lte: endOfMonth } } },
      { $group: { _id: "$category", count: { $sum: 1 } } },
    ]);

    res.json(data);
  } catch (error) {
    console.error("Error fetching pie chart data:", error);
    res.status(500).send("Error fetching pie chart data");
  }
};

// Combined data
exports.getCombinedData = async (req, res) => {
  const { month } = req.query;
  const { startOfMonth, endOfMonth } = parseMonth(month);

  if (!startOfMonth || !endOfMonth) {
    return res.status(400).json({ message: 'Invalid date' });
  }

  try {
    const [transactions, statistics, barChartData, pieChartData] = await Promise.all([
      new Promise((resolve, reject) => {
        exports.getTransactionsForMonth({ query: { month }, res: { json: resolve, status: (code) => ({ send: reject }) } });
      }),
      new Promise((resolve, reject) => {
        exports.getStatisticsForMonth({ params: { month }, res: { json: resolve, status: (code) => ({ send: reject }) } });
      }),
      new Promise((resolve, reject) => {
        exports.getBarChartDataForMonth({ params: { month }, res: { json: resolve, status: (code) => ({ send: reject }) } });
      }),
      new Promise((resolve, reject) => {
        exports.getPieChartDataForMonth({ params: { month }, res: { json: resolve, status: (code) => ({ send: reject }) } });
      }),
    ]);

    res.json({
      transactions: transactions.rows,
      count: transactions.count,
      statistics,
      barChartData,
      pieChartData,
    });
  } catch (error) {
    console.error("Error fetching combined data:", error);
    res.status(500).send("Error fetching combined data");
  }
};
