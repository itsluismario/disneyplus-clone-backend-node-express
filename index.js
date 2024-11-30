// index.js
const express = require("express");
require("dotenv").config();
const app = express();
const mongoose = require("mongoose");
const routerApi = require("./routes/index");

const uri = process.env.MONGODB_URI;

// Middleware
app.use(express.json());

app.use((req, res, next) => {
  // Comentarios explicativos
  res.setHeader(
      'Access-Control-Allow-Origin',
      'http://localhost:4200'
  );
  res.setHeader(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.setHeader(
      'Access-Control-Allow-Methods',
      'GET, POST, PATCH, PUT, DELETE, OPTIONS'
  );
  next();
});


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
