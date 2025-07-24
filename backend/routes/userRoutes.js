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
router.get('/', getAllUsers);
router.get('/admin', getAdminUsers);
router.get('/isverified/:id', getUserVerificationStatus);
// Other user routes
router
  .route('/:id')
  .get(getUser)
  .delete(deleteUser);
// Update user with photo upload
router.put(
  '/:id',
  uploadUserPhoto,      // Handles the file upload
  resizeUserPhoto,      // Resizes and processes the image
  updateUser
);



module.exports = router;