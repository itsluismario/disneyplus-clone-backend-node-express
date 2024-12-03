// routes/index.js
const express = require('express');
const movieRouter = require('./movie.route');
const authRouter = require('./auth.route');
const favoritesRoutes = require('./favorites.route');

const routerApi = (app) => {
  const router = express.Router();

  // Global prefix
  app.use('/api/v1', router);

  // Routes
  router.use('/movies', movieRouter);
  router.use('/auth', authRouter);
  router.use('/favorites', favoritesRoutes);

  // Handle 404 for API routes
  router.use('*', (req, res) => {
    res.status(404).json({
      success: false,
      message: 'API route not found'
    });
  });

  // Error handler
  app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  });
};

module.exports = routerApi;
