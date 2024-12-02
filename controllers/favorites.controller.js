// controllers/favorites.controller.js
const FavoritesService = require('../services/favorites.service');

class FavoritesController {
  async addFavorite(req, res) {
    try {
      const userId = req.userData.userId;
      const movieData = req.body;

      const result = await FavoritesService.addFavorite(userId, movieData);

      if (!result.success) {
        return res.status(400).json(result);
      }

      res.status(201).json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to add favorite',
        error: error.message
      });
    }
  }

  async removeFavorite(req, res) {
    try {
      const userId = req.userData.userId;
      const { movieId } = req.params;

      const result = await FavoritesService.removeFavorite(userId, parseInt(movieId));

      if (!result.success) {
        return res.status(404).json(result);
      }

      res.json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to remove favorite',
        error: error.message
      });
    }
  }

  async getFavorites(req, res) {
    try {
      const userId = req.userData.userId;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;

      const result = await FavoritesService.getFavorites(userId, page, limit);
      res.json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to get favorites',
        error: error.message
      });
    }
  }

  async checkFavorite(req, res) {
    try {
      const userId = req.userData.userId;
      const { movieId } = req.params;

      const result = await FavoritesService.isFavorite(userId, parseInt(movieId));
      res.json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to check favorite status',
        error: error.message
      });
    }
  }
}

module.exports = new FavoritesController();
