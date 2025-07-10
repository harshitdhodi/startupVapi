const express = require('express');
const router = express.Router();

const {
  getAllUsers,
  createUser,
  getUser,
  updateUser,
  deleteUser,
  seedUsers
} = require('../controllers/userController');

const {
  protect,
  restrictTo
} = require('../controllers/authController');

// Public routes (no authentication required)
router.post('/add', createUser);

// Route to seed dummy data (only in development)
if (process.env.NODE_ENV === 'development') {
  router.post('/seed', seedUsers);
}

// Protected routes (authentication required)
router.use(protect);
router.use(restrictTo('admin'));

// Admin-only routes
router.get('/', getAllUsers);
router.get('/:id', getUser);
router.patch('/:id', updateUser);
router.delete('/:id', deleteUser);

module.exports = router; 