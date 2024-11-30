// src/controllers/movie.controller.js
const { TMDBService } = require('../services/tmdb.service.js');

class MovieController {
  constructor() {
    this.tmbdService = new TMDBService();

    // Bind all methods
    this.getAllMovies = this.getAllMovies.bind(this);
    this.searchMovies = this.searchMovies.bind(this);
    this.getMovieById = this.getMovieById.bind(this);
  }

  async getAllMovies(req, res) {
    try {
      const page = parseInt(req.query.page);
      const movies = await this.tmbdService.getAllMovies(page);

      res.json({
        success: true,
        data: {
          results: movies.results,
          page: movies.page,
          totalPages: movies.totalPages,
          totalResults: movies.totalResults,
          hasMore: movies.page < movies.totalPages
        }
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
      const pageSize = parseInt(req.query.pageSize) || 20;

      if (!query) {
        return res.status(400).json({
          success: false,
          message: 'Search query is required'
        });
      }

      const results = await this.tmbdService.searchMovies(query, page, pageSize);
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
      const movie = await this.tmbdService.getMovieById(movieId);

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
