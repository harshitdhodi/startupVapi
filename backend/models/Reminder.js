const mongoose = require('mongoose');
const User = require('./User');
const Schema = mongoose.Schema;

const reminderSchema = new mongoose.Schema({
    time: {
        type: String,
        required: true,
    },
    date: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    isDone: {
        type: Boolean,
        default: false,
    },
    eventId: {
        type: Schema.Types.ObjectId,
        ref: "Event", // Reference to the Event model
        required: true,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    timestamp: {
        type: Number,
        default: () => Date.now(),
    },
}, { timestamps: true });

module.exports = mongoose.model('Reminder', reminderSchema);