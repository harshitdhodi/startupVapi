const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    validate: {
      validator: function(v) {
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
    required: [true, 'Password is required'],
    trim: true,
    validate: {
      validator: function(v) {
        // More permissive password validation
        return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/.test(v);
      },
      message: 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one digit, and one special character'
    }
  },
  mobile: {
    countryCode: {
      type: String,
      required: [true, 'Country code is required'],
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
    required: [true, 'Date of birth is required'],
    validate: {
      validator: function(v) {
        // Check if date is in the past
        return v < new Date();
      },
      message: 'Date of birth must be in the past'
    }
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other', 'prefer not to say'],
    required: [true, 'Gender is required']
  },
  city: {
    type: String,
    required: [true, 'City is required'],
    trim: true
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

// Virtual for full name
userSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Method to check if user has completed full registration
userSchema.methods.hasCompleteRegistration = function() {
  return this.registrationComplete && this.firstName && this.lastName && this.email;
};

// Query middleware to filter out inactive users by default
userSchema.pre(/^find/, function(next) {
  this.find({ active: { $ne: false } });
  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;