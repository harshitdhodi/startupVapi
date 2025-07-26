const Payment = require('../models/Payment');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

// Create a new payment record
const createPayment = catchAsync(async (req, res, next) => {
  const { amount, currency = 'INR' } = req.body;

  const payment = await Payment.create({
    amount,
    currency
  });

  res.status(201).json({
    status: 'success',
    data: {
      payment
    }
  });
});

// Get all payments
const getAllPayments = catchAsync(async (req, res, next) => {
  // Filtering
  const queryObj = { ...req.query };
  const excludedFields = ['page', 'sort', 'limit', 'fields'];
  excludedFields.forEach(el => delete queryObj[el]);

  // Advanced filtering
  let queryStr = JSON.stringify(queryObj);
  queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
  
  let query = Payment.find(JSON.parse(queryStr));

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
  const limit = req.query.limit * 1 || 100;
  const skip = (page - 1) * limit;
  
  query = query.skip(skip).limit(limit);

  if (req.query.page) {
    const numPayments = await Payment.countDocuments();
    if (skip >= numPayments) throw new Error('This page does not exist');
  }

  const payments = await query;

  res.status(200).json({
    status: 'success',
    results: payments.length,
    data: {
      payments
    }
  });
});

// Get payment by ID
const getPayment = catchAsync(async (req, res, next) => {
  const payment = await Payment.findById(req.params.id);

  if (!payment) {
    return next(new AppError('No payment found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      payment
    }
  });
});

// Update payment
const updatePayment = catchAsync(async (req, res, next) => {
  const { amount, currency, isActive } = req.body;
  
  const payment = await Payment.findByIdAndUpdate(
    req.params.id,
    { amount, currency, isActive },
    {
      new: true,
      runValidators: true
    }
  );

  if (!payment) {
    return next(new AppError('No payment found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      payment
    }
  });
});

// Get payment statistics
const getPaymentStats = catchAsync(async (req, res, next) => {
  const stats = await Payment.aggregate([
    {
      $group: {
        _id: { $month: '$createdAt' },
        numPayments: { $sum: 1 },
        totalAmount: { $sum: '$amount' },
        avgAmount: { $avg: '$amount' },
        minAmount: { $min: '$amount' },
        maxAmount: { $max: '$amount' }
      }
    },
    {
      $sort: { _id: 1 }
    }
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      stats
    }
  });
});

// Get total revenue
const getTotalRevenue = catchAsync(async (req, res, next) => {
  const totalRevenue = await Payment.getTotalRevenue();
  
  res.status(200).json({
    status: 'success',
    data: {
      totalRevenue
    }
  });
});

// Delete payment
const deletePayment = catchAsync(async (req, res, next) => {
  const payment = await Payment.findByIdAndDelete(req.params.id);

  if (!payment) {
    return next(new AppError('No payment found with that ID', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null
  });
});

module.exports = {
  createPayment,
  getAllPayments,
  getPayment,
  updatePayment,
  getPaymentStats,
  getTotalRevenue,
  deletePayment
};
