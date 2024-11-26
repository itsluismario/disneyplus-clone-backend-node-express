// src/services/movie.service.js
const { TMDBService } = require('./tmdb.service');

class MovieService {
  constructor() {
    this.tmdbService = new TMDBService();
    this.getAllMovies = this.getAllMovies.bind(this);
    this.searchMovies = this.searchMovies.bind(this);
    this.getMovieById = this.getMovieById.bind(this);
  }

  async getAllMovies() {
    return await this.tmdbService.getAllMovies();
  }

  async searchMovies(query, page = 1) {
    return await this.tmdbService.searchMovies(query, page);
  }

  async getMovieById(id) {
    return await this.tmdbService.getMovieById(id);
  }
}

module.exports = { MovieService };
