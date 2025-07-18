const StartupEventCandidate = require('../models/StartupEventCandidate');
const asyncHandler = require('express-async-handler');
const AppError = require('../utils/appError');
const mongoose = require('mongoose');

// @desc    Register a team for a startup event
// @route   POST /api/startup-event/register
// @access  Public
const registerForStartupEvent = async (req, res, next) => {
  try {
    console.log('Request received:');
    console.log('Headers:', req.headers);
    console.log('Body:', req.body);
    console.log('File:', req.file);

    // Parse form data with teamMembers[0].fieldName format
    const { eventId, p_title, p_description, total_fees, ...rest } = req.body;
    
    // Extract team members from the form data
    const teamMembers = [];
    let i = 0;
    while (rest[`teamMembers[${i}].name`]) {
      teamMembers.push({
        name: rest[`teamMembers[${i}].name`],
        email: rest[`teamMembers[${i}].email`] || `${rest[`teamMembers[${i}].name`].toLowerCase().replace(/\s+/g, '')}@example.com`,
        DOB: rest[`teamMembers[${i}].DOB`],
        gender: rest[`teamMembers[${i}].gender`],
        college_name: rest[`teamMembers[${i}].collage_name`],
        designation: rest[`teamMembers[${i}].designation`]
      });
      i++;
    }
console.log(teamMembers);x
    const projectDetails = {
      p_title,
      p_description,
      total_fees: parseFloat(total_fees)
    };

    // Validate required fields
    if (!eventId) {
      return next(new AppError('Event ID is required', 400));
    }

    if (teamMembers.length === 0) {
      return next(new AppError('At least one team member is required', 400));
    }

    if (!p_title || !p_description || !total_fees) {
      return next(new AppError('All project details (title, description, fees) are required', 400));
    }

    // Validate eventId is a valid ObjectId
    if (!mongoose.isValidObjectId(eventId)) {
      return next(new AppError('Invalid event ID format', 400));
    }

    // Validate team member fields
    for (let i = 0; i < teamMembers.length; i++) {
      const member = teamMembers[i];
      const { name, email, DOB, gender, college_name, designation } = member;
      
      if (!name || !DOB || !gender || !college_name || !designation) {
        return next(new AppError(`Team member ${i + 1}: All fields (name, DOB, gender, college_name, designation) are required`, 400));
      }

      // Validate email format if provided
      if (email) {
        const emailRegex = /^\S+@\S+\.\S+$/;
        if (!emailRegex.test(email)) {
          return next(new AppError(`Team member ${i + 1}: Invalid email format`, 400));
        }
      }

      // Validate gender enum
      const validGenders = ['male', 'female', 'other', 'prefer not to say'];
      if (!validGenders.includes(gender)) {
        return next(new AppError(`Team member ${i + 1}: Invalid gender value`, 400));
      }

      // Validate DOB
      const dobDate = new Date(DOB);
      if (isNaN(dobDate.getTime())) {
        return next(new AppError(`Team member ${i + 1}: Invalid date of birth`, 400));
      }
    }

    // Validate total_fees is a non-negative number
    const feesNumber = parseFloat(total_fees);
    if (isNaN(feesNumber) || feesNumber < 0) {
      return next(new AppError('Total fees must be a valid non-negative number', 400));
    }

    // Validate video pitch file
    if (!req.file) {
      return next(new AppError('Video pitch file (MP4) is required', 400));
    }

    // Check for duplicate registration
    const existingRegistration = await StartupEventCandidate.findOne({
      eventId,
      'teamMembers.email': { $in: teamMembers.map(member => member.email.toLowerCase()) }
    });

    if (existingRegistration) {
      return next(new AppError('A team member is already registered for this event', 400));
    }

    // Create new registration
    const registration = await StartupEventCandidate.create({
      eventId,
      teamMembers,
      projectDetails: {
        p_title: p_title.trim(),
        p_description: p_description.trim(),
        total_fees: feesNumber,
      },
      video: req.file.path  // Save video path at root level as per model
    });

    // Respond with success
    res.status(201).json({
      status: 'success',
      message: 'Registration successful',
      data: {
        registration,
      },
    });

  } catch (error) {
    console.error('Registration error:', error);

    // Handle Mongoose validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((val) => val.message);
      return next(new AppError(`Validation error: ${messages.join('. ')}`, 400));
    }

    // Handle duplicate key errors
    if (error.code === 11000) {
      return next(new AppError('Duplicate entry detected', 400));
    }

    // Handle cast errors (invalid ObjectId)
    if (error.name === 'CastError') {
      return next(new AppError('Invalid data format', 400));
    }

    // Handle other errors
    return next(new AppError(`Server error: ${error.message}`, 500));
  }
};

// @desc    Get all registrations for a specific event
// @route   GET /api/startup-event/registrations/:eventId
// @access  Private/Admin
const getEventRegistrations = asyncHandler(async (req, res, next) => {
  const { eventId } = req.params;

  const registrations = await StartupEventCandidate.find({ eventId })
    .populate('eventId', 'name')
    .sort({ createdAt: -1 });

  // Map the data to include full URL for video pitch
  const registrationsWithVideoUrl = registrations.map(reg => ({
    ...reg.toObject(),
    video: reg.video ? 
      `${req.protocol}://${req.get('host')}/${reg.video.replace(/\\/g, '/')}` : 
      null
  }));

  res.status(200).json({
    status: 'success',
    results: registrationsWithVideoUrl.length,
    data: {
      registrations: registrationsWithVideoUrl
    }
  });
});

// @desc    Get a single registration
// @route   GET /api/startup-event/registration/:id
// @access  Private/Admin
const getRegistration = asyncHandler(async (req, res, next) => {
  const registration = await StartupEventCandidate.findById(req.params.id)
    .populate('eventId', 'name');

  if (!registration) {
    return next(new AppError('No registration found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      registration: {
        ...registration.toObject(),
        video: registration.video ? 
          `${req.protocol}://${req.get('host')}/${registration.video.replace(/\\/g, '/')}` : 
          null
      }
    }
  });
});

module.exports = {
  registerForStartupEvent,
  getEventRegistrations,
  getRegistration
};
