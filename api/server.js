const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();
const serverless = require("serverless-http");

const app = express();
const port = process.env.PORT || 5000;
const password = process.env.USER_PASS;

// Middleware
app.use(bodyParser.json());
app.use(
  cors({
    origin: "*", // Allows all origins
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE", // Allowed methods
    preflightContinue: false,
    optionsSuccessStatus: 204,
  })
);

// MongoDB connection string from MongoDB Compass
const dbURI = `mongodb+srv://user1:${password}@cluster0.vjtw6qs.mongodb.net?retryWrites=true&w=majority`;

mongoose
  .connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

// Define a schema and model
const itemSchema = new mongoose.Schema({
  name: String,
  email: String,
  message: String,
});

const Item = mongoose.model("Item", itemSchema);

// Routes
app.get("/", async (req, res) => {
  try {
    res.status(200).send("The Server is up");
  } catch (err) {
    res.status(500).send(err);
  }
});

app.post("/details", async (req, res) => {
  console.log(req.body, "------------------------------------------------------");
  const newItem = new Item(req.body);
  try {
    await newItem.save();
    res.status(201).json(newItem);
  } catch (err) {
    res.status(400).send(err);
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

module.exports = app;
module.exports.handler = serverless(app);
