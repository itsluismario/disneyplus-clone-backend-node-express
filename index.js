const express = require("express");
require("dotenv").config();
const app = express();
const { Movie, User } = require("./models");
const mongoose = require("mongoose");

const uri = process.env.MONGODB_URI;

app.use(express.json());

app.post("/api/v1/user", async (req, res) => {
  try {
    console.log(req.body);
    const user = await User.create({
      clerkId: "clerk_test123",
      email: "test@example.com",
    });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add test route to verify connection
app.get("/api/health", (req, res) => {
  res.json({
    server: "up",
    database:
      mongoose.connection.readyState === 1 ? "connected" : "disconnected",
    timestamp: new Date(),
  });
});

mongoose.connect(uri).then(() => {
  console.log("Connected!");
  app.listen(3000, () => {
    console.log("Server running on port 3000");
  });

}).catch ( () => {
    console.log('Connection failed');
  });



