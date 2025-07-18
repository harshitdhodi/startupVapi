const express = require('express');
const router = express.Router();
const {
  registerForStartupEvent,
  getEventRegistrations,
  getRegistration
} = require('../controllers/startupEventController');
const authController = require('../controllers/authController');
const { handleFileUpload } = require('../middleware/uploadVideo');

// Public routes - No authentication required for registration
router.post('/register', handleFileUpload, registerForStartupEvent);
// Admin routes
if (authController.restrictTo) {
  router.use(authController.restrictTo('admin'));
  router.get('/registrations/:eventId', getEventRegistrations);
  router.get('/registration/:id', getRegistration);
} else {
  console.warn('restrictTo middleware not found. Admin routes may not be properly protected.');
  // Fallback routes without admin restriction (not recommended for production)
  router.get('/registrations/:eventId', getEventRegistrations);
  router.get('/registration/:id', getRegistration);
}

module.exports = router;