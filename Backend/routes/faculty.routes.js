const express = require('express');
const facultyController = require('../controllers/faculty.controller');

const router = express.Router();

// ================== FACULTY CRUD ==================

// Create a faculty
router.post('/', facultyController.createFaculty);

// Get all faculties (with optional search, filter, sort, pagination)
router.get('/', facultyController.getAllFaculties);

// Get single faculty by ID
router.get('/:id', facultyController.getFaculty);

// Update faculty
router.put('/:id', facultyController.updateFaculty);

// Soft delete faculty
router.delete('/soft/:id', facultyController.softDeleteFaculty);

// Restore soft-deleted faculty
router.patch('/restore/:id', facultyController.restoreFaculty);

// Hard delete faculty
router.delete('/hard/:id', facultyController.hardDeleteFaculty);

// ================== ADD PROGRAM ==================

// Push/add program to a faculty
router.patch('/:id/program', facultyController.addProgram);

// ================== STATISTICS ==================

// Get faculty statistics
router.get('/stats/all', facultyController.getFacultyStats);

module.exports = router;
