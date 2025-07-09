const User = require('../models/User');
const AppError = require('../utils/appError');
const catchAsync = require('../middleware/errorHandler').catchAsync;
const twilio = require('twilio');

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
    // Generate OTP
    const otp = generateOTP();
    console.log(`Generated OTP for ${mobile}:`, otp);
    
    // Send OTP via SMS
    await sendOTPviaSMS(mobile, otp);

    // In a real app, you would save this OTP to the database with an expiry time
    // For example: await saveOTPToDatabase(mobile, otp);

    res.status(200).json({
      status: 'success',
      message: 'OTP sent successfully',
      data: {
        mobile,
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
exports.verifyOTP = catchAsync(async (req, res, next) => {
  const { mobile, otp } = req.body;

  if (!mobile || !otp) {
    return next(new AppError('Mobile number and OTP are required', 400));
  }

  const user = await User.findOne({ mobile });
  
  if (!user) {
    return next(new AppError('User not found', 404));
  }

  // Verify OTP
  const isOTPValid = user.verifyOTP(otp);
  
  if (!isOTPValid) {
    return next(new AppError('Invalid or expired OTP', 400));
  }

  // Mark user as verified and clear OTP
  user.isVerified = true;
  user.otp = undefined;
  await user.save({ validateBeforeSave: false });

  // In a real app, you would generate a JWT token here
  // const token = generateToken(user._id);

  res.status(200).json({
    status: 'success',
    message: 'OTP verified successfully',
    data: {
      mobile,
      isVerified: true,
      // token
    }
  });
});
