const StartupEventCandidate = require('../models/StartupEventCandidate');
const Event = require('../models/Event');
const asyncHandler = require('express-async-handler');
const AppError = require('../utils/appError');
const mongoose = require('mongoose');

// @desc    Register a team for a startup event
// @route   POST /api/startup-event/register
// @access  Public
const registerForStartupEvent = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    console.log('Request received:');
    console.log('Headers:', req.headers);
    console.log('Body:', req.body);
    console.log('File:', req.file);

    // Parse form data with teamMembers[0].fieldName format
    const { eventId, p_title, p_description, ...rest } = req.body;
    
    if (!eventId) {
      await session.abortTransaction();
      session.endSession();
      return next(new AppError('Event ID is required', 400));
    }
    
    // Find the event to get the prize per person
    const event = await Event.findById(eventId).session(session).lean();
    
    if (!event) {
      await session.abortTransaction();
      session.endSession();
      return next(new AppError('Event not found', 404));
    }
    
    console.log('Event object:', JSON.stringify(event, null, 2));
    
    // Default prize value if not found in the event
    const DEFAULT_PRIZE_PER_PERSON = 100; // Set your default price here
    
    // Extract the numeric value from the prize with fallback to default
    let prizePerPerson = DEFAULT_PRIZE_PER_PERSON;
    
    if (event.prize) {
      try {
        if (typeof event.prize === 'string') {
          const numericValue = event.prize.replace(/[^0-9.]/g, '');
          prizePerPerson = parseFloat(numericValue) || DEFAULT_PRIZE_PER_PERSON;
        } else if (typeof event.prize === 'number') {
          prizePerPerson = event.prize;
        }
      } catch (error) {
        console.warn('Error parsing event prize, using default:', error);
      }
    }
    
    console.log('Using prize per person:', prizePerPerson);
    
    // Helper function to parse DD/MM/YYYY format to valid Date
    const parseDate = (dateString) => {
      const parts = dateString.split('/');
      if (parts.length !== 3) return null;
      
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1; // Month is 0-indexed in JavaScript
      const year = parseInt(parts[2], 10);
      
      return new Date(year, month, day);
    };
    
    // Extract team members from the form data
    const teamMembers = [];
    let i = 0;
    while (rest[`teamMembers[${i}].name`]) {
      const dobString = rest[`teamMembers[${i}].DOB`];
      const parsedDOB = parseDate(dobString);
      
      if (!parsedDOB || isNaN(parsedDOB.getTime())) {
        await session.abortTransaction();
        session.endSession();
        return next(new AppError(`Team member ${i + 1}: Invalid date format. Use DD/MM/YYYY format`, 400));
      }
      
      // Map the fields correctly, handling both 'college_name' and 'collage_name' for backward compatibility
      const collegeName = rest[`teamMembers[${i}].college_name`] || rest[`teamMembers[${i}].collage_name`];
      
      if (!collegeName) {
        await session.abortTransaction();
        session.endSession();
        return next(new AppError(`Team member ${i + 1}: College name is required`, 400));
      }
      
      teamMembers.push({
        name: rest[`teamMembers[${i}].name`],
        email: rest[`teamMembers[${i}].email`] || `${rest[`teamMembers[${i}].name`].toLowerCase().replace(/\s+/g, '')}@example.com`,
        DOB: parsedDOB,
        gender: rest[`teamMembers[${i}].gender`],
        college_name: collegeName, // Using the correctly mapped college name
        designation: rest[`teamMembers[${i}].designation`]
      });
      i++;
    }

    if (teamMembers.length === 0) {
      await session.abortTransaction();
      session.endSession();
      return next(new AppError('At least one team member is required', 400));
    }

    // Calculate total fees based on number of team members and prize per person
    const total_fees = teamMembers.length * prizePerPerson;

    // Create the registration
    const registration = new StartupEventCandidate({
      eventId,
      teamMembers,
      p_title,
      p_description,
      video: req.file ? req.file.filename : null,
      total_fees
    });

    await registration.save({ session });
    await session.commitTransaction();
    session.endSession();

    res.status(201).json({
      status: 'success',
      data: {
        registration,
        calculatedFees: {
          prizePerPerson,
          teamSize: teamMembers.length,
          total_fees
        }
      }
    });

  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    
    console.error('Error in registerForStartupEvent:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return next(new AppError(`Validation Error: ${errors.join('. ')}`, 400));
    }
    
    if (error.code === 11000) {
      return next(new AppError('Duplicate entry. This email is already registered for the event.', 400));
    }
    
    next(new AppError('An error occurred while processing your registration', 500));
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

// @desc    Update a team's registration for a startup event
// @route   PUT /api/startup-event/register/:id
// @access  Private

const updateStartupEventRegistration = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    const registrationId = req.params.id;
    console.log('Update request received for registration ID:', registrationId);
    console.log('Headers:', req.headers);
    console.log('Body:', req.body);
    console.log('File:', req.file);

    // Find the existing registration
    const existingRegistration = await StartupEventCandidate.findById(registrationId).session(session);
    
    if (!existingRegistration) {
      await session.abortTransaction();
      session.endSession();
      return next(new AppError('Registration not found', 404));
    }

    // Create update object with existing values
    const updateData = {
      p_title: existingRegistration.p_title,
      p_description: existingRegistration.p_description,
      teamMembers: [...existingRegistration.teamMembers],
      total_fees: existingRegistration.total_fees
    };

    // Update only the fields that are provided in the request
    if (req.body.p_title !== undefined) {
      updateData.p_title = req.body.p_title;
    }
    
    if (req.body.p_description !== undefined) {
      updateData.p_description = req.body.p_description;
    }

    // Handle team members update if provided
    if (Object.keys(req.body).some(key => key.startsWith('teamMembers'))) {
      // Create a copy of existing team members
      const updatedTeamMembers = [...existingRegistration.teamMembers];
      
      // Update specific team member fields if provided
      Object.keys(req.body).forEach(key => {
        const match = key.match(/teamMembers\[(\d+)\]\.(\w+)/);
        if (match) {
          const [_, index, field] = match;
          const memberIndex = parseInt(index, 10);
          
          if (memberIndex >= 0 && memberIndex < updatedTeamMembers.length) {
            // Special handling for DOB to ensure proper date parsing
            if (field === 'DOB' && req.body[key]) {
              const parts = req.body[key].split('/');
              if (parts.length === 3) {
                const day = parseInt(parts[0], 10);
                const month = parseInt(parts[1], 10) - 1;
                const year = parseInt(parts[2], 10);
                updatedTeamMembers[memberIndex][field] = new Date(year, month, day);
              }
            } else {
              updatedTeamMembers[memberIndex][field] = req.body[key];
            }
          }
        }
      });
      
      updateData.teamMembers = updatedTeamMembers;
    }

    // Handle file upload if provided
    if (req.file) {
      updateData.video = req.file.filename;
    }

    // Update the registration
    const updatedRegistration = await StartupEventCandidate.findByIdAndUpdate(
      registrationId,
      updateData,
      { new: true, runValidators: true, session }
    );

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({
      status: 'success',
      data: {
        registration: updatedRegistration
      }
    });

  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    
    console.error('Error in updateStartupEventRegistration:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return next(new AppError(`Validation Error: ${errors.join('. ')}`, 400));
    }
    
    if (error.code === 11000) {
      return next(new AppError('Duplicate entry. This email is already registered for the event.', 400));
    }
    
    next(new AppError('An error occurred while updating your registration', 500));
  }
};
module.exports = {
  registerForStartupEvent,
  getEventRegistrations,
  getRegistration,
  updateStartupEventRegistration
};
