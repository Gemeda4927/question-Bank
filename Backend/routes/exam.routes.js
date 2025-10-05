const express = require('express');
const examController = require('../controllers/exam.controller');

const router = express.Router();
router
  .route('/')
  .post(examController.createExam)
  .get(examController.getAllExams);
router
  .route('/:id')
  .get(examController.getExam)
  .put(examController.updateExam)
  .delete(examController.hardDeleteExam);
router
  .route('/:id/soft-delete')
  .patch(examController.softDeleteExam);
router
  .route('/:id/restore')
  .patch(examController.restoreExam);

module.exports = router;
