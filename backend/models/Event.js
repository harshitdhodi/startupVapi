const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  // Fields from original Event model
  name: {
    type: String,
    required: [true, 'Please provide event name'],
    trim: true
  },
  max_seats: {
    type: Number,
    required: [true, 'Please provide maximum number of seats'],
    min: 1
  },
  isStartUpVapiEvent: {
    type: Boolean,
    default: false
  },
  
  // Fields from EventDetails model
  banner: {
    type: String,
    required: [true, 'Please provide a banner image URL']
  },
  date: {
    type: String,
    required: [true, 'Please provide event date']
  },
  time: {
    type: String,
    required: [true, 'Please provide event time']
  },
  location: {
    type: String,
    required: [true, 'Please provide event location'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please provide event description']
  },
  youtubeLinks: [{
    type: String,
    trim: true,
    validate: {
      validator: function(v) {
        // More flexible URL validation
        try {
          const url = new URL(v);
          // Allow any URL that contains 'youtube.com' or 'youtu.be' in the hostname
          return url.hostname.includes('youtube.com') || 
                 url.hostname.includes('youtu.be') ||
                 url.hostname.includes('youtube2.com'); // For testing
        } catch (e) {
          return false;
        }
      },
      message: props => `${props.value} is not a valid YouTube URL!`
    }
  }],
  prize: {
    type: String,
    required: [true, 'Please provide prize details']
  },
  lastDate: {
    type: String,
    required: [true, 'Please provide last date for registration']
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Event', eventSchema);
