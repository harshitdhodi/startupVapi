const mongoose = require('mongoose');

const eventDetailsSchema = new mongoose.Schema({
  banner: {
    type: String,
    required: [true, 'Please provide a banner image URL']
  },
  date: {
    type: Date,
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
    type: Date,
    required: [true, 'Please provide last date for registration']
  },
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: [true, 'Please provide associated event ID']
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('EventDetails', eventDetailsSchema);
