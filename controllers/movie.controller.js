// controllers/movie.controller.js
const { Movie } = require('../models');

const createMovie = async (req, res) => {
  try {
    const {
      tmdbId,
      title,
      overview,
      posterPath,
      backdropPath,
      releaseDate,
      voteAverage,
      genres
    } = req.body;

    // Check if movie already exists
    const existingMovie = await Movie.findOne({ tmdbId });

    if (existingMovie) {
      return res.status(400).json({
        success: false,
        message: 'Movie already exists in database'
      });
    }

    // Create new movie
    const movie = await Movie.create({
      tmdbId,
      title,
      overview,
      posterPath,
      backdropPath,
      releaseDate: new Date(releaseDate),
      voteAverage,
      genres,
      lastUpdated: new Date()
    });

    res.status(201).json({
      success: true,
      data: movie,
      message: 'Movie added to database successfully'
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating movie entry',
      error: error.message
    });
  }
};

module.exports = {
  createMovie
};
