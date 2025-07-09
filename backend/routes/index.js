const express = require('express');
const router = express.Router();

// Import controllers
const homeController = require('../controllers/homeController');

// Define routes
router.get('/', homeController.getHome);

module.exports = router;
