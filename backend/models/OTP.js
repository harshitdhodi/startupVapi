const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
  mobile: {
    type: String,
    required: [true, 'Mobile number is required'],
    trim: true,
    validate: {
      validator: function(v) {
        // Remove any non-digit characters and then check if it's a valid length
        const digitsOnly = v.replace(/\D/g, '');
        return /^\d{10,15}$/.test(digitsOnly);
      },
      message: (props) => `${props.value} is not a valid mobile number!`
    },
    index: true
  },
  otp: {
    type: String,
    required: true,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 600 // Document will be automatically deleted after 10 minutes
  }
}, {
  // Ensure the TTL index is created
  autoIndex: true
});

// Create index for faster lookups
otpSchema.index({ mobile: 1, otp: 1 });

// Method to clean up expired OTPs
// This is a fallback in case TTL index doesn't work
const cleanupExpiredOtps = async function() {
  const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
  await this.deleteMany({ createdAt: { $lt: tenMinutesAgo } });
};

// Add static method to the schema
otpSchema.statics.cleanupExpired = cleanupExpiredOtps;

// Clean up expired OTPs on server start
if (mongoose.connection.readyState === 1) {
  OTP.cleanupExpired();
}

const OTP = mongoose.model('OTP', otpSchema);

// Ensure indexes are created
OTP.createIndexes().catch(err => {
  console.error('Error creating OTP indexes:', err);
});

module.exports = OTP;
