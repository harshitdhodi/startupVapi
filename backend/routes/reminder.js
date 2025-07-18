const express = require('express');
const router = express.Router();
const reminderController = require('../controllers/reminder');

// Create a new reminder
router.post('/', reminderController.createReminder);

// Get all reminders for the logged-in user
router.get('/', reminderController.getUserReminders);

// Get a single reminder
router.get('/:id', reminderController.getReminder);

// Update a reminder
router.put('/:id', reminderController.updateReminder);

// Delete a reminder
router.delete('/:id', reminderController.deleteReminder);

// Toggle reminder status (done/not done)
router.patch('/:id/toggle', reminderController.toggleReminderStatus);

module.exports = router;