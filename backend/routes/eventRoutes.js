const express = require('express');
const router = express.Router();
const { 
  getEvents, 
  getEvent, 
  createEvent,
  updateEvent,
  deleteEvent
} = require('../controllers/eventController');
const { uploadUserPhoto, resizeUserPhoto } = require('../middleware/uploadPhoto');

// Public routes
router.route('/')
  .get(getEvents)
  .post(
    uploadUserPhoto,  // Handle single file upload with field name 'banner'
    resizeUserPhoto,  // Resize the uploaded image
    createEvent       // Handle the rest of the request
  );

router.route('/:id')
  .get(getEvent)
  .put(updateEvent)
  .delete(deleteEvent);

module.exports = router;