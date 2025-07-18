const mongoose = require('mongoose');

const teamMemberSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address']
  },
  DOB: {
    type: Date,
    required: [true, 'Date of Birth is required']
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other', 'prefer not to say'],
    required: [true, 'Gender is required']
  },
  college_name: { // Fixed typo: 'collage_name' -> 'college_name'
    type: String,
    required: [true, 'College name is required'],
    trim: true
  },
  designation: {
    type: String,
    required: [true, 'Designation is required'],
    trim: true
  }
});

const startupEventCandidateSchema = new mongoose.Schema({
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: [true, 'Event ID is required']
  },
  teamMembers: {
    type: [teamMemberSchema],
    validate: {
      validator: function(v) {
        return v && v.length > 0;
      },
      message: 'At least one team member is required'
    }
  },
    p_title: {
      type: String,
      required: [true, 'Project title is required'],
      trim: true
    },
    p_description: {
      type: String,
      required: [true, 'Project description is required']
    },
    video: {
      type: String,
      required: [true, 'Video pitch is required']
    },
    total_fees: {
      type: Number,
      required: [true, 'Total fees is required'],
      min: [0, 'Fees cannot be negative']
    },
  registrationDate: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Add index for faster querying
startupEventCandidateSchema.index({ eventId: 1 });
startupEventCandidateSchema.index({ 'teamMembers.email': 1 });

module.exports = mongoose.model('StartupEventCandidate', startupEventCandidateSchema);