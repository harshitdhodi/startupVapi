const Reminder = require('../models/Reminder');

// Create a new reminder
exports.createReminder = async (req, res) => {
    try {
        const { time, date, message, eventId, user } = req.body;
      

        const reminder = new Reminder({
            time,
            date,
            message,
            eventId,
            user
        });

        await reminder.save();
        res.status(201).json({ success: true, data: reminder });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// Get all reminders for a user
exports.getUserReminders = async (req, res) => {
    try {
        const userId = req.query.userId;
        const reminders = await Reminder.find({ user: userId })
            .populate('eventId', 'name date') // Populate event details
            .sort({ date: 1, time: 1 });

        res.status(200).json({ success: true, data: reminders });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// Get a single reminder
exports.getReminder = async (req, res) => {
    try {
        const reminder = await Reminder.findById(req.params.id)
            .populate('eventId', 'name date');

        if (!reminder) {
            return res.status(404).json({ success: false, error: 'Reminder not found' });
        }

        res.status(200).json({ success: true, data: reminder });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// Update a reminder
exports.updateReminder = async (req, res) => {
    try {
        const { time, date, message, isDone } = req.body;
        const reminder = await Reminder.findByIdAndUpdate(
            req.params.id,
            { time, date, message, isDone },
            { new: true, runValidators: true }
        );

        if (!reminder) {
            return res.status(404).json({ success: false, error: 'Reminder not found' });
        }

        res.status(200).json({ success: true, data: reminder });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// Delete a reminder
exports.deleteReminder = async (req, res) => {
    try {
        const reminder = await Reminder.findByIdAndDelete(req.params.id);

        if (!reminder) {
            return res.status(404).json({ success: false, error: 'Reminder not found' });
        }

        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// Mark reminder as done/not done
exports.toggleReminderStatus = async (req, res) => {
    try {
        const reminder = await Reminder.findById(req.params.id);
        
        if (!reminder) {
            return res.status(404).json({ success: false, error: 'Reminder not found' });
        }

        reminder.isDone = !reminder.isDone;
        await reminder.save();

        res.status(200).json({ 
            success: true, 
            data: reminder,
            message: `Reminder marked as ${reminder.isDone ? 'done' : 'not done'}`
        });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};