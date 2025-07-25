const express = require('express');
const router = express.Router();
const { 
  getEvents, 
  getEvent, 
  createEvent,
  updateEvent,
  deleteEvent
} = require('../controllers/eventController');
const { uploadBanner, resizeUserPhoto } = require('../middleware/uploadBanner');

// Public routes
router.route('/')
  .get(getEvents)
  .post(
    uploadBanner,
    resizeUserPhoto,
    createEvent
  );

router.route('/:id')
  .get(getEvent)
  .put(updateEvent)
  .delete(deleteEvent);

module.exports = router;