const User = require('../models/User');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

// Create a new user
exports.createUser = catchAsync(async (req, res, next) => {
  try {
    console.log('Request body:', req.body);

    // Calculate age from DOB
    const dob = new Date(req.body.DOB);
    if (isNaN(dob)) {
      return next(new AppError('Invalid date of birth provided', 400));
    }

    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    const dayDiff = today.getDate() - dob.getDate();

    // Adjust age if birthday hasn't occurred this year
    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
      age--;
    }

    // Assign role based on age
    req.body.role = age < 20 ? 'student' : 'jury';

    const newUser = await User.create(req.body);
    console.log('User created successfully:', newUser);

    // Remove sensitive data from output
    newUser.password = undefined;

    res.status(201).json({
      status: 'success',
      data: {
        user: newUser,
      },
    });
  } catch (error) {
    console.error('Error creating user:', error);

    // If there was an error and a photo was uploaded, clean it up
    if (req.body.photo) {
      const photoPath = path.join(__dirname, `../public/img/users/${req.body.photo}`);
      if (fs.existsSync(photoPath)) {
        await fs.promises.unlink(photoPath).catch(console.error);
      }
    }

    // Handle validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return next(new AppError(`Validation Error: ${errors.join('. ')}`, 400));
    }

    // Handle duplicate key errors
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      const value = error.keyValue[field];
      return next(new AppError(`Duplicate ${field}: ${value}. Please use another value.`, 400));
    }

    return next(new AppError('Error creating user', 500));
  }
});

// Get all users
exports.getAllUsers = catchAsync(async (req, res, next) => {
  console.log('Request body:');
  const users = await User.find();
  res.status(200).json({
    status: 'success',
    results: users.length,
    data: {
      users
    }
  });
});

// Get single user
exports.getUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  
  if (!user) {
    return next(new AppError('No user found with that ID', 404));
  }
  
  res.status(200).json({
    status: 'success',
    data: {
      user
    }
  });
});

// Update user
exports.updateUser = catchAsync(async (req, res, next) => {
  try {
    // 1) Filter out unwanted field names that are not allowed to be updated
    const filteredBody = { ...req.body };
    const excludedFields = ['password', 'otp', 'isVerified'];
    excludedFields.forEach(el => delete filteredBody[el]);

    // 2) Update user document
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      filteredBody,
      {
        new: true,
        runValidators: true
      }
    );

    if (!updatedUser) {
      return next(new AppError('No user found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        user: updatedUser
      }
    });
  } catch (error) {
    console.error('Error updating user:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return next(new AppError(`Validation Error: ${errors.join('. ')}`, 400));
    }
    
    // Handle duplicate key errors
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      const value = error.keyValue[field];
      return next(new AppError(`Duplicate ${field}: ${value}. Please use another value.`, 400));
    }
    
    return next(new AppError('Error updating user', 500));
  }
});

// Delete user
exports.deleteUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id);
  
  if (!user) {
    return next(new AppError('No user found with that ID', 404));
  }
  
  res.status(204).json({
    status: 'success',
    data: null
  });
});

exports.getUserVerificationStatus = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id).select('isVerified');
  console.log('User ID from params:', req.params.id);
  console.log('Found user:', user);
  
  if (!user) {
    return next(new AppError('No user found with that ID', 404));
  }
  
  res.status(201).json({
    status: 'success',
    data: {
      isVerified: user.isVerified
    }
  });
});