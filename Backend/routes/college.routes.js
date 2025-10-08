const express = require('express');
const collegeController = require('../controllers/college.controller');
const authController = require('../controllers/auth.controller');

const router = express.Router();

router.use(authController.protect);

router
  .route('/')
  .post(authController.restrictTo('admin'), collegeController.createCollege)
  .get(collegeController.getAllColleges);

router
  .route('/:id')
  .get(collegeController.getCollege)
  .put(authController.restrictTo('admin'), collegeController.updateCollege);

router
  .route('/soft/:id')
  .delete(authController.restrictTo('admin'), collegeController.softDeleteCollege);

router
  .route('/restore/:id')
  .patch(authController.restrictTo('admin'), collegeController.restoreCollege);

router
  .route('/hard/:id')
  .delete(authController.restrictTo('admin'), collegeController.hardDeleteCollege);

router
  .route('/:id/faculty')
  .patch(authController.restrictTo('admin'), collegeController.addFaculty);

router
  .route('/stats/all')
  .get(collegeController.getCollegeStats);

module.exports = router;
