const Event = require('../models/Event');
const asyncHandler = require('express-async-handler');

// @desc    Create a new event
// @route   POST /api/events
// @access  Private/Admin
exports.createEvent = asyncHandler(async (req, res) => {
  const { name, max_seats, isStartUpVapiEvent = false } = req.body;
  console.log(req.body);
  
  const event = await Event.create({
    name,
    max_seats,
    isStartUpVapiEvent
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
  const events = await Event.find({}).sort({ createdAt: -1 });
  
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
  console.log("req.body",req.body);
  let event = await Event.findById(req.params.id);

  if (!event) {
    res.status(404);
    throw new Error('Event not found');
  }

  const { isStartUpVapiEvent, ...updateData } = req.body;
  
  // Add isStartUpVapiEvent field if it doesn't exist
  if (event.isStartUpVapiEvent === undefined) {
    event.isStartUpVapiEvent = false; // Default value
  }
  console.log("req.body",isStartUpVapiEvent);
  // Update isStartUpVapiEvent if provided in the request
  if (isStartUpVapiEvent !== undefined) {
    event.isStartUpVapiEvent = isStartUpVapiEvent === 'true';
  }
  
  // Update other fields
  Object.keys(updateData).forEach(key => {
    event[key] = updateData[key];
  });
  console.log("event",event);
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
