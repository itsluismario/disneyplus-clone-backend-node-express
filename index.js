// backend/index.js
const express = require("express");
require("dotenv").config();
const app = express();
const mongoose = require("mongoose");
const routerApi = require("./routes/index");
const cors = require("cors");

const uri = process.env.MONGODB_URI;

// CORS configuration
const corsOptions = {
  origin: 'http://localhost:4200',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'],
  optionsSuccessStatus: 200 // Important for preflight requests
};

// Apply CORS before other middleware
app.use(cors(corsOptions));

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
