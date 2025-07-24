const Event = require('../models/Event');
const asyncHandler = require('express-async-handler');
const AppError = require('../utils/appError');

exports.createEvent = asyncHandler(async (req, res, next) => {
  try {
    console.log('Request body:', req.body);
    console.log('Uploaded file:', req.file);

    const {
      date,
      time,
      location,
      description,
      prize,
      lastDate,
      eventId,
      youtubeLinks,
      youtubeLink // For backward compatibility
    } = req.body;

    // Get the banner filename from the uploaded file
    const banner = req.file ? req.file.filename : null;

    if (!banner) {
      return next(new AppError('Please upload a banner image', 400));
    }

    // Prepare event data
    const eventData = {
      date: moment(date, 'DD/MM/YYYY').toDate(),
      time,
      location,
      description,
      prize: Number(prize),
      lastDate: moment(lastDate, 'DD/MM/YYYY').toDate(),
      eventId,
      banner,
    };

    // Handle youtubeLinks
    if (youtubeLinks) {
      eventData.youtubeLinks = Array.isArray(youtubeLinks) 
        ? youtubeLinks 
        : [youtubeLinks];
    } else if (youtubeLink) {
      eventData.youtubeLinks = [youtubeLink];
    }

    const event = await Event.create(eventData);

    res.status(201).json({
      status: 'success',
      data: { event }
    });

  } catch (error) {
    console.error('Error creating event:', error);
    next(error);
  }
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
