// src/controllers/movie.controller.js
const { MovieService } = require('../services/movie.service.js');

class MovieController {
  constructor() {
    this.movieService = new MovieService();

    // Bind all methods
    this.getAllMovies = this.getAllMovies.bind(this);
    this.searchMovies = this.searchMovies.bind(this);
    this.getMovieById = this.getMovieById.bind(this);
  }

  async getAllMovies(req, res) {
    try {
      const pages = parseInt(req.query.pages) || 3;
      const movies = await this.movieService.getAllMovies(pages);

      res.json({
        success: true,
        data: movies
      });
    } catch (error) {
      console.error('Fetch error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch movies'
      });
    }
  }

  async searchMovies(req, res) {
    try {
      const query = req.query.q;
      const page = parseInt(req.query.page) || 1;

      if (!query) {
        return res.status(400).json({
          success: false,
          message: 'Search query is required'
        });
      }

      const results = await this.movieService.searchMovies(query, page);
      res.json({
        success: true,
        data: results
      });
    } catch (error) {
      console.error('Search error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to search movies'
      });
    }
  }

  async getMovieById(req, res) {
    try {
      const movieId = req.params.id;
      const movie = await this.movieService.getMovieById(movieId);

      if (!movie) {
        return res.status(404).json({
          success: false,
          message: 'Movie not found'
        });
      }

      res.json({
        success: true,
        data: movie
      });
    } catch (error) {
      console.error('Movie detail error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch movie details'
      });
    }
  }
}

module.exports = { MovieController };
