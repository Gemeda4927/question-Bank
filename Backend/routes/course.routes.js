const express = require('express');
const router = express.Router();
const courseController = require('../controllers/course.controller');

// ======================== CREATE COURSE ========================
router.post('/', courseController.createCourse)
.get('/', courseController.getAllCourses);

// ======================== GET COURSE BY ID ========================
router.get('/:id', courseController.getCourseById);

// ======================== UPDATE COURSE ========================
router.put('/:id', courseController.updateCourse);

// ======================== SOFT DELETE COURSE ========================
router.delete('/soft/:id', courseController.softDeleteCourse);

// ======================== RESTORE COURSE ========================
router.patch('/restore/:id', courseController.restoreCourse);

// ======================== HARD DELETE COURSE ========================
router.delete('/hard/:id', courseController.hardDeleteCourse);

module.exports = router;
