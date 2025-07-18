const path = require('path');
const fs = require('fs');
const User = require('../models/User');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

// Create a new user
const createUser = catchAsync(async (req, res, next) => {
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
const getAllUsers = catchAsync(async (req, res, next) => {
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
const getUser = catchAsync(async (req, res, next) => {
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
const updateUser = catchAsync(async (req, res, next) => {
  console.log('Request body:', req.body);
  console.log('Uploaded file:', req.file);

  // Create filteredBody with only allowed fields
  const filteredBody = {};
  const allowedFields = ['firstName', 'lastName', 'email', 'photo', 'mobile', 'DOB', 'gender', 'isVerified'];

  // Add fields from req.body to filteredBody
  Object.keys(req.body).forEach(key => {
    if (allowedFields.includes(key)) {
      filteredBody[key] = req.body[key];
    }
  });

  // If a file was uploaded, update the photo field with the processed filename
  if (req.file && req.body.photo) {
    filteredBody.photo = req.body.photo; // This is set by resizeUserPhoto middleware
  }

  console.log('Filtered body:', filteredBody);

  // Update user document
  let updatedUser;
  try {
    updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      filteredBody,
      {
        new: true,
        runValidators: true,
        select: '-__v -password -otp -otpExpires'
      }
    );

    if (!updatedUser) {
      return next(new AppError('No user found with that ID', 404));
    }

    console.log('Updated user:', updatedUser);
  } catch (error) {
    console.error('Database update error:', error);
    return next(new AppError('Error updating user', 500));
  }

  // If there was a previous photo and it's not the default, delete it
  if (updatedUser.photo && updatedUser.photo !== 'default.jpg' && req.file) {
    try {
      const photoPath = path.join(__dirname, '../public/img/users', updatedUser.photo);
      if (fs.existsSync(photoPath)) {
        await fs.promises.unlink(photoPath);
        console.log('Old photo deleted:', updatedUser.photo);
      }
    } catch (error) {
      console.error('Error deleting old photo:', error);
      // Don't fail the request if we can't delete the old photo
    }
  }

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser
    }
  });
});

// Delete user
const deleteUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id);
  
  if (!user) {
    return next(new AppError('No user found with that ID', 404));
  }
  
  res.status(204).json({
    status: 'success',
    data: null
  });
});

// Get all admin users
const getAdminUsers = catchAsync(async (req, res, next) => {
  const adminUsers = await User.find({ role: 'admin' });
  res.status(200).json({
    status: 'success',
    results: adminUsers.length,
    data: {
      users: adminUsers
    }
  });
});

// Get user verification status
const getUserVerificationStatus = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id).select('isVerified');
  console.log('User ID from params:', req.params.id);
  console.log('Found user:', user);
  
  if (!user) {
    return next(new AppError('No user found with that ID', 404));
  }
  
  res.status(200).json({
    status: 'success',
    data: {
      isVerified: user.isVerified
    }
  });
});

// Export all functions at the end
module.exports = {
  createUser,
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
  getAdminUsers,
  getUserVerificationStatus
};