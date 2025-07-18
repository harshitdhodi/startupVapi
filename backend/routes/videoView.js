// routes/videoRoutes.js
const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const AppError = require('../utils/appError');

// GET /api/videos/:filename
router.get('/:filename', (req, res, next) => {
    try {
      const { filename } = req.params;
      console.log(filename);
      const videoPath = path.join(__dirname, '../temp', filename);
      console.log(videoPath);
      // Check if file exists   
      if (!fs.existsSync(videoPath)) {
        return next(new AppError('Video not found', 404));
      }
  
      const stat = fs.statSync(videoPath);
      const fileSize = stat.size;
      const range = req.headers.range;
  
      if (range) {
        // Handle range requests for video streaming
        const parts = range.replace(/bytes=/, "").split("-");
        const start = parseInt(parts[0], 10);
        const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
        const chunkSize = (end - start) + 1;
        const file = fs.createReadStream(videoPath, { start, end });
        
        const head = {
          'Content-Range': `bytes ${start}-${end}/${fileSize}`,
          'Accept-Ranges': 'bytes',
          'Content-Length': chunkSize,
          'Content-Type': 'video/mp4',
        };
  
        res.writeHead(206, head);
        file.pipe(res);
      } else {
        const head = {
          'Content-Length': fileSize,
          'Content-Type': 'video/mp4',
        };
        res.writeHead(200, head);
        fs.createReadStream(videoPath).pipe(res);
      }
    } catch (error) {
      next(new AppError('Error streaming video', 500));
    }
});

module.exports = router;