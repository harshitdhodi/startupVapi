const Guest = require('../models/Guest');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

// Create a new guest
exports.createGuest = catchAsync(async (req, res, next) => {
  const { name, email, mobile, eventId, userId } = req.body;

  // Check if guest already exists for this event
  const existingGuest = await Guest.findOne({ email, eventId });
  if (existingGuest) {
    return next(new AppError('Guest with this email already exists for this event', 400));
  }

  const guest = await Guest.create({
    name,
    email,
    mobile,
    eventId,
    userId
  });

  res.status(201).json({
    status: 'success',
    data: {
      guest
    }
  });
});

// Get all guests
exports.getAllGuests = catchAsync(async (req, res, next) => {
  const guests = await Guest.find().populate('eventId').populate('userId', 'name email');

  res.status(200).json({
    status: 'success',
    results: guests.length,
    data: {
      guests
    }
  });
});

// Get guests by event
exports.getGuestsByEvent = catchAsync(async (req, res, next) => {
  const { eventId } = req.params;
  
  const guests = await Guest.find({ eventId })
    .populate('eventId')
    .populate('userId', 'name email');

  res.status(200).json({
    status: 'success',
    results: guests.length,
    data: {
      guests
    }
  });
});

// Get single guest
exports.getGuest = catchAsync(async (req, res, next) => {
  const guest = await Guest.findById(req.params.id)
    .populate('eventId')
    .populate('userId', 'name email');

  if (!guest) {
    return next(new AppError('No guest found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      guest
    }
  });
});

// Update guest
exports.updateGuest = catchAsync(async (req, res, next) => {
  const { name, email, mobile, role } = req.body;
  
  // Check if email is being updated to an existing one for the same event
  if (email) {
    const existingGuest = await Guest.findOne({
      email,
      eventId: req.body.eventId,
      _id: { $ne: req.params.id }
    });
    
    if (existingGuest) {
      return next(new AppError('Guest with this email already exists for this event', 400));
    }
  }

  const guest = await Guest.findByIdAndUpdate(
    req.params.id,
    { name, email, mobile, role },
    {
      new: true,
      runValidators: true
    }
  );

  if (!guest) {
    return next(new AppError('No guest found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      guest
    }
  });
});

// Delete guest
exports.deleteGuest = catchAsync(async (req, res, next) => {
  const guest = await Guest.findByIdAndDelete(req.params.id);

  if (!guest) {
    return next(new AppError('No guest found with that ID', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null
  });
});
