const mongoose = require('mongoose');

const videoLessonSchema = new mongoose.Schema({
  banner: {
    type: String,
    required: [true, 'Please provide a banner image']
  },
  title: {
    type: String,
    required: [true, 'Please provide a title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  shortDescription: {
    type: String,
    required: [true, 'Please provide a short description'],
    trim: true,
    maxlength: [200, 'Short description cannot be more than 200 characters']
  },
  longDescription: {
    type: String,
    required: [true, 'Please provide a detailed description'],
    trim: true
  },
  youtubeLink: {
    type: String,
    trim: true,
    validate: {
      validator: function(v) {
        try {
          const url = new URL(v);
          return url.hostname.includes('youtube.com') || 
                 url.hostname.includes('youtu.be');
        } catch (e) {
          return false;
        }
      },
      message: props => `${props.value} is not a valid YouTube URL!`
    }
  },
  likes: {
    type: Number,
    default: 0
  },
  viewers: {
    type: Number,
    default: 0
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
videoLessonSchema.index({ title: 'text', shortDescription: 'text', longDescription: 'text' });

module.exports = mongoose.model('VideoLesson', videoLessonSchema);
