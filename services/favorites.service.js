// services/favorites.service.js
const Favorite = require('../models/favorite.model');
const Movie = require('../models/movie.model');

class FavoritesService {
// services/favorites.service.js
async addFavorite(userId, movieData) {
  try {

    const movieDataFormatted = {
      id: movieData.id,        // Add this
      movieId: movieData.id,   // Keep this
      title: movieData.title,
      overview: movieData.overview,
      posterUrl: movieData.posterUrl,
      backdropUrl: movieData.backdropUrl,
      releaseDate: movieData.releaseDate,
      rating: movieData.rating,
      popularity: movieData.popularity,
      genres: movieData.genres,
      runtime: movieData.runtime,
      tagline: movieData.tagline
    };

    let movie = await Movie.findOne({ id: movieDataFormatted.id });

    if (!movie) {
      movie = new Movie(movieDataFormatted);
      await movie.save();
    }

    const favorite = new Favorite({
      userId: userId,
      movieId: movieDataFormatted.id  // Use id consistently
    });

    await favorite.save();
    return { success: true, message: 'Movie added to favorites' };
  } catch (error) {
    if (error.code === 11000) {
      return { success: false, message: 'Movie already in favorites' };
    }
    throw error;
  }
}

  async removeFavorite(userId, movieId) {
    try {
      const result = await Favorite.deleteOne({
        userId: userId,
        movieId: movieId
      });

      if (result.deletedCount === 0) {
        return { success: false, message: 'Movie not found in favorites' };
      }

      return { success: true, message: 'Movie removed from favorites' };
    } catch (error) {
      throw error;
    }
  }

  async getFavorites(userId, page = 1, limit = 10) {
    try {
      const skip = (page - 1) * limit;

      const favorites = await Favorite.find({ userId })
        .sort({ addedAt: -1 })
        .skip(skip)
        .limit(limit);

      const movieIds = favorites.map(fav => fav.movieId);
      const movies = await Movie.find({ movieId: { $in: movieIds } });

      const total = await Favorite.countDocuments({ userId });

      return {
        success: true,
        data: {
          results: movies,
          page,
          totalPages: Math.ceil(total / limit),
          totalResults: total
        }
      };
    } catch (error) {
      throw error;
    }
  }

  async isFavorite(userId, movieId) {
    try {
      const favorite = await Favorite.findOne({
        userId: userId,
        movieId: movieId
      });

      return {
        success: true,
        isFavorite: !!favorite
      };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new FavoritesService();
