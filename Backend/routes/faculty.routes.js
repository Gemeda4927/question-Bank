const express = require('express');
const facultyController = require('../controllers/faculty.controller');
const authController = require('../controllers/auth.controller');

const router = express.Router();

router.use(authController.protect);

router
  .route('/')
  .post(authController.restrictTo('admin'), facultyController.createFaculty)
  .get(facultyController.getAllFaculties);

router
  .route('/:id')
  .get(facultyController.getFaculty)
  .put(authController.restrictTo('admin'), facultyController.updateFaculty)
  .delete(authController.restrictTo('admin'), facultyController.hardDeleteFaculty);

router
  .route('/:id/soft-delete')
  .delete(authController.restrictTo('admin'), facultyController.softDeleteFaculty);

router
  .route('/:id/restore')
  .patch(authController.restrictTo('admin'), facultyController.restoreFaculty);

router
  .route('/:id/program')
  .patch(authController.restrictTo('admin'), facultyController.addProgram);

router
  .route('/stats/all')
  .get(facultyController.getFacultyStats);

module.exports = router;
