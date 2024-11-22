// controllers/favorite.controller.js
const { Favorite, User, Movie } = require('../models');
const mongoose = require('mongoose');

const favoriteController = {
  // Add a movie to favorites
  async addFavorite(req, res) {
    try {
      const { userId, movieId } = req.body;

      // Check if movie already in favorites
      const existingFavorite = await Favorite.findOne({ userId, movieId });
      if (existingFavorite) {
        return res.status(400).json({
          success: false,
          message: 'Movie already in favorites'
        });
      }

      // Add to favorites
      const favorite = await Favorite.create({
        userId,
        movieId,
        addedAt: new Date()
      });

      res.status(201).json({
        success: true,
        message: 'Movie added to favorites',
        data: favorite
      });
    } catch (error) {
      console.error('Add favorite error:', error);
      res.status(500).json({
        success: false,
        message: 'Error adding movie to favorites',
        error: error.message
      });
    }
  },

  // Remove a movie from favorites
  async removeFavorite(req, res) {
    try {
      const { movieId } = req.params;
      const userId = req.user.id; // Assuming you have user info from auth middleware

      const result = await Favorite.findOneAndDelete({ userId, movieId });

      if (!result) {
        return res.status(404).json({
          success: false,
          message: 'Movie not found in favorites'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Movie removed from favorites'
      });
    } catch (error) {
      console.error('Remove favorite error:', error);
      res.status(500).json({
        success: false,
        message: 'Error removing movie from favorites',
        error: error.message
      });
    }
  },

  // Get all favorite movies
  async getFavorites(req, res) {
    try {
      const userId = req.user.id; // Assuming you have user info from auth middleware
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;

      const favorites = await Favorite.find({ userId })
        .populate('movieId', 'title overview posterPath releaseDate voteAverage')
        .sort('-addedAt')
        .skip((page - 1) * limit)
        .limit(limit);

      const total = await Favorite.countDocuments({ userId });

      res.status(200).json({
        success: true,
        data: favorites,
        pagination: {
          current: page,
          total: Math.ceil(total / limit),
          totalItems: total
        }
      });
    } catch (error) {
      console.error('Get favorites error:', error);
      res.status(500).json({
        success: false,
        message: 'Error retrieving favorite movies',
        error: error.message
      });
    }
  },

  // Check if a movie is in favorites
  async checkFavorite(req, res) {
    try {
      const { movieId } = req.params;
      const userId = req.user.id; // Assuming you have user info from auth middleware

      const favorite = await Favorite.findOne({ userId, movieId });

      res.status(200).json({
        success: true,
        isFavorite: !!favorite
      });
    } catch (error) {
      console.error('Check favorite error:', error);
      res.status(500).json({
        success: false,
        message: 'Error checking favorite status',
        error: error.message
      });
    }
  }
};

module.exports = favoriteController;
