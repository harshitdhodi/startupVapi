const express = require('express');
const tipsAndTricksController = require('../controllers/tipsAndTricksController');

const router = express.Router();

// Public routes
router
  .route('/')
  .get(tipsAndTricksController.getAllTipsAndTricks)
  .post(tipsAndTricksController.createTipsAndTricks);

router
  .route('/:id')
  .get(tipsAndTricksController.getTipsAndTricks)
  .patch(tipsAndTricksController.updateTipsAndTricks)
  .delete(tipsAndTricksController.deleteTipsAndTricks);

// Like a tip/trick
router
  .route('/:id/like')
  .post(tipsAndTricksController.likeTipsAndTricks);



module.exports = router;
