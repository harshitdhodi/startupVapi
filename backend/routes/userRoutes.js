const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const { requireAuth } = require('../middleware/authMiddleware');
const router = express.Router();

// Public routes (no authentication required)
router.post('/add', userController.createUser);
router.post('/login', authController.login);
router.get('/', requireAuth,userController.getAllUsers);
router.get('/isverified/:id', userController.getUserVerificationStatus);
router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;