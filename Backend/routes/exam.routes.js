const express = require('express');
const examController = require('../controllers/exam.controller');

const router = express.Router();

// ======================== EXAM ROUTES ========================

// GET all exams / POST create exam
router.route('/')
  .get(examController.getAllExams)
  .post(examController.createExam);

// GET, UPDATE, DELETE exam by ID
router.route('/:id')
  .get(examController.getExamById) 
  .put(examController.updateExam)
  .delete(examController.hardDeleteExam);

// PATCH soft-delete exam
router.route('/:id/soft-delete')
  .patch(examController.softDeleteExam);

// PATCH restore exam
router.route('/:id/restore')
  .patch(examController.restoreExam);

module.exports = router;
