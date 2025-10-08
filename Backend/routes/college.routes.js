const express = require('express');
const collegeController = require('../controllers/college.controller');

const router = express.Router();

router
  .post('/', collegeController.createCollege)
  .get('/', collegeController.getAllColleges);

router
  .get('/:id', collegeController.getCollege)
  .put('/:id', collegeController.updateCollege);

router
  .delete('/soft/:id', collegeController.softDeleteCollege)
  .patch('/restore/:id', collegeController.restoreCollege)
  .delete('/hard/:id', collegeController.hardDeleteCollege);

router
  .patch('/:id/faculty', collegeController.addFaculty)
  .get('/stats/all', collegeController.getCollegeStats);

module.exports = router;
