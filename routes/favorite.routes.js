// routes/favorite.routes.js
const express = require('express');
const router = express.Router();
const favoriteController = require('../controllers/favorite.controller');

// Add a movie to favorites
router.post('/add', favoriteController.addFavorite);

// Remove a movie from favorites
router.delete('/remove/:movieId', favoriteController.removeFavorite);

// Get all favorite movies for a user
router.get('/list', favoriteController.getFavorites);

// Check if a movie is in favorites
router.get('/check/:movieId', favoriteController.checkFavorite);

module.exports = router;
