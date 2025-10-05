const express = require('express');
const programController = require('../controllers/program.controller');

const router = express.Router();

// Create & Get all programs
router
  .route('/')
  .post(programController.createProgram)
  .get(programController.getAllPrograms);

// Get, Update, Delete single program
router
  .route('/:id')
  .get(programController.getProgram)
  .put(programController.updateProgram)
  .delete(programController.hardDeleteProgram);

// Soft delete program
router
  .route('/:id/soft-delete')
  .patch(programController.softDeleteProgram);

// Restore soft-deleted program
router
  .route('/:id/restore')
  .patch(programController.restoreProgram);

module.exports = router;
