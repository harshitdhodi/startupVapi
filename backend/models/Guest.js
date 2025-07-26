const mongoose = require('mongoose');

const guestSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide your name'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address']
  },
  mobile: {
    type: String,
    required: [true, 'Please provide your mobile number'],
    trim: true
  },
  role: {
    type: String,
    enum: ['guest', 'organizer', 'admin'],
    default: 'guest'
  },
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: [true, 'Please provide an event ID']
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Please provide a user ID']
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
guestSchema.index({ email: 1, eventId: 1 }, { unique: true });

guestSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Guest = mongoose.model('Guest', guestSchema);

module.exports = Guest;
