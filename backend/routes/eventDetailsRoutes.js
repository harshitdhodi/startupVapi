const express = require('express');
const router = express.Router();
const {
  uploadEventBanner,
  createEventDetails,
  getAllEventDetails,
  getEventDetails,
  updateEventDetails,
  deleteEventDetails,
  updateEventBanner,
  getEventDetailsByFilter
} = require('../controllers/eventDetailsController');
const { protect, admin } = require('../middleware/authMiddleware');

// Public routes
router.route('/')
  .get(getAllEventDetails)
  .post(createEventDetails);  // Allow public creation
router.get('/filterEvent', getEventDetailsByFilter);

router.route('/:id')
  .get(getEventDetails);

// Banner upload route (public for now)
router.post('/upload-banner', uploadEventBanner);
// Update routes (public for now)
router.route('/:id')
  .patch(updateEventDetails)
  .delete(deleteEventDetails);

// Update banner for specific event (public for now)
router.patch('/:id/banner', updateEventBanner);

module.exports = router;
