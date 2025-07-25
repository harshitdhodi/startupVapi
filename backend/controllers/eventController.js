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
      name,
      youtubeLinks,
      youtubeLink, // For backward compatibility
      max_seats
    } = req.body;

    // Handle the banner filename from the upload middleware
    let banner = null;
    if (req.file) {
      // The resizeUserPhoto middleware should have set req.file.filename
      banner = req.file.filename;
      if (!banner) {
        return next(new AppError('Error processing the uploaded image', 500));
      }
    } else {
      return next(new AppError('Please upload a banner image', 400));
    }
    console.log("Processed banner filename:", banner);

    // Parse dates from DD/MM/YYYY format
    const parseDate = (dateString) => {
      const [day, month, year] = dateString.split('/').map(Number);
      // Note: JavaScript months are 0-indexed, so we subtract 1 from month
      return new Date(year, month - 1, day);
    };

    // Parse and validate dates
    let eventDate, lastRegistrationDate;
    
    try {
      eventDate = parseDate(date);
      lastRegistrationDate = parseDate(lastDate);

      // Validate dates
      if (isNaN(eventDate.getTime())) {
        return next(new AppError('Invalid event date format. Please use DD/MM/YYYY format', 400));
      }

      if (isNaN(lastRegistrationDate.getTime())) {
        return next(new AppError('Invalid last registration date format. Please use DD/MM/YYYY format', 400));
      }

      // Ensure dates are in the future
      const now = new Date();
      if (eventDate <= now) {
        return next(new AppError('Event date must be in the future', 400));
      }

      if (lastRegistrationDate <= now) {
        return next(new AppError('Last registration date must be in the future', 400));
      }

      // Ensure lastDate is before or same as event date
      if (lastRegistrationDate > eventDate) {
        return next(new AppError('Last registration date cannot be after the event date', 400));
      }
    } catch (error) {
      return next(new AppError('Invalid date format. Please use DD/MM/YYYY format', 400));
    }

    // Validate required fields
    if (!name || !date || !time || !location || !description || !prize || !lastDate || !max_seats) {
      return next(new AppError('Please provide all required fields', 400));
    }

    // Prepare event data with properly formatted dates
    const eventData = {
      date: eventDate,
      time: time.trim(),
      location: location.trim(),
      description: description.trim(),
      prize: prize,
      lastDate: lastRegistrationDate,
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
