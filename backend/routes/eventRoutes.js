const express = require('express');
const router = express.Router();
const { 
  getEvents, 
  getEvent, 
  createEvent,
  updateEvent,
  deleteEvent
} = require('../controllers/eventController');
const { uploadBanner } = require('../middleware/uploadBanner');

// Public routes
router.route('/')
  .get(getEvents)
  .post(
    uploadBanner,  // Handle single file upload with field name 'banner'
    createEvent       // Handle the rest of the request
  );

router.route('/:id')
  .get(getEvent)
  .put(updateEvent)
  .delete(deleteEvent);

module.exports = router;