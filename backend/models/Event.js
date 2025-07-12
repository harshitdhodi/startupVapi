const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
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
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Event', eventSchema);
