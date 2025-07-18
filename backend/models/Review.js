const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reviewSchema = new mongoose.Schema({
    eventId: {
        type: Schema.Types.ObjectId,
        ref: 'Event',
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    message: {
        type: String,
        required: true,
        trim: true
    }
}, { timestamps: true });

// Prevent duplicate reviews from same user for same event
reviewSchema.index({ eventId: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model('Review', reviewSchema);