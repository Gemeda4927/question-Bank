const express = require('express');
const collegeController = require('../controllers/college.controller');

const router = express.Router();

// ================== COLLEGE CRUD ==================

// Create a college
router.post('/', collegeController.createCollege);

// Get all colleges (with optional search, filter, sort, pagination)
router.get('/', collegeController.getAllColleges);

// Get single college by ID
router.get('/:id', collegeController.getCollege);

// Update college
router.put('/:id', collegeController.updateCollege);

// Soft delete college
router.delete('/soft/:id', collegeController.softDeleteCollege);

// Restore soft-deleted college
router.patch('/restore/:id', collegeController.restoreCollege);

// Hard delete college
router.delete('/hard/:id', collegeController.hardDeleteCollege);

// ================== ADD FACULTY ==================

// Push/add faculty to a college
router.patch('/:id/faculty', collegeController.addFaculty);

// ================== STATISTICS ==================

// Get college statistics
router.get('/stats/all', collegeController.getCollegeStats);

module.exports = router;
