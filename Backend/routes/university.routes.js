const express = require('express');
const universityController = require('../controllers/university.controller');
const authController = require('../controllers/auth.controller');

const router = express.Router();

router.use(authController.protect);
router
  .route('/')
  .post(authController.restrictTo('admin'), universityController.createUniversity) 
  .get(universityController.getAllUniversities); 
router
  .route('/:id')
  .get(universityController.getUniversity) 
  .put(authController.restrictTo('admin'), universityController.updateUniversity) 
  .delete(authController.restrictTo('admin'), universityController.hardDeleteUniversity);
router
  .route('/:id/soft-delete')
  .patch(authController.restrictTo('admin'), universityController.softDeleteUniversity); 
router
  .route('/:id/restore')
  .patch(authController.restrictTo('admin'), universityController.restoreUniversity); 

module.exports = router;
