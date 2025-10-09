const express = require('express');
const questionController = require('../controllers/question.controller');
const authController = require('../controllers/auth.controller');
const { uploadQuestionImage } = require('../middleware/upload.middleware');

const router = express.Router();

router.use(authController.protect);

router
  .route('/')
  .post(authController.restrictTo('admin'), uploadQuestionImage.single('image'), questionController.createQuestion)
  .get(questionController.getAllQuestions);

router
  .route('/:id')
  .get(questionController.getQuestionById)
  .put(authController.restrictTo('admin'), uploadQuestionImage.single('image'), questionController.updateQuestion)
  .delete(authController.restrictTo('admin'), questionController.hardDeleteQuestion);

router.patch('/:id/soft-delete', authController.restrictTo('admin'), questionController.softDeleteQuestion);
router.patch('/:id/restore', authController.restrictTo('admin'), questionController.restoreQuestion);

module.exports = router;
