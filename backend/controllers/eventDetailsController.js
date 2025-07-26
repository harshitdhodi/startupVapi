const EventDetails = require('../models/EventDetails');
const asyncHandler = require('express-async-handler');
const { uploadUserPhoto, resizeUserPhoto, deleteOldPhoto } = require('../middleware/uploadPhoto');
const AppError = require('../utils/appError');
const moment = require('moment');
const mongoose = require('mongoose');
const Event = require('../models/Event');

// @desc    Upload event banner
// @route   POST /api/event-details/upload-banner
// @access  Private/Admin
exports.uploadEventBanner = [
  uploadUserPhoto,
  resizeUserPhoto,
  asyncHandler(async (req, res, next) => {
    const banners = req.files && req.files['banner'] ? req.files['banner'].map(file => file.filename) : [];
    
    if (banners.length === 0) {
      return next(new AppError('Please upload a banner image', 400));
    }
    
    // Get the first uploaded banner (assuming single file upload)
    const banner = banners[0];
    
    res.status(200).json({
      status: 'success',
      data: {
        banner
      }
    });
  })
];

// @desc    Create event details
// @route   POST /api/event-details
// @access  Private/Admin
// First, let's check what's in req.file after each middleware
exports.createEventDetails = [
  // Parse form data and handle file upload
  (req, res, next) => {
    uploadUserPhoto(req, res, (err) => {
      if (err) {
        return next(new AppError(err.message || 'Error uploading file', 400));
      }
      console.log('After upload - req.file:', req.file);
      next();
    });
  },

  // Resize the uploaded image
  resizeUserPhoto,

  // Add debugging middleware
  (req, res, next) => {
    console.log('After resize - req.file:', req.file);
    console.log('After resize - req.file.filename:', req.file?.filename);
    next();
  },

  // Handle the actual creation
  asyncHandler(async (req, res, next) => {
    console.log('Request body:', req.body);
    console.log('Uploaded file:', req.file);

    try {
      // Get banner filename
      let banner = null;
      console.log('Checking banner sources:');
      console.log('req.file exists:', !!req.file);
      console.log('req.file.filename:', req.file?.filename);
      console.log('req.body.photo:', req.body.photo);

      if (req.file && req.file.filename) {
        banner = req.file.filename;
        console.log('Banner from req.file.filename:', banner);
      } else if (req.body.photo) {
        banner = req.body.photo;
        console.log('Banner from req.body.photo:', banner);
      }

      if (!banner) {
        console.log('No banner found - returning error');
        return next(new AppError('Please upload a banner image', 400));
      }

      // Prepare data for database
      const eventData = {
        date: moment(req.body['date '], 'DD/MM/YYYY').toDate(), // Handle trailing space
        time: req.body.time,
        location: req.body.location,
        description: req.body.description,
        prize: Number(req.body.prize),
        lastDate: moment(req.body.lastDate, 'DD/MM/YYYY').toDate(),
        eventId: req.body.eventId,
        banner: banner,
      };

      // Handle youtubeLinks - process array, string, or nested arrays
      if (req.body.youtubeLinks) {
        // Flatten the array in case we get nested arrays
        const links = Array.isArray(req.body.youtubeLinks) 
          ? req.body.youtubeLinks.flatMap(link => 
              typeof link === 'string' && link.includes(',') 
                ? link.split(',').map(l => l.trim()).filter(Boolean)
                : link
            )
          : [req.body.youtubeLinks];
        
        // Remove any empty strings and ensure unique links
        eventData.youtubeLinks = [...new Set(links.filter(link => typeof link === 'string' && link.trim() !== ''))];
      } else if (req.body.youtubeLink) {
        // For backward compatibility
        const links = Array.isArray(req.body.youtubeLink)
          ? req.body.youtubeLink.flatMap(link => 
              typeof link === 'string' && link.includes(',') 
                ? link.split(',').map(l => l.trim()).filter(Boolean)
                : link
            )
          : [req.body.youtubeLink];
        
        eventData.youtubeLinks = [...new Set(links.filter(link => typeof link === 'string' && link.trim() !== ''))];
      }

      console.log('Data to save:', eventData);

      // Validate dates
      if (isNaN(eventData.date) || isNaN(eventData.lastDate)) {
        console.log('Invalid date detected:', { date: req.body['date '], lastDate: req.body.lastDate });
        return next(new AppError('Invalid date format for date or lastDate', 400));
      }

      const event = await EventDetails    .create(eventData);
      console.log('Event saved:', event);

      res.status(201).json({
        status: 'success',
        data: { event },
      });
    } catch (error) {
      console.error('Error in createEventDetails:', {
        message: error.message,
        stack: error.stack,
        name: error.name,
        errors: error.errors,
      });
      if (error.name === 'ValidationError') {
        const errors = Object.values(error.errors).map((err) => err.message);
        return next(new AppError(`Validation failed: ${errors.join(', ')}`, 400));
      }
      return next(new AppError('Error creating event details', 500));
    }
  }),
];

