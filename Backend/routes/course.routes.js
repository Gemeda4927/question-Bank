const express = require('express');
const courseController = require('../controllers/course.controller');
const auth = require('../controllers/auth.controller');
const paymentMiddleware = require('../middleware/payment.middleware');

const router = express.Router();

// ======================== PUBLIC ROUTES ========================
router.get('/', courseController.getAllCourses);
router.get('/:id', courseController.getCourseById);

// ======================== PROTECTED ROUTES ========================
router.use(auth.protect); 

// ======================== STUDENT ROUTES ========================
router.get('/student/my-courses', courseController.getStudentCourses);
router.get('/:id/enrollment-status', courseController.getEnrollmentStatus);

// Payment routes
router.post('/:id/payment', paymentMiddleware.initiateCoursePayment);       
router.post('/:id/exam-payment', paymentMiddleware.initiateExamPayment); 

// ======================== ADMIN/INSTRUCTOR ROUTES ========================
router.use(auth.restrictTo('admin', 'instructor'));

// Course management
router.post('/', courseController.createCourse);
router.put('/:id', courseController.updateCourse);
router.delete('/soft/:id', courseController.softDeleteCourse);
router.patch('/restore/:id', courseController.restoreCourse);
router.delete('/hard/:id', courseController.hardDeleteCourse);

module.exports = router;
