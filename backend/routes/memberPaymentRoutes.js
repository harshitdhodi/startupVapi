const express = require('express');
const memberPaymentController = require('../controllers/memberPaymentController');

const router = express.Router();

// Admin routes
router
  .route('/')
  .get(memberPaymentController.getAllMemberPayments)
  .post(memberPaymentController.createMemberPayment);

router
  .route('/:id')
  .get(memberPaymentController.getMemberPayment)
  .patch(memberPaymentController.updateMemberPayment);

// Public routes (but protected by authentication)
router.get('/user/:userId', memberPaymentController.getUserActiveMemberPayments);
router.get('/check-membership/:userId', memberPaymentController.checkMembershipStatus);

module.exports = router;
