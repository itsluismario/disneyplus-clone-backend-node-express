const express = require('express');
const router = express.Router();
const { createMovie } = require('../controllers/movie.controller');

router.post('/create', createMovie);

module.exports = router;
