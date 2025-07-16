const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const { requireAuth } = require('../middleware/authMiddleware');
const router = express.Router();

// Public routes (no authentication required)
router.post('/add', userController.createUser);
router.post('/login', authController.login);

// Protected routes (requires authentication)
router.get('/', requireAuth, userController.getAllUsers);
router.get('/admin', requireAuth, userController.getAdminUsers);
router.get('/isverified/:id', userController.getUserVerificationStatus);
router
  .route('/:id')
  .get(userController.getUser)
  .put(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;