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


// Public routes (no authentication required)
router.post('/add', createUser);


router.post('/seed', seedUsers);


// Admin-only routes
router.get('/', getAllUsers);
router.get('/:id', getUser);
router.patch('/:id', updateUser);
router.delete('/:id', deleteUser);

module.exports = router; 