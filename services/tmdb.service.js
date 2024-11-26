// src/services/tmdb.service.js
class TMDBService {
  constructor() {
    this.baseUrl = 'https://api.themoviedb.org/3';
    this.headers = {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkZWY4OTA5ODEzNjgwYjY5ODExZWQxOWViM2IzNjRhZCIsIm5iZiI6MTcyOTcxMTA5MS41MjM5MzEsInN1YiI6IjY3MTk0YjcwNWJlOWU4NzU5ZGE2YzBjZiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.kWXmZTfyPxuXjnwULylN6VUYz9z2CKp1pYJ7WnT5ovo'
    };

    // Bind methods to ensure correct 'this' context
    this.searchMovies = this.searchMovies.bind(this);
    this.getAllMovies = this.getAllMovies.bind(this);
    this.formatSearchResults = this.formatSearchResults.bind(this);
    this.formatMoviesList = this.formatMoviesList.bind(this);
  }

  // Search movies by name
  async searchMovies(query, page = 1) {
    try {
      const response = await fetch(
        `${this.baseUrl}/search/movie?query=${encodeURIComponent(query)}&include_adult=false&language=en-US&page=${page}`,
        {
          method: 'GET',
          headers: this.headers
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.status_message || 'Failed to fetch search results');
      }

      const data = await response.json();
      return this.formatSearchResults(data);
    } catch (error) {
      console.error('Search error:', error);
      throw new Error('Failed to search movies');
    }
  }

  // Get all popular movies (multiple pages)
  async getAllMovies(totalPages = 3) {
    try {
      const allMovies = [];

      // Fetch multiple pages in parallel
      const promises = Array.from({ length: totalPages }, (_, i) =>
        fetch(`${this.baseUrl}/movie/popular?language=en-US&page=${i + 1}`, {
          method: 'GET',
          headers: this.headers
        })
      );

      const responses = await Promise.all(promises);
      const results = await Promise.all(
        responses.map(async response => {
          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.status_message || 'Failed to fetch movies');
          }
          return response.json();
        })
      );

      results.forEach(data => {
        allMovies.push(...data.results);
      });

      return this.formatMoviesList(allMovies);
    } catch (error) {
      console.error('Error fetching all movies:', error);
      throw new Error('Failed to fetch movies');
    }
  }

  // Get movie by ID
  async getMovieById(movieId) {
    try {
      const response = await fetch(
        `${this.baseUrl}/movie/${movieId}?language=en-US`,
        {
          method: 'GET',
          headers: this.headers
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.status_message || 'Failed to fetch movie details');
      }

      const movie = await response.json();
      return this.formatMovie(movie);
    } catch (error) {
      console.error('Error fetching movie:', error);
      throw new Error('Failed to fetch movie details');
    }
  }

  // Format search results
  formatSearchResults(data) {
    return {
      page: data.page,
      totalPages: data.total_pages,
      totalResults: data.total_results,
      results: data.results.map(this.formatMovie)
    };
  }

  // Format movies list
  formatMoviesList(movies) {
    return movies.map(this.formatMovie);
  }

  // Format single movie
  formatMovie(movie) {
    return {
      id: movie.id,
      title: movie.title,
      overview: movie.overview,
      posterUrl: movie.poster_path
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : null,
      backdropUrl: movie.backdrop_path
        ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
        : null,
      releaseDate: movie.release_date,
      rating: movie.vote_average,
      popularity: movie.popularity,
      genres: movie.genres || [],
      runtime: movie.runtime || null,
      tagline: movie.tagline || null
    };
  }
}

module.exports = { TMDBService };
