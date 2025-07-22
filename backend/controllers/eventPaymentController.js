const EventPayment = require('../models/EventPayment');

// Create a new payment record
exports.createPayment = async (req, res) => {
    try {
        const { userId, eventId, paymentId } = req.body;

        // Check if payment already exists for this user and event
        const existingPayment = await EventPayment.findOne({ userId, eventId });
        if (existingPayment) {
            return res.status(400).json({
                success: false,
                message: 'Payment already exists for this user and event'
            });
        }

        const payment = await EventPayment.create({
            userId,
            eventId,
            paymentId
        });
        
        res.status(201).json({
            success: true,
            data: payment
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'Duplicate payment detected'
            });
        }
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// Get payment by ID
exports.getPayment = async (req, res) => {
    try {
        const payment = await EventPayment.findById(req.params.id)
            .populate('userId', 'name email') // Populate user details
            .populate('eventId', 'title description'); // Populate event details
            
        if (!payment) {
            return res.status(404).json({
                success: false,
                message: 'Payment not found'
            });
        }
        
        res.status(200).json({
            success: true,
            data: payment
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get all payments for a user
exports.getUserPayments = async (req, res) => {
    try {
        const payments = await EventPayment.find({ userId: req.params.userId })
            .populate('eventId', 'title description')
            .sort({ paymentDate: -1 });
            
        res.status(200).json({
            success: true,
            count: payments.length,
            data: payments
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Update payment status
exports.updatePaymentStatus = async (req, res) => {
    try {
        const { isActive } = req.body;
        const payment = await EventPayment.findByIdAndUpdate(
            req.params.id,
            { isActive },
            { new: true, runValidators: true }
        );
        
        if (!payment) {
            return res.status(404).json({
                success: false,
                message: 'Payment not found'
            });
        }
        
        res.status(200).json({
            success: true,
            data: payment
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
