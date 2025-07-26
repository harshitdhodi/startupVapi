const mongoose = require('mongoose');

const memberPaymentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
    index: true
  },
  memberFeesId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Payment',
    required: [true, 'Member fees ID is required'],
    index: true
  },
  paymentId: {
    type: String,
    required: [true, 'Payment ID is required'],
    unique: true,
    index: true
  },
  expireDate: {
    type: Date,
    // required: true,
    validate: {
      validator: function(value) {
        // Ensure expireDate is exactly 1 year from now
        const oneYearFromNow = new Date();
        oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);
        return value.getTime() === oneYearFromNow.setHours(0, 0, 0, 0);
      },
      message: 'Expiry must be exactly 1 year from now'
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

// Indexes for better query performance
memberPaymentSchema.index({ userId: 1, isActive: 1 });
memberPaymentSchema.index({ expireDate: 1 });

// Virtual for checking if payment is expired
memberPaymentSchema.virtual('isExpired').get(function() {
  return new Date() > this.expireDate;
});

// Method to check if payment is valid (not expired and active)
memberPaymentSchema.methods.isValid = function() {
  return this.isActive && !this.isExpired;
};

// Pre-save middleware to set expireDate to exactly 1 year from now
memberPaymentSchema.pre('save', function(next) {
  if (this.isNew) {
    const oneYearFromNow = new Date();
    oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);
    oneYearFromNow.setHours(0, 0, 0, 0);
    this.expireDate = oneYearFromNow;
  }
  next();
});

const MemberPayment = mongoose.model('MemberPayment', memberPaymentSchema);

module.exports = MemberPayment;
