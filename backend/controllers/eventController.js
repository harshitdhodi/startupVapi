const Event = require('../models/Event');
const asyncHandler = require('express-async-handler');
const AppError = require('../utils/appError');
const { uploadUserPhoto, resizeUserPhoto, deleteOldPhoto } = require('../middleware/uploadPhoto');

// @desc    Upload event banner
// @route   POST /api/events/upload-banner
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

// @desc    Create a new event
// @route   POST /api/events
// @access  Private/Admin
exports.createEvent = asyncHandler(async (req, res, next) => {
  const {
    name,
    max_seats,
    isStartUpVapiEvent = false,
    banner, // This should be the filename returned from uploadEventBanner
    date,
    time,
    location,
    description,
    youtubeLinks = [],
    prize,
    lastDate
  } = req.body;
  
  // Validate required fields
  if (!banner) {
    return next(new AppError('Please upload a banner image first', 400));
  }
  
  const event = await Event.create({
    name,
    max_seats,
    isStartUpVapiEvent,
    banner,
    date,
    time,
    location,
    description,
    youtubeLinks,
    prize,
    lastDate: new Date(lastDate)
  });

  res.status(201).json({
    success: true,
    data: event
  });
});

// @desc    Get all events
// @route   GET /api/events
// @access  Public
exports.getEvents = asyncHandler(async (req, res) => {
  const events = await Event.find({}).sort({ date: -1 }); // Sort by date by default
  
  res.status(200).json({
    success: true,
    count: events.length,
    data: events
  });
});

// @desc    Get single event
// @route   GET /api/events/:id
// @access  Public
exports.getEvent = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id);

  if (!event) {
    res.status(404);
    throw new Error('Event not found');
  }

  res.status(200).json({
    success: true,
    data: event
  });
});

// @desc    Update event
// @route   PUT /api/events/:id
// @access  Private/Admin
exports.updateEvent = asyncHandler(async (req, res) => {
  let event = await Event.findById(req.params.id);

  if (!event) {
    res.status(404);
    throw new Error('Event not found');
  }

  // Extract fields that need special handling
  const { youtubeLinks = [], ...updateData } = req.body;
  
  // Handle youtubeLinks array updates
  if (req.body.youtubeLinks) {
    // Validate youtube links if provided
    const isValidYoutubeLinks = Array.isArray(youtubeLinks) && 
      youtubeLinks.every(link => {
        try {
          const url = new URL(link);
          return url.hostname.includes('youtube.com') || 
                 url.hostname.includes('youtu.be') ||
                 url.hostname.includes('youtube2.com');
        } catch (e) {
          return false;
        }
      });
      
    if (!isValidYoutubeLinks) {
      res.status(400);
      throw new Error('Invalid YouTube links provided');
    }
    
    event.youtubeLinks = youtubeLinks;
  }
  
  // Update other fields
  Object.keys(updateData).forEach(key => {
    // Only update fields that exist on the event
    if (key in event.schema.paths) {
      event[key] = updateData[key];
    }
  });
  
  // Handle date fields
  if (req.body.date) {
    event.date = new Date(req.body.date);
  }
  
  if (req.body.lastDate) {
    event.lastDate = new Date(req.body.lastDate);
  }
  
  await event.save();

  res.status(200).json({
    success: true,
    data: event
  });
});

// @desc    Delete event
// @route   DELETE /api/events/:id
// @access  Private/Admin
exports.deleteEvent = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id);

  if (!event) {
    res.status(404);
    throw new Error('Event not found');
  }

  await event.remove();

  res.status(200).json({
    success: true,
    data: {}
  });
});
