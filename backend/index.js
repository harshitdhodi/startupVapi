// Load environment variables first
require('dotenv').config({ path: '.env' });

const express = require('express');
const path = require('path');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const connectDB = require('./config/db');
const globalErrorHandler = require('./middleware/errorHandler').globalErrorHandler;

// Log environment variables for debugging
console.log('Environment variables:', {
  TWILIO_ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID ? 'set' : 'missing',
  TWILIO_PHONE_NUMBER: process.env.TWILIO_PHONE_NUMBER ? 'set' : 'missing'
});

// Initialize express app
const app = express();

// Connect to MongoDB
connectDB();
// Limit requests from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!'
});
app.use('/api', limiter);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// Compression
app.use(compression());

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// Routes
app.use('/', require('./routes/index'));
app.use('/api/auth', require('./routes/auth'));

// Global error handling middleware
app.use(globalErrorHandler);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
