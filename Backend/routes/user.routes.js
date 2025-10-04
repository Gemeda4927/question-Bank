const express = require('express');
const userController = require('../controllers/user.controller');
const authController = require('../controllers/auth.controller');
const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password/:resetToken', authController.resetPassword);

router.use(authController.protect);

router
  .route('/')
  .get(authController.restrictTo('admin'), userController.getAllUsers)
  .post(authController.restrictTo('admin'), userController.createUser);

router
  .route('/:id')
  .get(authController.restrictTo('admin'), userController.getUser)
  .put(authController.restrictTo('admin'), userController.updateUser)
  .delete(authController.restrictTo('admin'), userController.hardDeleteUser);

router
  .route('/:id/soft-delete')
  .patch(authController.restrictTo('admin'), userController.softDeleteUser);

router
  .route('/:id/restore')
  .patch(authController.restrictTo('admin'), userController.restoreUser);


router
  .route('/me/profile')
  .get(userController.getProfile)
  .put(userController.updateProfile);

module.exports = router;
