const Review = require('../models/Review');

// Create a review
exports.createReview = async (req, res) => {
    try {
        const { eventId, rating, message } = req.body;
        const userId = req.body.userId; // Get from request body

        // Check if user already reviewed this event
        const existingReview = await Review.findOne({ eventId, userId });
        if (existingReview) {
            return res.status(400).json({
                success: false,
                message: 'You have already reviewed this event'
            });
        }

        const review = await Review.create({
            eventId,
            userId,
            rating,
            message
        });

        res.status(201).json({
            success: true,
            data: review
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// Get all reviews for an event
exports.getEventReviews = async (req, res) => {
    try {
        const { eventId } = req.params;
        
        const reviews = await Review.find({ eventId })
            .populate('userId', 'name') // Populate user details
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: reviews.length,
            data: reviews
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// Get a single review
exports.getReview = async (req, res) => {
    try {
        const review = await Review.findById(req.params.id)
            .populate('userId', 'name');

        if (!review) {
            return res.status(404).json({
                success: false,
                message: 'Review not found'
            });
        }

        res.status(200).json({
            success: true,
            data: review
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// Update a review
exports.updateReview = async (req, res) => {
    try {
        const { rating, message } = req.body;
        
        const review = await Review.findByIdAndUpdate(
            req.params.id,
            { rating, message },
            { new: true, runValidators: true }
        );

        if (!review) {
            return res.status(404).json({
                success: false,
                message: 'Review not found'
            });
        }

        res.status(200).json({
            success: true,
            data: review
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// Delete a review
exports.deleteReview = async (req, res) => {
    try {
        const review = await Review.findByIdAndDelete(req.params.id);

        if (!review) {
            return res.status(404).json({
                success: false,
                message: 'Review not found'
            });
        }

        res.status(200).json({
            success: true,
            data: {}
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};


// Get all reviews by user ID
exports.getUserReviews = async (req, res) => {
    try {
        const { userId } = req.query;
        
        const reviews = await Review.find({ userId })
            .populate('eventId', 'title') // Populate event details
            .sort({ createdAt: -1 }); // Sort by newest first

        res.status(200).json({
            success: true,
            count: reviews.length,
            data: reviews
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};