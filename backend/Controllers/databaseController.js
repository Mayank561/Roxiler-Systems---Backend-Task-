const axios = require("axios");
const ProductTransaction = require("../models/ProductTransaction");

// Initialize Database
exports.initializeDatabase = async (req, res) => {
  try {
    const response = await axios.get(
      "https://s3.amazonaws.com/roxiler.com/product_transaction.json"
    );
    const transactions = response.data;

    await ProductTransaction.deleteMany({}); 

    const result = await ProductTransaction.insertMany(transactions);
    console.log(`Inserted ${result.length} transactions`);
    res.status(200).send("Database initialized successfully");
  } catch (error) {
    console.error("Error initializing database:", error);
    res.status(500).send("Error initializing database");
  }
};
