const MemberPayment = require('../models/MemberPayment');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

// Create a new member payment
const createMemberPayment = catchAsync(async (req, res, next) => {
    console.log('Request body:', req.body);
    const { userId, memberFeesId, paymentId } = req.body;

    if (!userId || !memberFeesId || !paymentId) {
        console.log('Missing required fields');
        return next(new AppError('Missing required fields', 400));
    }

    try {
        const memberPayment = await MemberPayment.create({
            userId,
            memberFeesId,
            paymentId
        });
        
        console.log('Created member payment:', memberPayment);
        
        res.status(201).json({
            status: 'success',
            data: {
                payment: memberPayment
            }
        });
    } catch (error) {
        console.error('Error creating member payment:', error);
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return next(new AppError(`Validation error: ${messages.join(', ')}`, 400));
        }
        next(error);
    }
});

// Get all member payments with filtering and pagination
const getAllMemberPayments = catchAsync(async (req, res, next) => {
  // Filtering
  const queryObj = { ...req.query };
  const excludedFields = ['page', 'sort', 'limit', 'fields'];
  excludedFields.forEach(el => delete queryObj[el]);

  // Advanced filtering
  let queryStr = JSON.stringify(queryObj);
  queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
  
  let query = MemberPayment.find(JSON.parse(queryStr))
    .populate('userId', 'name email') // Populate user details
    .populate('memberFeesId', 'amount currency'); // Populate fee details

  // Sorting
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy);
  } else {
    query = query.sort('-createdAt');
  }

  // Field limiting
  if (req.query.fields) {
    const fields = req.query.fields.split(',').join(' ');
    query = query.select(fields);
  } else {
    query = query.select('-__v');
  }

  // Pagination
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 10;
  const skip = (page - 1) * limit;
  
  query = query.skip(skip).limit(limit);

  const total = await MemberPayment.countDocuments(JSON.parse(queryStr));
  const memberPayments = await query;

  res.status(200).json({
    status: 'success',
    results: memberPayments.length,
    total,
    totalPages: Math.ceil(total / limit),
    currentPage: page,
    data: {
      payments: memberPayments
    }
  });
});

// Get member payment by ID
const getMemberPayment = catchAsync(async (req, res, next) => {
  const memberPayment = await MemberPayment.findById(req.params.id)
    .populate('userId', 'name email')
    .populate('memberFeesId', 'amount currency');

  if (!memberPayment) {
    return next(new AppError('No member payment found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      payment: memberPayment
    }
  });
});

// Update member payment status
const updateMemberPayment = catchAsync(async (req, res, next) => {
  const { isActive } = req.body;
  
  const memberPayment = await MemberPayment.findByIdAndUpdate(
    req.params.id,
    { isActive },
    {
      new: true,
      runValidators: true
    }
  );

  if (!memberPayment) {
    return next(new AppError('No member payment found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      payment: memberPayment
    }
  });
});

// Get active member payments for a user
const getUserActiveMemberPayments = catchAsync(async (req, res, next) => {
  const { userId } = req.params;
  
  const activePayments = await MemberPayment.find({
    userId,
    isActive: true,
    expireDate: { $gt: new Date() }
  }).sort('-createdAt');

  res.status(200).json({
    status: 'success',
    results: activePayments.length,
    data: {
      payments: activePayments
    }
  });
});

// Check if user has active membership
const checkMembershipStatus = catchAsync(async (req, res, next) => {
  const { userId } = req.params;
  
  const activePayment = await MemberPayment.findOne({
    userId,
    isActive: true,
    expireDate: { $gt: new Date() }
  }).sort('-expireDate');

  const hasActiveMembership = !!activePayment;
  
  res.status(200).json({
    status: 'success',
    data: {
      hasActiveMembership,
      membership: activePayment || null,
      expiresIn: activePayment ? Math.ceil((activePayment.expireDate - new Date()) / (1000 * 60 * 60 * 24)) + ' days' : null
    }
  });
});

module.exports = {
  createMemberPayment,
  getAllMemberPayments,
  getMemberPayment,
  updateMemberPayment,
  getUserActiveMemberPayments,
  checkMembershipStatus
};
