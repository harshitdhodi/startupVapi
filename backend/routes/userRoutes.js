const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const { requireAuth } = require('../middleware/authMiddleware');
const { uploadUserPhoto, resizeUserPhoto } = require('../middleware/uploadPhoto');

const router = express.Router();

// Public routes (no authentication required)
router.post('/add', userController.createUser);
router.post('/login', authController.login);

// Protected routes (requires authentication)
router.get('/', requireAuth, userController.getAllUsers);
router.get('/admin', requireAuth, userController.getAdminUsers);
router.get('/isverified/:id', userController.getUserVerificationStatus);

// Update user with photo upload
router.put(
  '/:id',
  requireAuth,
  uploadUserPhoto,      // Handles the file upload
  resizeUserPhoto,      // Resizes and processes the image
  userController.updateUser
);

// Other user routes
router
  .route('/:id')
  .get(userController.getUser)
  .delete(requireAuth, userController.deleteUser);

module.exports = router;