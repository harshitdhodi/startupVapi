const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/review');

// Create a review
router.post('/', reviewController.createReview);

// Get all reviews for an event
router.get('/event/:eventId', reviewController.getEventReviews);

// Get all reviews by user ID
router.get('/user', reviewController.getUserReviews);

// Get single review
router.get('/:id', reviewController.getReview);

// Update a review
router.put('/:id', reviewController.updateReview);

// Delete a review
router.delete('/:id', reviewController.deleteReview);

module.exports = router;