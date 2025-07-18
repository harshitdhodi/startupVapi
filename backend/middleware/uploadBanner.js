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
const uploadBanner = upload.single('banner');

// Resize and save the uploaded photo
const resizeUserPhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next(new AppError('No file was uploaded', 400));

  try {
    // Create filename
    const filename = `${Date.now()}.jpeg`;
    
    // Create directory if it doesn't exist
    const uploadDir = path.join(__dirname, '../public/img/events');
    
    // Ensure directory exists
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true, mode: 0o777 });
    }

    // Process the image
    await sharp(req.file.buffer)
      .resize(1200, 630, {  // Standard banner size
        fit: 'cover',
        position: 'center',
        withoutEnlargement: true
      })
      .toFormat('jpeg')
      .jpeg({ 
        quality: 90,
        progressive: true,
        force: false
      })
      .toFile(path.join(uploadDir, filename));

    // Save the filename to the file object
    req.file.filename = `${filename}`;  // Save relative path
    next();
  } catch (error) {
    console.error('Error processing image:', error);
    return next(new AppError('Error processing the uploaded image', 500));
  }
});

// Delete old photo when updating
const deleteOldPhoto = (photo) => {
  if (photo) {
    const photoPath = path.join(__dirname, `../public/img/events/${photo}`);
    if (fs.existsSync(photoPath)) {
      fs.unlink(photoPath, err => {
        if (err) console.error('Error deleting old photo:', err);
      });
    }
  }
};

module.exports = {
  uploadBanner,
  resizeUserPhoto,
  deleteOldPhoto
};