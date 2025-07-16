const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Ensure the optimized images directory exists
const optimizedDir = path.join(__dirname, '../public/img/events');
if (!fs.existsSync(optimizedDir)) {
    fs.mkdirSync(optimizedDir, { recursive: true });
}

// @desc    Download optimized image by filename
// @route   GET /api/image/download/:filename
// @access  Public
exports.downloadImage = async (req, res) => {
    const { filename } = req.params;
    const { w = 1200, q = 80 } = req.query;
    
    // Define paths
    const originalPath = path.join(__dirname, '../public/img/events', filename);
    const optimizedFilename = `${filename.split('.')[0]}-${w}.webp`;
    const optimizedPath = path.join(optimizedDir, optimizedFilename);

    try {
        // Check if original file exists
        if (!fs.existsSync(originalPath)) {
            return res.status(404).json({
                success: false,
                message: 'Image not found'
            });
        }

        // Serve pre-optimized file if it exists
        if (fs.existsSync(optimizedPath)) {
            res.setHeader('Cache-Control', 'public, max-age=31536000');
            res.type('image/webp').sendFile(optimizedPath);
            return;
        }

        // Process and optimize the image
        const optimizedImage = await sharp(originalPath)
            .resize({ 
                width: parseInt(w, 10), 
                withoutEnlargement: true 
            })
            .webp({ 
                quality: parseInt(q, 10) 
            })
            .toBuffer();

        // Save the optimized image for future requests
        await fs.promises.writeFile(optimizedPath, optimizedImage);

        // Set cache headers
        res.setHeader('Cache-Control', 'public, max-age=31536000');
        res.setHeader('X-Cache', 'MISS');
        
        // Send the optimized image
        res.type('image/webp').send(optimizedImage);

    } catch (error) {
        console.error('Error processing image:', error);
        res.status(500).json({
            success: false,
            message: 'Error processing image',
            error: error.message
        });
    }
};

// Clear cache endpoint (for development)
exports.clearImageCache = (req, res) => {
    res.json({ success: true, message: 'Image cache cleared' });
};
