const express = require('express');
const examController = require('../controllers/exam.controller');

const router = express.Router();

// ======================== EXAM ROUTES ========================

router.route('/')
  .get(examController.getAllExams)       // Get all exams
  .post(examController.createExam);      // Create exam

router.route('/:id')
  .get(examController.getExam)           // Get exam by ID
  .put(examController.updateExam)        // Update exam
  .delete(examController.hardDeleteExam); // Delete exam

router.route('/:id/soft-delete')
  .patch(examController.softDeleteExam); // Soft delete exam

router.route('/:id/restore')
  .patch(examController.restoreExam);    // Restore exam

module.exports = router;
