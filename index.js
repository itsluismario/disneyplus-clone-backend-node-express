// index.js
const express = require("express");
require("dotenv").config();
const app = express();
const { Movie, User } = require("./models");
const mongoose = require("mongoose");

const uri = process.env.MONGODB_URI;

const userRoutes = require('./routes/user.routes');
const movieRoutes = require('./routes/movie.routes');
const favoriteRoutes = require('./routes/favorite.routes');

// Middleware
app.use(express.json());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/favorites', favoriteRoutes);

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

mongoose.connect(uri).then(() => {
  console.log("Connected!");
  app.listen(3000, () => {
    console.log("Server running on port 3000");
  });

}).catch ( () => {
    console.log('Connection failed');
  });
