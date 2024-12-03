// models/movie.model.js
const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  // We'll keep both id and movieId to ensure compatibility
  id: {
    type: Number,
    required: true,
  },
  movieId: {
    type: Number,
    required: true,
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
  posterUrl: {
    type: String,
  },
  backdropUrl: {
    type: String,
  },
  releaseDate: {
    type: String,
  },
  rating: {
    type: Number,
  },
  popularity: {
    type: Number,
  },
  genres: [{
    type: String,
  }],
  runtime: {
    type: Number,
  },
  tagline: {
    type: String,
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Add indexes for faster queries
movieSchema.index({ id: 1 }, { unique: true });
movieSchema.index({ movieId: 1 }, { unique: true });
movieSchema.index({ title: 'text' });

const Movie = mongoose.model('Movie', movieSchema);

module.exports = Movie;
