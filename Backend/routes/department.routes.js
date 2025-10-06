const express = require('express');
const router = express.Router();
const departmentController = require('../controllers/department.controller');

router
  .route('/')
  .post(departmentController.createDepartment)
  .get(departmentController.getAllDepartments);

router
  .route('/:id')
  .get(departmentController.getDepartmentById)
  .patch(departmentController.updateDepartment);

router
  .route('/:id/soft-delete')
  .patch(departmentController.softDeleteDepartment);

router
  .route('/:id/restore')
  .patch(departmentController.restoreDepartment);

module.exports = router;
