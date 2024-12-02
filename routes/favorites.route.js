// routes/favorites.routes.js
const express = require('express');
const favoritesController = require('../controllers/favorites.controller');
const checkAuth = require('../middleware/check-auth.middleware');

const router = express.Router();

// Apply checkAuth middleware to all routes
router.use(checkAuth);

// Define routes
router.post('/', favoritesController.addFavorite.bind(favoritesController));
router.delete('/:movieId', favoritesController.removeFavorite.bind(favoritesController));
router.get('/', favoritesController.getFavorites.bind(favoritesController));
router.get('/:movieId/check', favoritesController.checkFavorite.bind(favoritesController));

module.exports = router;
