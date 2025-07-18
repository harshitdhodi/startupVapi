const multer = require('multer');
const path = require('path');
const fs = require('fs');
const AppError = require('../utils/appError');

// Define directories for different types of uploads
const videoDir = path.join(__dirname, '../public/videos');
const tempDir = path.join(__dirname, '../temp');

// Ensure the directories exist
[tempDir, videoDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Configure storage for video uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Store videos in temp directory initially
    cb(null, tempDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const filename = `video-${uniqueSuffix}${ext}`;
    
    // Store the filename in the request object for later use
    if (!req.uploadedFiles) req.uploadedFiles = {};
    req.uploadedFiles.video = filename;
    
    cb(null, filename);
  }
});

// File filter to allow only MP4 files
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ['video/mp4', 'video/quicktime', 'video/x-msvideo'];
  
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new AppError('Only MP4, MOV, and AVI video files are allowed', 400), false);
  }
};

// Configure Multer with storage, file filter, and size limits
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 500 * 1024 * 1024, // 500MB limit
    files: 1 // Limit to 1 file per request
  }
});

// Middleware to handle single video file upload
const handleFileUpload = upload.single('video');

// Middleware to process the uploaded video
const processVideoUpload = async (req, res, next) => {
  try {
    if (!req.file) {
      return next(new AppError('No video file uploaded', 400));
    }

    const tempPath = req.file.path;
    const finalPath = path.join(videoDir, req.file.filename);

    // Move the file from temp to final directory
    await fs.promises.rename(tempPath, finalPath);
    
    // Store the final path in the request object
    req.videoPath = `/videos/${req.file.filename}`;
    
    next();
  } catch (error) {
    console.error('Error processing video:', error);
    
    // Clean up any temporary files if they exist
    if (req.file && req.file.path && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    
    next(new AppError('Error processing video file', 500));
  }
};

// Cleanup middleware to remove uploaded files if there's an error
const cleanupUploads = (req, res, next) => {
  // If there was an error and files were uploaded, clean them up
  if (res.statusCode >= 400 && req.uploadedFiles) {
    Object.values(req.uploadedFiles).forEach(filename => {
      const filePath = path.join(videoDir, filename);
      if (fs.existsSync(filePath)) {
        fs.unlink(filePath, err => {
          if (err) console.error('Error cleaning up file:', err);
        });
      }
    });
  }
  next();
};

module.exports = {
  handleFileUpload,
  processVideoUpload,
  cleanupUploads
};