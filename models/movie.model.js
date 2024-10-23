// models/movie.model.js
const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  tmdbId: {
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
  posterPath: {
    type: String,
  },
  backdropPath: {
    type: String,
  },
  releaseDate: {
    type: Date,
  },
  voteAverage: {
    type: Number,
  },
  genres: [{
    type: String,
  }],
  // For caching purposes
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Add indexes for faster queries
movieSchema.index({ tmdbId: 1 });
movieSchema.index({ title: 'text' }); // Enables text search on titles

const Movie = mongoose.model('Movie', movieSchema);

module.exports = Movie;
