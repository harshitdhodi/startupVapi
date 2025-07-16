const express = require('express');
const router = express.Router();
const { downloadImage } = require('../controllers/imageController');

// @route   GET /api/image/download/:filename
// @desc    Download an image by filename
// @access  Public
router.get('/download/:filename', downloadImage);

module.exports = router;
