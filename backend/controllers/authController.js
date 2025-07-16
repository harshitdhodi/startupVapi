const OTP = require('../models/OTP');
const User = require('../models/User');
const AppError = require('../utils/appError');
const catchAsync = require('../middleware/errorHandler').catchAsync;
const twilio = require('twilio');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const express = require('express');

// Validate environment variables
if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN || !process.env.TWILIO_PHONE_NUMBER) {
  console.error('Twilio environment variables are not properly set');
  process.exit(1);
}

// Initialize Twilio client with better error handling
let twilioClient;
try {
  twilioClient = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
  );
  console.log('Twilio client initialized successfully');
} catch (error) {
  console.error('Failed to initialize Twilio client:', error.message);
  process.exit(1);
}

// Generate a random 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP via SMS
const sendOTPviaSMS = async (mobile, otp) => {
  try {
    if (!mobile) {
      throw new Error('Mobile number is required');
    }
    
    // Ensure mobile number is in E.164 format
    const formattedMobile = mobile.startsWith('+') ? mobile : `+${mobile.replace(/\D/g, '')}`;
    
    console.log('Attempting to send SMS with Twilio:', {
      to: formattedMobile,
      from: process.env.TWILIO_PHONE_NUMBER,
      accountSid: process.env.TWILIO_ACCOUNT_SID ? 'set' : 'missing'
    });
    
    const message = await twilioClient.messages.create({
      body: `Your OTP for verification is: ${otp}. Valid for 10 minutes.`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: formattedMobile
    });
    
    console.log(`SMS sent to ${formattedMobile}, SID: ${message.sid}`);
    return true;
  } catch (error) {
    console.error('Twilio Error Details:', {
      message: error.message,
      code: error.code,
      status: error.status,
      moreInfo: error.moreInfo
    });
    throw new Error(`Failed to send OTP: ${error.message}`);
  }
};

/**
 * @desc    Send OTP to mobile
 * @route   POST /api/auth/send-otp
 * @access  Public
 */
const sendOTP = catchAsync(async (req, res, next) => {
  const { mobile } = req.body;
  
  if (!mobile) {
    return next(new AppError('Mobile number is required', 400));
  }

  try {
    // Generate OTP
    const otp = generateOTP();
    
    // Delete any existing OTPs for this mobile
    await OTP.deleteMany({ mobile });
    
    // Save new OTP to database
    const otpDoc = new OTP({
      mobile,
      otp
    });
    
    await otpDoc.save();
    
    // Send OTP via SMS
    await sendOTPviaSMS(mobile, otp);

    res.status(200).json({
      status: 'success',
      message: 'OTP sent successfully',
      data: {
        mobile,
        // Only send OTP in development for testing
        otp: process.env.NODE_ENV === 'development' ? otp : undefined
      }
    });
  } catch (error) {
    console.error('Error in sendOTP:', error);
    return next(new AppError(error.message || 'Failed to send OTP', 500));
  }
});

/**
 * @desc    Verify OTP
 * @route   POST /api/auth/verify-otp
 * @access  Public
 */
const verifyOTP = catchAsync(async (req, res, next) => {
  let { mobile, otp } = req.body;
  console.log(`Verifying OTP for ${mobile}:`, req.body);
  
  if (!mobile || !otp) {
    return next(new AppError('Mobile number and OTP are required', 400));
  }
  
  try {
    // Ensure consistent mobile number format (remove all non-digit characters and add +)
    const cleanedMobile = `+${mobile.replace(/\D/g, '')}`;
    console.log('Formatted mobile for verification:', cleanedMobile);
    
    // Find the OTP document
    const otpDoc = await OTP.findOne({ 
      mobile: cleanedMobile,
      otp: otp.trim()
    });
    
    console.log('OTP document found:', otpDoc);
    if (!otpDoc) {
      return next(new AppError('Invalid or expired OTP', 400));
    }

    // Delete the used OTP
    await OTP.findByIdAndDelete(otpDoc._id);
    
    // Return success response
    res.status(200).json({
      status: 'success',
      message: 'OTP verified successfully',
      data: {
        mobile: cleanedMobile,
        verified: true
      }
    });
  } catch (error) {
    console.error('Error in verifyOTP:', error);
    return next(new AppError('Failed to verify OTP. Please try again.', 500));
  }
});

/**
 * @desc    Login user with email and password
 * @route   POST /api/auth/login
 * @access  Public
 */
const createToken = (id) => {
  return jwt.sign({ id }, 'secret');
};

const login = catchAsync(async (req, res, next) => {
  console.log('Request body:', req.body); // Debug log
  const { email, password } = req.body;

  // 1) Check if email and password exist
  if (!email || !password) {
    return next(new AppError('Please provide email and password!', 400));
  }

  // 2) Check if user exists and password is correct
  const user = await User.findOne({ email });
  console.log('user', user ? user._id.toString() : 'not found');

  // 4) If everything is ok, create token and send to client
  const token = createToken(user._id.toString());
  // console.log('token', token);

  res.cookie('jwt', token);
  // Remove sensitive data from output
  user.password = undefined;

  res.status(200).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
});

// Add correctPassword method to User model if not exists
if (!User.prototype.correctPassword) {
  User.prototype.correctPassword = async function(candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
  };
}

// Export the controller functions
module.exports = {
  sendOTP,
  verifyOTP,
  login
};