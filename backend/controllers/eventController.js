const Event = require('../models/Event');
const asyncHandler = require('express-async-handler');
const AppError = require('../utils/appError');
const moment = require('moment');
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
      name,
      youtubeLinks,
      youtubeLink, // For backward compatibility
      max_seats
    } = req.body;

    // Fix: Handle banner filename properly
    let banner = null;
    if (req.file) {
      // Use filename if available (diskStorage), otherwise use originalname
      banner = req.file.filename || req.file.originalname;
    }
console.log("banner",banner);
    if (!banner) {
      return next(new AppError('Please upload a banner image', 400));
    }

    // Validate required fields
    if (!name || !date || !time || !location || !description || !prize || !lastDate || !max_seats) {
      return next(new AppError('Please provide all required fields', 400));
    }

    // Parse and validate dates
    const parsedDate = moment(date, 'DD/MM/YYYY', true);
    const parsedLastDate = moment(lastDate, 'DD/MM/YYYY', true);
console.log(parsedDate.isValid());
console.log(parsedLastDate.isValid());
    // if (!parsedDate.isValid()) {
    //   return next(new AppError('Invalid event date format. Use DD/MM/YYYY', 400));
    // }

    // if (!parsedLastDate.isValid()) {
    //   return next(new AppError('Invalid last registration date format. Use DD/MM/YYYY', 400));
    // }

    // Prepare event data
    const eventData = {
      date: parsedDate.toDate(),
      time: time.trim(),
      location: location.trim(),
      description: description.trim(),
      prize: prize,
      lastDate: parsedLastDate.toDate(),
      name: name.trim(),
      banner,
      max_seats: Number(max_seats) || 0,
    };
console.log("eventData",eventData);
    // Handle youtubeLinks
    if (youtubeLinks) {
      eventData.youtubeLinks = Array.isArray(youtubeLinks) ? youtubeLinks : [youtubeLinks];
    } else if (youtubeLink) {
      eventData.youtubeLinks = [youtubeLink];
    } else {
      eventData.youtubeLinks = []; // Provide empty array if no links
    }

    console.log('Event data to be saved:', eventData);

    // Create the event
    const event = await Event.create(eventData);
    
    console.log('Event created successfully:', event);

    res.status(201).json({
      status: 'success',
      data: {
        event
      }
    });

  } catch (error) {
    console.error('Error creating event:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return next(new AppError(`Validation Error: ${errors.join('. ')}`, 400));
    }
    
    // Handle duplicate key errors
    if (error.code === 11000) {
      return next(new AppError('Event with this name already exists', 400));
    }
    
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
