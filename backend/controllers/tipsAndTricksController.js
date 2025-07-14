const path = require('path');
const fs = require('fs');
const TipsAndTricks = require('../models/TipsAndTricks');
const asyncHandler = require('express-async-handler');
const { uploadUserPhoto, resizeUserPhoto } = require('../middleware/uploadPhoto');
const AppError = require('../utils/appError');

// @desc    Create new tips and tricks with banner
// @route   POST /api/tips-and-tricks
// @access  Private/Admin
exports.createTipsAndTricks = [
  // Handle file upload
  (req, res, next) => {
    uploadUserPhoto(req, res, function(err) {
      if (err) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return next(new AppError('File size is too large. Maximum size is 5MB', 400));
        }
        return next(err);
      }
      next();
    });
  },
  
  // Resize photo
  resizeUserPhoto,
  
  // Handle tip creation
  asyncHandler(async (req, res, next) => {
    console.log('Request body:', req.body);
    console.log('Uploaded file:', req.file);
    
    const { title, shortDescription, longDescription, youtubeLink } = req.body;
    
    if (!req.file) {
      return next(new AppError('Please upload a valid banner image', 400));
    }
    
    if (!title || !shortDescription || !longDescription) {
      return next(new AppError('Please provide all required fields: title, shortDescription, longDescription', 400));
    }

    try {
      const newTip = await TipsAndTricks.create({
        banner: req.file.filename, // This should be the relative path from public directory
        title,
        shortDescription,
        longDescription,
        youtubeLink: youtubeLink || undefined
      });
      
      // Update the banner URL to be accessible from the client
      newTip.banner = `${newTip.banner}`;
      
      res.status(201).json({
        status: 'success',
        data: {
          tip: newTip
        }
      });
    } catch (error) {
      console.error('Error creating tip:', error);
      
      // Clean up the uploaded file if tip creation fails
      if (req.file && req.file.filename) {
        const filePath = path.join(__dirname, '../public', req.file.filename);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
      
      next(error);
    }
  })
];

// @desc    Get all tips and tricks
// @route   GET /api/tips-and-tricks
// @access  Public
exports.getAllTipsAndTricks = asyncHandler(async (req, res, next) => {
  // Create query
  let query = TipsAndTricks.find({ isActive: true });
  
  // 1) Filtering
  const queryObj = { ...req.query };
  const excludedFields = ['page', 'sort', 'limit', 'fields'];
  excludedFields.forEach(el => delete queryObj[el]);
  
  // 1B) Advanced filtering
  let queryStr = JSON.stringify(queryObj);
  queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
  query = query.find(JSON.parse(queryStr));
  
  // 2) Sorting
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy);
  } else {
    query = query.sort('-createdAt');
  }

  // 3) Field limiting
  if (req.query.fields) {
    const fields = req.query.fields.split(',').join(' ');
    query = query.select(fields);
  } else {
    query = query.select('-__v');
  }

  // 4) Pagination
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 10;
  const skip = (page - 1) * limit;
  
  // Execute query
  const tips = await query.skip(skip).limit(limit);
  
  // Get total count for pagination
  const total = await TipsAndTricks.countDocuments({ ...JSON.parse(queryStr), isActive: true });
  
  res.status(200).json({
    status: 'success',
    results: tips.length,
    total,
    totalPages: Math.ceil(total / limit),
    currentPage: page,
    data: {
      tips
    }
  });
});

// @desc    Get single tip or trick
// @route   GET /api/tips-and-tricks/:id
// @access  Public
exports.getTipsAndTricks = asyncHandler(async (req, res, next) => {
  const tip = await TipsAndTricks.findByIdAndUpdate(
    req.params.id,
    { $inc: { viewers: 1 } },
    { new: true, runValidators: true }
  );

  if (!tip || !tip.isActive) {
    return next(new AppError('No tip or trick found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      tip
    }
  });
});

// @desc    Update tip or trick
// @route   PATCH /api/tips-and-tricks/:id
// @access  Private/Admin
exports.updateTipsAndTricks = [
  uploadUserPhoto,
  resizeUserPhoto,
  asyncHandler(async (req, res, next) => {
    const updateData = { ...req.body };
    
    if (req.file && req.file.filename) {
      updateData.banner = req.file.filename;
    }
    
    const tip = await TipsAndTricks.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
        runValidators: true
      }
    );

    if (!tip) {
      return next(new AppError('No tip or trick found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        tip
      }
    });
  })
];

// @desc    Delete tip or trick (soft delete)
// @route   DELETE /api/tips-and-tricks/:id
// @access  Private/Admin
exports.deleteTipsAndTricks = asyncHandler(async (req, res, next) => {
  const tip = await TipsAndTricks.findByIdAndUpdate(
    req.params.id,
    { isActive: false },
    { new: true }
  );

  if (!tip) {
    return next(new AppError('No tip or trick found with that ID', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null
  });
});

// @desc    Like a tip or trick
// @route   POST /api/tips-and-tricks/:id/like
// @access  Private
exports.likeTipsAndTricks = asyncHandler(async (req, res, next) => {
  const tip = await TipsAndTricks.findByIdAndUpdate(
    req.params.id,
    { $inc: { likes: 1 } },
    { new: true, runValidators: true }
  );

  if (!tip || !tip.isActive) {
    return next(new AppError('No tip or trick found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      tip
    }
  });
});
