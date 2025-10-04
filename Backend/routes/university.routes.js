const express = require('express');
const universityController = require('../controllers/university.controller');

const router = express.Router();

// Create & Get all universities
router
  .route('/')
  .post(universityController.createUniversity)
  .get(universityController.getAllUniversities);

// Get, Update, Delete single university
router
  .route('/:id')
  .get(universityController.getUniversity)
  .put(universityController.updateUniversity)
  .delete(universityController.hardDeleteUniversity);

// Soft delete university
router
  .route('/:id/soft-delete')
  .patch(universityController.softDeleteUniversity);

// Restore soft-deleted university
router
  .route('/:id/restore')
  .patch(universityController.restoreUniversity);

module.exports = router;
