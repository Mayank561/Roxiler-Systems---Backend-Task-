const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const dotenv = require("dotenv").config();
const productRoutes = require("./routes/productRoutes");
const cors = require("cors");
const app = express();
app.use(cors());
// Connect to MongoDB
mongoose.connect(process.env.MONGODB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(bodyParser.json());
app.use("/api", productRoutes);

app.listen(8000, () => {
  console.log("Server is running on port 8000");
});
