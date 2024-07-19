const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const productRoutes = require("./routes/productRoutes");
const cors = require("cors");
const app = express();
app.use(cors());
// Connect to MongoDB
mongoose.connect(
  "mongodb+srv://mayankguptaedu:JxUvHMCJOdz9fm0E@cluster0.f3tv539.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

app.use(bodyParser.json());
app.use("/api", productRoutes);

app.listen(8000, () => {
  console.log("Server is running on port 8000");
});
