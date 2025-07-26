const express = require('express');
const paymentController = require('../controllers/paymentController');

const router = express.Router();

// Routes for payments
router
  .route('/')
  .post(
    paymentController.createPayment
  )
  .get(
    paymentController.getAllPayments
  );

// Get payment statistics
router.get(
  '/stats',
  paymentController.getPaymentStats
);

// Get total revenue
router.get(
  '/revenue',
  paymentController.getTotalRevenue
);

// Routes for a specific payment
router
  .route('/:id')
  .get(
    paymentController.getPayment
  )
  .patch(
    paymentController.updatePayment
  )
  .delete(
    paymentController.deletePayment
  );

module.exports = router;
