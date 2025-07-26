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
      max_seats,
      isStartUpVapiEvent
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

    // Prepare event data with properly formatted dates
    const eventData = {
      date: date,
      time: time.trim(),
      location: location.trim(),
      description: description.trim(),
      prize: prize,
      lastDate: lastDate,
      name: name.trim(),
      banner,
      max_seats: Number(max_seats) || 0,
      isStartUpVapiEvent: isStartUpVapiEvent
    };

    console.log("eventData",eventData);

    // Handle youtubeLinks
    if (youtubeLinks) {
      eventData.youtubeLinks = Array.isArray(youtubeLinks) ? youtubeLinks : [youtubeLinks];
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
exports.updateEvent = asyncHandler(async (req, res, next) => {
  try {
    console.log('=== Update Event Request ===');
    console.log('Event ID:', req.params.id);
    console.log('Request body fields:', Object.keys(req.body));
    console.log('Uploaded file:', req.file ? req.file.filename : 'No file uploaded');
    console.log('Request body values:', req.body);

    // Find the event by ID
    const event = await Event.findById(req.params.id);
    if (!event) {
      return next(new AppError('No event found with that ID', 404));
    }

    // Log current event data before update
    console.log('Current event data:', {
      name: event.name,
      time: event.time,
      banner: event.banner
    });

    // Handle banner update if a new file is uploaded
    if (req.file) {
      const banner = req.file.filename;
      if (!banner) {
        return next(new AppError('Error processing the uploaded image', 500));
      }
      event.banner = banner;
      console.log('Updated banner to:', banner);
    }

    // Update fields if they are provided in the request
    const updatableFields = [
      'date', 'time', 'location', 'description',
      'prize', 'lastDate', 'name', 'max_seats',
      'isStartUpVapiEvent', 'youtubeLinks'
    ];

    updatableFields.forEach(field => {
      if (req.body[field] !== undefined) {
        // Special handling for string fields to trim them
        if (['time', 'location', 'description', 'name'].includes(field)) {
          event[field] = String(req.body[field]).trim();
        }
        // Special handling for max_seats to ensure it's a number
        else if (field === 'max_seats') {
          event[field] = Number(req.body[field]) || 0;
        }
        // Handle youtubeLinks as array
        else if (field === 'youtubeLinks') {
          const links = Array.isArray(req.body[field]) 
            ? req.body[field] 
            : [req.body[field]];
          event[field] = links;
        }
        // Handle boolean field
        else if (field === 'isStartUpVapiEvent') {
          event[field] = req.body[field] === 'true' || req.body[field] === true;
        }
        // Default handling for other fields
        else {
          event[field] = req.body[field];
        }
        console.log(`Updated ${field}:`, event[field]);
      }
    });

    console.log('Saving updated event...');
    const updatedEvent = await event.save();
    
    console.log('Event updated successfully');
    res.status(200).json({
      status: 'success',
      data: {
        event: updatedEvent
      }
    });

  } catch (error) {
    console.error('Error updating event:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return next(new AppError(`Validation Error: ${errors.join('. ')}`, 400));
    }
    
    if (error.code === 11000) {
      return next(new AppError('Event with this name already exists', 400));
    }
    
    next(error);
  }
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
