// Load environment variables first
require('dotenv').config({ path: '.env' });

const express = require('express');
const path = require('path');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const cors = require('cors');
const connectDB = require('./config/db');
const globalErrorHandler = require('./middleware/errorHandler').globalErrorHandler;

// Log environment variables for debugging
console.log('Environment variables:', {
  TWILIO_ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID ? 'set' : 'missing',
  TWILIO_PHONE_NUMBER: process.env.TWILIO_PHONE_NUMBER ? 'set' : 'missing'
});

// Initialize express app
const app = express();

// Enable CORS
app.use(cors());

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// Connect to MongoDB
connectDB();

// Set view engine and views directory
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Limit requests from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000, // 1 hour
  message: 'Too many requests from this IP, please try again in an hour!'
});
app.use('/api', limiter);

// Compression
app.use(compression());

// Test middleware
app.use((req, res, next) => {
  console.log('Request URL:', req.originalUrl);
  console.log('Request Method:', req.method);
  next();
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/user', require('./routes/userRoutes'));

// Test routes
app.get('/about', (req, res) => {
  res.status(200).send('Welcome to the About');
});

app.get('/', (req, res) => {
  res.status(200).send('Welcome to the Home');
});

// Global error handling middleware
app.use(globalErrorHandler);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;