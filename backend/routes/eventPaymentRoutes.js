const express = require('express');
const router = express.Router();
const {
    createPayment,
    getPayment,
    getUserPayments,
    updatePaymentStatus
} = require('../controllers/eventPaymentController');

// Create a new payment
router.post('/', createPayment);

// Get a specific payment by ID
router.get('/:id', getPayment);

// Get all payments for a user
router.get('/user/:userId', getUserPayments);

// Update payment status
router.put('/:id/status', updatePaymentStatus);

module.exports = router;
