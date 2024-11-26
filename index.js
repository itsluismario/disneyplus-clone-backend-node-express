// index.js
const express = require("express");
require("dotenv").config();
const app = express();
const mongoose = require("mongoose");
const routerApi = require("./routes/index");

const uri = process.env.MONGODB_URI;

// Middleware
app.use(express.json());

// // Function to link routes with the app
routerApi(app);

mongoose.connect(uri).then(() => {
  console.log("Connected!");
  app.listen(3000, () => {
    console.log("Server running on port 3000");
  });

}).catch ( () => {
    console.log('Connection failed');
  });
