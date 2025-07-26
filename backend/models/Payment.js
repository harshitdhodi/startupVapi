const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
    min: [0, 'Amount must be a positive number']
  },
  currency: {
    type: String,
    required: [true, 'Currency is required'],
    default: 'INR',
    uppercase: true,
    enum: {
      values: ['INR', 'USD', 'EUR'],
      message: 'Currency must be either INR, USD, or EUR'
    }
  },
  paymentMethod: {
    type: String,
    required: [true, 'Payment method is required'],
    default: 'razorpay',
    enum: {
      values: ['razorpay'],
      message: 'Invalid payment method'
    }
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index for faster queries
paymentSchema.index({ transactionId: 1 });
paymentSchema.index({ status: 1 });
paymentSchema.index({ paymentDate: -1 });

// Static method to get total revenue
paymentSchema.statics.getTotalRevenue = async function() {
  const result = await this.aggregate([
    { $match: { status: 'completed' } },
    { $group: { _id: null, total: { $sum: '$amount' } } }
  ]);
  return result[0]?.total || 0;
};

const Payment = mongoose.model('memberFees', paymentSchema);

module.exports = Payment;
