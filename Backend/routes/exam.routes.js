const express = require('express');
const examController = require('../controllers/exam.controller');
const authController = require('../controllers/auth.controller');

const router = express.Router();

router.use(authController.protect);
router.route('/')
  .get(examController.getAllExams)
  .post(authController.restrictTo('admin'), examController.createExam);

router.route('/:id')
  .get(examController.getExamById) 
  .put(authController.restrictTo('admin'), examController.updateExam) 
  .delete(authController.restrictTo('admin'), examController.hardDeleteExam);

router.route('/:id/soft-delete')
  .patch(authController.restrictTo('admin'), examController.softDeleteExam);

router.route('/:id/restore')
  .patch(authController.restrictTo('admin'), examController.restoreExam); 

module.exports = router;
