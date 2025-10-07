const express = require('express');
const router = express.Router();
const departmentController = require('../controllers/department.controller');
const authController = require('../controllers/auth.controller');

router.use(authController.protect);

router.route('/')
  .post(authController.restrictTo('admin'), departmentController.createDepartment)
  .get(departmentController.getAllDepartments);

router.route('/:id')
  .get(departmentController.getDepartmentById)
  .put(authController.restrictTo('admin'), departmentController.updateDepartment)
  .delete(authController.restrictTo('admin'), departmentController.hardDeleteDepartment);

router.route('/:id/soft-delete')
  .patch(authController.restrictTo('admin'), departmentController.softDeleteDepartment);

router.route('/:id/restore')
  .patch(authController.restrictTo('admin'), departmentController.restoreDepartment);

module.exports = router;
