const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  mobile: {
    type: String,
    required: [true, 'Mobile number is required'],
    unique: true,
    trim: true,
    validate: {
      validator: function(v) {
        return /^\d{10}$/.test(v);
      },
      message: (props) => `${props.value} is not a valid mobile number!`
    }
  },
  otp: {
    code: {
      type: String,
      select: false
    },
    expiresAt: {
      type: Date,
      select: false
    }
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  active: {
    type: Boolean,
    default: true,
    select: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

/**
 * Generate OTP and set expiration
 * @returns {string} The generated OTP
 */
userSchema.methods.generateOTP = function() {
  // Generate a 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  // Set OTP to expire in 10 minutes
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

  this.otp = {
    code: otp,
    expiresAt
  };

  return otp;
};

/**
 * Verify OTP
 * @param {string} otp - The OTP to verify
 * @returns {boolean} Whether the OTP is valid
 */
userSchema.methods.verifyOTP = function(otp) {
  if (!this.otp || !this.otp.code || this.otp.expiresAt < new Date()) {
    return false;
  }
  return this.otp.code === otp;
};

// Query middleware to filter out inactive users by default
userSchema.pre(/^find/, function(next) {
  this.find({ active: { $ne: false } });
  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
