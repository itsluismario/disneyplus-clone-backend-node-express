// routes/auth.route.js
const express = require('express');
const { requireAuth } = require('@clerk/express');
const { AuthController } = require('../controllers/auth.controller');

const router = express.Router();
const authController = new AuthController();

// Public routes (no auth required)
router.post('/signup', authController.createUserFromClerk.bind(authController));
router.post('/login', authController.userLogin.bind(authController));

module.exports = router;
