const User = require('../models/User');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

// Create a new user
exports.createUser = catchAsync(async (req, res, next) => {
  try {
    console.log('Request body:', req.body);
    
    const newUser = await User.create(req.body);
    console.log('User created successfully:', newUser);
    
    // Remove sensitive data from output
    newUser.password = undefined;
    
    res.status(201).json({
      status: 'success',
      data: {
        user: newUser
      }
    });
  } catch (error) {
    console.error('Error creating user:', error);
    
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
  const users = await User.find().select('-password -otp -__v');
  
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
  const user = await User.findById(req.params.id).select('-password -otp -__v');
  
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
    ).select('-password -otp -__v');

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

// Dummy data seeder
exports.seedUsers = catchAsync(async (req, res, next) => {
  console.log('Seeding users...');
  
  try {
    // Delete all existing users
    await User.deleteMany();
    
    // Create dummy users with unique mobile numbers
    const dummyUsers = [
      {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: 'Test@123',
        mobile: {
          countryCode: '+1',
          number: '1234567890'
        },
        dateOfBirth: new Date('1990-01-15'),
        gender: 'male',
        city: 'New York',
        isVerified: true,
        registrationComplete: true
      },
      {
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@example.com',
        password: 'Test@123',
        mobile: {
          countryCode: '+44',
          number: '2345678901'
        },
        dateOfBirth: new Date('1992-05-20'),
        gender: 'female',
        city: 'London',
        isVerified: true,
        registrationComplete: true
      },
      {
        firstName: 'Alex',
        lastName: 'Johnson',
        email: 'alex.j@example.com',
        password: 'Test@123',
        mobile: {
          countryCode: '+91',
          number: '3456789012'
        },
        dateOfBirth: new Date('1988-11-30'),
        gender: 'other',
        city: 'Mumbai',
        isVerified: true,
        registrationComplete: true
      }
    ];
    
    // Insert dummy users
    const createdUsers = await User.create(dummyUsers);
    
    res.status(201).json({
      status: 'success',
      message: 'Dummy users created successfully',
      data: {
        count: createdUsers.length,
        users: createdUsers.map(user => ({
          id: user._id,
          name: user.fullName,
          email: user.email
        }))
      }
    });
  } catch (error) {
    console.error('Error seeding users:', error);
    return next(new AppError('Error seeding users', 500));
  }
});