// @desc    Update event banner
// @route   PATCH /api/event-details/:id/banner
// @access  Private/Admin
exports.updateEventBanner = [
  uploadUserPhoto,
  resizeUserPhoto,
  asyncHandler(async (req, res, next) => {
    const banners = req.files && req.files['banner'] ? req.files['banner'].map(file => file.filename) : [];
    
    if (banners.length === 0) {
      return next(new AppError('Please provide a banner image', 400));
    }

    const eventDetails = await EventDetails.findById(req.params.id);
    if (!eventDetails) {
      return next(new AppError('No event details found with that ID', 404));
    }

    // Delete old banner if exists
    if (eventDetails.banner) {
      deleteOldPhoto(eventDetails.banner);
    }

    // Update banner with the first uploaded banner
    eventDetails.banner = banners[0];
    await eventDetails.save();

    res.status(200).json({
      status: 'success',
      data: {
        eventDetails
      }
    });
  })
];

// @desc    Get all event details
// @route   GET /api/event-details
// @access  Public
exports.getAllEventDetails = asyncHandler(async (req, res, next) => {
  const eventDetails = await EventDetails.find().populate('eventId');
  
  res.status(200).json({
    status: 'success',
    results: eventDetails.length,
    data: {
      eventDetails
    }
  });
});

// @desc    Get single event details
// @route   GET /api/event-details/:id
// @access  Public
exports.getEventDetails = asyncHandler(async (req, res, next) => {
  const eventDetails = await EventDetails.findById(req.params.id).populate('eventId');
  
  if (!eventDetails) {
    return next(new AppError('No event details found with that ID', 404));
  }
  
  res.status(200).json({
    status: 'success',
    data: {
      eventDetails
    }
  });
});

// @desc    Update event details
// @route   PATCH /api/event-details/:id
// @access  Private/Admin
exports.updateEventDetails = asyncHandler(async (req, res, next) => {
  // 1) Check if event details exist
  const eventDetails = await EventDetails.findById(req.params.id);
  if (!eventDetails) {
    return next(new AppError('No event details found with that ID', 404));
  }

  // 2) Update event details (excluding banner)
  const { banner, youtubeLinks, youtubeLink, ...updateData } = req.body;
  
  // 3) Update only the fields that are provided in req.body
  Object.keys(updateData).forEach(key => {
    eventDetails[key] = updateData[key];
  });

  // Handle youtubeLinks update
  if (youtubeLinks !== undefined) {
    eventDetails.youtubeLinks = Array.isArray(youtubeLinks) 
      ? youtubeLinks 
      : [youtubeLinks];
  } else if (youtubeLink !== undefined) {
    // For backward compatibility
    eventDetails.youtubeLinks = [youtubeLink];
  }

  await eventDetails.save();

  res.status(200).json({
    status: 'success',
    data: {
      eventDetails
    }
  });
});

