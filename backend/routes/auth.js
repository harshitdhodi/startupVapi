const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// @route   POST /api/auth/send-otp
// @desc    Send OTP to mobile number
// @access  Public
router.post('/send-otp', authController.sendOTP);

// @route   POST /api/auth/verify-otp
// @desc    Verify OTP
// @access  Public
router.post('/verify-otp', authController.verifyOTP);

// @route   POST /api/auth/login
// @desc    Login user with email and password
// @access  Public
router.post('/login', authController.login);

// @route   POST /api/auth/admin-login
// @desc    Login admin with email and password
// @access  Public
router.post('/admin-login', authController.adminLogin);

module.exports = router;