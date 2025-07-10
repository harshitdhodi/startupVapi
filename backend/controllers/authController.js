const User = require('../models/User');
const OTP = require('../models/OTP');
const AppError = require('../utils/appError');
const catchAsync = require('../middleware/errorHandler').catchAsync;
const twilio = require('twilio');
const jwt = require('jsonwebtoken');
const promisify = require('util').promisify;

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

// Generate a 6-digit OTP
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
exports.sendOTP = catchAsync(async (req, res, next) => {
  const { mobile } = req.body;
  
  if (!mobile) {
    return next(new AppError('Mobile number is required', 400));
  }

  try {
    // Clean the mobile number
    const cleanedMobile = mobile.replace(/\D/g, '');
    console.log('Sending OTP for mobile:', cleanedMobile);
    
    // Generate OTP
    const otp = generateOTP();
    console.log('Generated OTP:', otp);
    
    // Delete any existing OTPs for this mobile
    const deleteResult = await OTP.deleteMany({ mobile: cleanedMobile });
    console.log('Deleted existing OTPs:', deleteResult);
    
    // Save new OTP to database
    const otpDoc = new OTP({ 
      mobile: cleanedMobile, 
      otp: otp.trim() 
    });
    
    // Manually validate before saving
    try {
      await otpDoc.validate();
      console.log('OTP document is valid');
    } catch (validationError) {
      console.error('OTP validation error:', validationError);
      throw validationError;
    }
    
    await otpDoc.save();
    console.log('OTP saved to database. Document:', {
      _id: otpDoc._id,
      mobile: otpDoc.mobile,
      otp: otpDoc.otp,
      createdAt: otpDoc.createdAt
    });
    
    // Verify the document was saved
    const savedOtp = await OTP.findById(otpDoc._id);
    console.log('Retrieved OTP from database:', savedOtp);
    
    // Send OTP via SMS
    await sendOTPviaSMS(cleanedMobile, otp);

    res.status(200).json({
      status: 'success',
      message: 'OTP sent successfully',
      data: {
        mobile: cleanedMobile,
        otp: process.env.NODE_ENV === 'development' ? otp : undefined
      }
    });
  } catch (error) {
    console.error('Error in sendOTP:', error);
    return next(new AppError('Failed to send OTP. Please try again.', 500));
  }
});

/**
 * @desc    Verify OTP
 * @route   POST /api/auth/verify-otp
 * @access  Public
 */
exports.verifyOTP = catchAsync(async (req, res, next) => {
  let { mobile, otp } = req.body;
  console.log(`Verifying OTP for ${mobile}:`, req.body);
  
  if (!mobile || !otp) {
    return next(new AppError('Mobile number and OTP are required', 400));
  }
  
  try {
    // Clean the mobile number to match the stored format
    const cleanedMobile = mobile.replace(/\D/g, '');
    console.log('Cleaned mobile for verification:', cleanedMobile);
    
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

// Protect routes - verify JWT token
const protect = catchAsync(async (req, res, next) => {
  // 1) Getting token and check if it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return next(
      new AppError('You are not logged in! Please log in to get access.', 401)
    );
  }

  // 2) Verify token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3) Check if user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError('The user belonging to this token no longer exists.', 401)
    );
  }

  // 4) Check if user changed password after the token was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError('User recently changed password! Please log in again.', 401)
    );
  }

  // GRANT ACCESS TO PROTECTED ROUTE
  req.user = currentUser;
  res.locals.user = currentUser;
  next();
});

// Restrict certain routes to specific roles
const restrictTo = (...roles) => {
  return (req, res, next) => {
    // roles ['admin', 'lead-guide']
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action', 403)
      );
    }
    next();
  };
};

// Add JWT related utility functions
const signToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  
  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user
    }
  });
};

// Export all the middleware and controller functions
module.exports = {
  sendOTP: exports.sendOTP,
  verifyOTP: exports.verifyOTP,
  protect,
  restrictTo,
  createSendToken
};
