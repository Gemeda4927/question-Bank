const express = require('express');
const questionController = require('../controllers/question.controller');
const authController = require('../controllers/auth.controller');

const router = express.Router();

router.use(authController.protect);
router
  .route('/')
  .post(
    authController.restrictTo('admin'),
    questionController.createQuestion
  )
  .get(questionController.getAllQuestions);

router
  .route('/:id')
  .get(questionController.getQuestionById)
  .put(
    authController.restrictTo('admin'),
    questionController.updateQuestion
  )
  .delete(
    authController.restrictTo('admin'),
    questionController.hardDeleteQuestion
  );

router.post(
  '/:id/options',
  authController.restrictTo('admin'),
  questionController.addOptionToQuestion
);

// ✅ Update a specific option by index
router.put(
  '/:id/options/:index',
  authController.restrictTo('admin'),
  questionController.updateOptionByIndex
);

// ✅ Delete a specific option by index
router.delete(
  '/:id/options/:index',
  authController.restrictTo('admin'),
  questionController.deleteOptionByIndex
);

module.exports = router;
