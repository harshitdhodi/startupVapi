const express = require('express');
const videoLessonController = require('../controllers/videoLesson');

const router = express.Router();

// Public routes
router
  .route('/')
  .get(videoLessonController.getAllVideoLesson)
  .post(videoLessonController.createVideoLesson);

router
  .route('/:id')
  .get(videoLessonController.getVideoLesson)
  .patch(videoLessonController.updateVideoLesson)
  .delete(videoLessonController.deleteVideoLesson);

// Like a tip/trick
router
  .route('/:id/like')
  .post(videoLessonController.likeVideoLesson);



module.exports = router;
