const mongoose = require('mongoose');

const eventPaymentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    eventId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
        required: true
    },
    paymentId: {
        type: String,
        required: true,
        unique: true
    },
    paymentDate: {
        type: Date,
        default: Date.now
    },
    isActive: {
        type: Boolean,
        default: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Add compound index to prevent duplicate payments for same user and event
eventPaymentSchema.index({ userId: 1, eventId: 1 }, { unique: true });

module.exports = mongoose.model('EventPayment', eventPaymentSchema);
