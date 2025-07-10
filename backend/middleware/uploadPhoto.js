const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');
const AppError = require('../utils/appError');

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

  // Create filename
  const filename = `user-${req.user.id}-${Date.now()}.jpeg`;
  
  // Create directory if it doesn't exist
  const uploadDir = path.join(__dirname, '../public/img/users');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  // Process the image
  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(path.join(uploadDir, filename));

  // Save the filename to the request object
  req.body.photo = filename;
  next();
});

// Delete old photo when updating
const deleteOldPhoto = async (photo) => {
  if (!photo) return;
  
  const photoPath = path.join(__dirname, `../public/img/users/${photo}`);
  
  if (fs.existsSync(photoPath)) {
    await fs.promises.unlink(photoPath);
  }
};

module.exports = {
  uploadUserPhoto,
  resizeUserPhoto,
  deleteOldPhoto
};
