// routes/index.js
const express = require('express');
const movieRouter = require('./movie.route');
const authRouter = require('./auth.route');
const favoritesRoutes = require('./favorites.route');
const { requireAuth } = require('@clerk/express');
const checkAuthMiddleware = require('../middleware/check-auth.middleware');

const routerApi = (app) => {
  const router = express.Router();

  // Global prefix
  app.use('/api/v1', router);

  // Public routes
  router.use('/auth', authRouter);

  // Protected routes - require authentication
  router.use('/movies', checkAuthMiddleware, movieRouter);
  router.use('/favorites', checkAuthMiddleware, favoritesRoutes);


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
