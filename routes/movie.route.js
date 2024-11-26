// src/routes/movie.route.js
const express = require('express');
const { MovieController } = require('../controllers/movie.controller');

const router = express.Router();
const movieController = new MovieController();

// Define routes
router.get('/', movieController.getAllMovies);
router.get('/search', movieController.searchMovies);
router.get('/:id', movieController.getMovieById);

module.exports = router;
