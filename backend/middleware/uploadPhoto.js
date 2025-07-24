const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

// Configure multer for memory storage
const multerStorage = multer.memoryStorage();

// Filter for image files only
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only images.', 400), false);
  }
};

// Initialize multer upload
const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Middleware to handle single photo upload
const uploadUserPhoto = upload.single('photo'); 

// Resize and save the uploaded photo
const resizeUserPhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next(); 

  try {
    // Create filename with user ID if available, otherwise use timestamp
    const filename = req.user 
      ? `user-${req.user.id}-${Date.now()}.jpeg`
      : `event-banner-${Date.now()}.jpeg`;
    
    // Create directory if it doesn't exist
    const uploadDir = path.join(__dirname, '../public/img/events');
    
    // Ensure directory exists with proper permissions
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true, mode: 0o755 });
    }

    const filePath = path.join(uploadDir, filename);

    // Process the image
    await sharp(req.file.buffer)
      .resize(500, 500, {
        fit: 'cover',
        position: 'center',
        withoutEnlargement: true
      })
      .toFormat('jpeg')
      .jpeg({ quality: 90 })
      .toFile(filePath);

    // Set the photo filename in the request body for the controller
    req.body.photo = filename;
    
    next();
  } catch (error) {
    console.error('Error processing image:', error);
    return next(new AppError('Error processing image', 500));
  }
});

// Delete old photo when updating
const deleteOldPhoto = async (photo) => {
  if (!photo) return;
  
  const photoPath = path.join(__dirname, '../public/img/events', photo);
  
  try {
    if (fs.existsSync(photoPath)) {
      await fs.promises.unlink(photoPath);
    }
  } catch (error) {
    console.error('Error deleting old photo:', error);
  }
};

module.exports = {
  uploadUserPhoto,
  resizeUserPhoto,
  deleteOldPhoto
};
