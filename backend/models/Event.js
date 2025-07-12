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
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Event', eventSchema);
