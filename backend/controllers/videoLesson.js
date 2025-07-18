const path = require('path');
const fs = require('fs');
const VideoLesson = require('../models/videoLesson');
const asyncHandler = require('express-async-handler');
const { uploadBanner, resizeUserPhoto } = require('../middleware/uploadBanner');
const AppError = require('../utils/appError');

// @desc    Create new video lesson with banner
// @route   POST /api/video-lesson
// @access  Private/Admin
exports.createVideoLesson = [
  // Handle file upload
  (req, res, next) => {
    uploadBanner(req, res, function(err) {
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
      const newVideoLesson = await VideoLesson.create({
        banner: req.file.filename, // This should be the relative path from public directory
        title,
        shortDescription,
        longDescription,
        youtubeLink: youtubeLink || undefined
      });
      
      // Update the banner URL to be accessible from the client
      newVideoLesson.banner = `${newVideoLesson.banner}`;
      
      res.status(201).json({
        status: 'success',
        data: {
          videoLesson: newVideoLesson
        }
      });
    } catch (error) {
      console.error('Error creating video lesson:', error);
      
      // Clean up the uploaded file if video lesson creation fails
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

// @desc    Get all video lessons
// @route   GET /api/video-lesson
// @access  Public
exports.getAllVideoLesson = asyncHandler(async (req, res, next) => {
  // Create query
  let query = VideoLesson.find({ isActive: true });
  
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
  const total = await VideoLesson.countDocuments({ ...JSON.parse(queryStr), isActive: true });
  
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

// @desc    Get single video lesson
// @route   GET /api/video-lesson/:id
// @access  Public
exports.getVideoLesson = asyncHandler(async (req, res, next) => {
  const tip = await VideoLesson.findByIdAndUpdate(
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

// @desc    Update video lesson
// @route   PATCH /api/video-lesson/:id
// @access  Private/Admin
exports.updateVideoLesson = [
  uploadBanner,
  resizeUserPhoto,
  asyncHandler(async (req, res, next) => {
    const updateData = { ...req.body };
    
    if (req.file && req.file.filename) {
      updateData.banner = req.file.filename;
    }
    
    const tip = await VideoLesson.findByIdAndUpdate(
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

// @desc    Delete video lesson (soft delete)
// @route   DELETE /api/video-lesson/:id
// @access  Private/Admin
exports.deleteVideoLesson = asyncHandler(async (req, res, next) => {
  const tip = await VideoLesson.findByIdAndUpdate(
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

// @desc    Like a video lesson
// @route   POST /api/video-lesson/:id/like
// @access  Private
exports.likeVideoLesson = asyncHandler(async (req, res, next) => {
  const tip = await VideoLesson.findByIdAndUpdate(
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
