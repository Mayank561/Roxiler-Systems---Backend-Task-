const mongoose = require('mongoose');

const productTransactionSchema = new mongoose.Schema({
  description: String,
  price: Number,
  category: String,
  dateOfSale: Date,
  sold: Boolean,
});

const ProductTransaction = mongoose.model('ProductTransaction', productTransactionSchema);

module.exports = ProductTransaction;
