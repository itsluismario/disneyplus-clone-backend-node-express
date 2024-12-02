// src/routes/auth.route.js
const express = require('express');
const { AuthController } = require('../controllers/auth.controller');

const router = express.Router();
const authController = new AuthController();

// Define routes
router.post('/signup', authController.createUser.bind(authController));
router.post('/login', authController.userLogin.bind(authController));

module.exports = router;
