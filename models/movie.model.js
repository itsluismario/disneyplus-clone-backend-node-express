// models/movie.model.js
const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  movieId: {                    // Changed from tmdbId to movieId to match API
    type: Number,
    required: true,
    unique: true,
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  overview: {
    type: String,
    required: true
  },
  posterUrl: {                  // Changed from posterPath
    type: String,
  },
  backdropUrl: {                // Changed from backdropPath
    type: String,
  },
  releaseDate: {
    type: Date,
  },
  rating: {                     // Changed from voteAverage
    type: Number,
  },
  popularity: {                 // Added new field
    type: Number,
  },
  genres: [{
    type: String,
  }],
  runtime: {                    // Added new field
    type: Number,
  },
  tagline: {                    // Added new field
    type: String,
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

movieSchema.index({ movieId: 1 });
movieSchema.index({ title: 'text' });

const Movie = mongoose.model('Movie', movieSchema);

module.exports = Movie;
