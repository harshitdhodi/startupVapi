// Load environment variables first
require('dotenv').config({ path: '.env' });

const express = require('express');
const path = require('path');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const cors = require('cors');
const multer = require('multer');
const connectDB = require('./config/db');
const globalErrorHandler = require('./middleware/errorHandler').globalErrorHandler;

// Configure multer for file uploads
const upload = multer();

// Log environment variables for debugging
console.log('Environment variables:', {
  TWILIO_ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID ? 'set' : 'missing',
  TWILIO_PHONE_NUMBER: process.env.TWILIO_PHONE_NUMBER ? 'set' : 'missing'
});

// Initialize express app
const app = express();

// Enable CORS
app.use(cors());

app.use(globalErrorHandler);

// Parse JSON and URL-encoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Store raw body for text/plain requests
app.use((req, res, next) => {
  if (req.headers['content-type'] === 'text/plain') {
    let rawBody = '';
    req.on('data', chunk => {
      rawBody += chunk.toString();
    });
    req.on('end', () => {
      try {
        req.body = JSON.parse(rawBody);
        next();
      } catch (error) {
        console.error('Error parsing JSON:', error);
        res.status(400).json({ error: 'Invalid JSON' });
      }
    });
  } else {
    express.json({ limit: '10kb' })(req, res, (err) => {
      if (err) {
        console.error('JSON parse error:', err);
        return res.status(400).json({ error: 'Invalid JSON' });
      }
      next();
    });
  }
});

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

// Test endpoint for debugging request body
app.post('/api/test-body', (req, res) => {
  console.log('Test endpoint - Request body:', req.body);
  console.log('Test endpoint - Request headers:', req.headers);

  let rawBody = '';
  req.on('data', chunk => {
    rawBody += chunk.toString();
  });

  req.on('end', () => {
    console.log('Test endpoint - Raw body:', rawBody);
    res.status(200).json({
      headers: req.headers,
      body: req.body,
      rawBody: rawBody
    });
  });
});

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/user', require('./routes/userRoutes'));
app.use('/api/event', require('./routes/eventRoutes'));
app.use('/api/event-details', require('./routes/eventDetailsRoutes'));
//events registration for startup event
app.use('/api/startup-event', require('./routes/startupEventRoutes'));
app.use('/api/video-lesson', require('./routes/videoLesson'));
app.use('/api/tips-and-tricks', require('./routes/tipsAndTricksRoutes'));
app.use('/api/image', require('./routes/imageRoutes'));

// Static frontend serving (e.g., from React/Vite build)
const frontendPath = path.join(__dirname, 'dist');
app.use(express.static(frontendPath));

// Serve index.html for unknown routes (for client-side routing)
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api') || req.path.includes('.')) {
    return next();
  }

  res.sendFile(path.join(frontendPath, 'index.html'));
});

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
