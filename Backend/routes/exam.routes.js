const express = require('express');
const examController = require('../controllers/exam.controller');
const authController = require('../controllers/auth.controller');

const router = express.Router();

// ============================================================
// ======================== PROTECTED ROUTES ==================
// ============================================================
router.use(authController.protect);

// ============================================================
// ======================== EXAMS ROUTES ======================
// ============================================================

// ---------- Dashboard Stats ----------
router
  .route('/dashboard/stats')
  .get(examController.getExamDashboardStats);

// ---------- Get All Exams / Create Exam ----------
router
  .route('/')
  .get(examController.getAllExams)
  .post(authController.restrictTo('admin'), examController.createExam);

// ---------- Get / Update / Delete Exam by ID ----------
router
  .route('/:id')
  .get(examController.getExamById)
  .put(authController.restrictTo('admin'), examController.updateExam)
  .delete(authController.restrictTo('admin'), examController.hardDeleteExam);

// ---------- Soft Delete Exam ----------
router
  .route('/:id/soft-delete')
  .patch(authController.restrictTo('admin'), examController.softDeleteExam);

// ---------- Restore Deleted Exam ----------
router
  .route('/:id/restore')
  .patch(authController.restrictTo('admin'), examController.restoreExam);

// ============================================================
// ======================== EXPORT ROUTER =====================
// ============================================================
module.exports = router;