// @desc    Delete event details
// @route   DELETE /api/event-details/:id
// @access  Private/Admin
exports.deleteEventDetails = asyncHandler(async (req, res, next) => {
  // 1) Find event details
  const eventDetails = await EventDetails.findById(req.params.id);
  if (!eventDetails) {
    return next(new AppError('No event details found with that ID', 404));
  }

  // 2) Delete banner image if exists
  if (eventDetails.banner) {
    deleteOldPhoto(eventDetails.banner);
  }

  // 3) Delete event details
  await EventDetails.findByIdAndDelete(req.params.id);

  res.status(204).json({
    status: 'success',
    data: null
  });
});

// @desc    Get event details for Startup Vapi events
// @route   GET /api/event-details/startup-vapi-events
// @access  Public
exports.getStartupVapiEventDetails = asyncHandler(async (req, res, next) => {
  // Find event details where isStartUpVapiEvent is true
  const eventDetails = await Event.find({ isStartUpVapiEvent: true })
    .sort({ createdAt: -1 });

  res.status(200).json({
    status: 'success',
    results: eventDetails.length,
    data: eventDetails
  });
});

// @desc    Get event details by filter
// @route   GET /api/event-details/filter
// @access  Public
exports.getEventDetailsByFilter = asyncHandler(async (req, res, next) => {
  try {
    console.log('Request query parameters:', req.query);
    const filter = req.query.filter || 'all';
    console.log('Filter value:', filter);
    
    // Get today's date in DD/MM/YYYY format for comparison
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();
    const todayStr = `${day}/${month}/${year}`;
    console.log('Current date string:', todayStr);

    let query = {};

    // Convert date string to sortable format (YYYYMMDD) for comparison
    const convertToSortableDate = (dateStr) => {
      const [day, month, year] = dateStr.split('/');
      return parseInt(`${year}${month.padStart(2, '0')}${day.padStart(2, '0')}`, 10);
    };

    const todaySortable = convertToSortableDate(todayStr);

    if (filter === 'upcoming') {
      query = {
        $expr: {
          $gt: [
            { $toLong: {
              $concat: [
                { $substr: [{ $arrayElemAt: [{ $split: ["$date", "/"] }, 2] }, 0, 4] },
                { $substr: [{ $arrayElemAt: [{ $split: ["$date", "/"] }, 1] }, 0, 2] },
                { $substr: [{ $arrayElemAt: [{ $split: ["$date", "/"] }, 0] }, 0, 2] }
              ]
            }},
            todaySortable
          ]
        }
      };
    } else if (filter === 'past') {
      query = {
        $expr: {
          $lt: [
            { $toLong: {
              $concat: [
                { $substr: [{ $arrayElemAt: [{ $split: ["$date", "/"] }, 2] }, 0, 4] },
                { $substr: [{ $arrayElemAt: [{ $split: ["$date", "/"] }, 1] }, 0, 2] },
                { $substr: [{ $arrayElemAt: [{ $split: ["$date", "/"] }, 0] }, 0, 2] }
              ]
            }},
            todaySortable
          ]
        }
      };
    } else if (filter === 'today') {
      query = {
        $expr: {
          $eq: [
            { $toLong: {
              $concat: [
                { $substr: [{ $arrayElemAt: [{ $split: ["$date", "/"] }, 2] }, 0, 4] },
                { $substr: [{ $arrayElemAt: [{ $split: ["$date", "/"] }, 1] }, 0, 2] },
                { $substr: [{ $arrayElemAt: [{ $split: ["$date", "/"] }, 0] }, 0, 2] }
              ]
            }},
            todaySortable
          ]
        }
      };
    } else if (filter !== 'all') {
      return next(new AppError('Invalid filter value. Use "today", "upcoming", "past", or "all".', 400));
    }

    // console.log('MongoDB query:', JSON.stringify(query, null, 2));
    const eventDetails = await Event.find(query);
    console.log('Found events:', eventDetails.length);

    res.status(200).json({
      status: 'success',
      results: eventDetails.length,
      data: {
        eventDetails
      }
    });
  } catch (error) {
    console.error('Error in getEventDetailsByFilter:', error);
    next(error);
  }
});