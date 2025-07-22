const express = require('express');
const { 
  createUser, 
  getAllUsers, 
  getAdminUsers, 
  getUserVerificationStatus,    
  getUser, 
  updateUser, 
  deleteUser 
} = require('../controllers/userController');
const { login, verifyLogin } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { uploadUserPhoto, resizeUserPhoto } = require('../middleware/uploadPhoto');

const router = express.Router();

// Public routes (no authentication required)
router.post('/add', createUser);
router.post('/login', login);
router.post('/verify-login', verifyLogin);

// Protected routes (requires authentication)
router.get('/', protect, getAllUsers);
router.get('/admin', protect, getAdminUsers);
router.get('/isverified/:id', getUserVerificationStatus);

// Update user with photo upload
router.put(
  '/:id',
  protect,
  uploadUserPhoto,      // Handles the file upload
  resizeUserPhoto,      // Resizes and processes the image
  updateUser
);

// Other user routes
router
  .route('/:id')
  .get(getUser)
  .delete(protect, deleteUser);

module.exports = router;