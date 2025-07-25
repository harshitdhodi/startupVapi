// models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    trim: true
  },
  lastName: {
    type: String,
    trim: true
  },
  email: {
    type: String,
    sparse: true,   // Only index if the field exists and is not null
    trim: true,
    lowercase: true,
    validate: {
      validator: function(v) {
        if (!v) return true;  // Allow null/empty
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      },
      message: props => `${props.value} is not a valid email!`
    }
  },
  photo: {
    type: String,
    default: 'default.jpg'
  }, 
  password: {
    type: String,
    trim: true,
    select: false,
    validate: {
      validator: function(v) {
        if (!v) return true; // Allow null/empty for mobile-only registration
        return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/.test(v);
      },
      message: 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one digit, and one special character'
    }
  },
  mobile: {
    countryCode: {
      type: String,
      default: '+91',
      trim: true
    },
    number: {
      type: String,
      required: [true, 'Mobile number is required'],
      unique: true,
      trim: true,
      validate: {
        validator: function(v) {
          return /^\d{10,15}$/.test(v);
        },
        message: (props) => `${props.value} is not a valid mobile number!`
      }
    }
  },
  DOB: {
    type: Date,
    validate: {
      validator: function(v) {
        if (!v) return true; // Allow null/empty
        return v < new Date();
      },
      message: 'Date of birth must be in the past'
    }
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other', 'prefer not to say']
  },
  city: {
    type: String,
    trim: true
  },
  otp: {
    type: {
      code: {
        type: String,
        select: false
      },
      expiresAt: {
        type: Date,
        select: false
      }
    },
    select: false
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  registrationComplete: {
    type: Boolean,
    default: false
  },
  role: {
    type: String,
    enum: ['student','jury','member','admin'],
    default: 'student'
  },
  deviceTokens: {
    type: [String],
    default: []
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

// Create a sparse index for email uniqueness only when email exists
userSchema.index(
  { email: 1 }, 
  { 
    unique: true, 
    sparse: true,
    partialFilterExpression: { 
      email: { $exists: true, $ne: null, $ne: "" } 
    }
  }
);

// Virtual for full name
userSchema.virtual('fullName').get(function() {
  if (this.firstName && this.lastName) {
    return `${this.firstName} ${this.lastName}`;
  }
  return null;
});

// Method to check if user has completed full registration
userSchema.methods.hasCompleteRegistration = function() {
  return this.registrationComplete && this.firstName && this.lastName;
};

// Method to compare passwords
userSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

// Method to check if user has email
userSchema.methods.hasEmail = function() {
  return this.email && this.email.trim().length > 0;
};

// Method to generate full mobile number
userSchema.methods.getFullMobile = function() {
  return `${this.mobile.countryCode}${this.mobile.number}`;
};

// Pre-save middleware to hash password
userSchema.pre('save', async function(next) {
  // Only run this function if password was actually modified and exists
  if (!this.isModified('password') || !this.password) return next();
  
  // Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Pre-save middleware to clean email field
userSchema.pre('save', function(next) {
  // If email is empty string, set it to undefined to avoid sparse index issues
  if (this.email === '') {
    this.email = undefined;
  }
  next();
});

// Query middleware to filter out inactive users by default
userSchema.pre(/^find/, function(next) {
  this.find({ active: { $ne: false } });
  next();
});

// Static method to find user by mobile number
userSchema.statics.findByMobile = function(mobileNumber) {
  return this.findOne({ 'mobile.number': mobileNumber });
};

// Static method to create user with mobile only
userSchema.statics.createMobileUser = function(countryCode, mobileNumber) {
  return this.create({
    mobile: {
      countryCode,
      number: mobileNumber
    },
    isVerified: false
  });
};

const User = mongoose.model('User', userSchema);

module.exports = User;