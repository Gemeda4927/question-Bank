const express = require('express');
const programController = require('../controllers/program.controller');
const authController = require('../controllers/auth.controller');

const router = express.Router();
router.use(authController.protect);


router
  .route('/')
  .post(authController.restrictTo('admin'), programController.createProgram) 
  .get(programController.getAllPrograms);
router
  .route('/:id')
  .get(programController.getProgram) 
  .put(authController.restrictTo('admin'), programController.updateProgram) 
  .delete(authController.restrictTo('admin'), programController.hardDeleteProgram); 
router
  .route('/:id/soft-delete')
  .patch(authController.restrictTo('admin'), programController.softDeleteProgram); 
router
  .route('/:id/restore')
  .patch(authController.restrictTo('admin'), programController.restoreProgram); 

module.exports = router;
