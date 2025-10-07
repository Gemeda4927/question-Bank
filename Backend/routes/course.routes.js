const express = require('express');
const courseController = require('../controllers/course.controller');
const router = express.Router();

// ======================== ROUTES ========================
router
  .route('/')
  .get(courseController.getAllCourses)
  .post(courseController.createCourse);

router
  .route('/:id')
  .get(courseController.getCourseById)
  .put(courseController.updateCourse);

router
  .route('/soft/:id')
  .delete(courseController.softDeleteCourse);

router
  .route('/restore/:id')
  .patch(courseController.restoreCourse);

router
  .route('/hard/:id')
  .delete(courseController.hardDeleteCourse);

module.exports = router;
