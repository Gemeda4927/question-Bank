const express = require('express');
const paymentController = require('../middleware/payment.middleware');
const authController = require('../controllers/auth.controller');

const router = express.Router();

/* ======================== PROTECTED ROUTES ======================== */
// Only authenticated users can create course payments
router.post('/course', authController.protect, paymentController.createCoursePayment);

/* ======================== PUBLIC ROUTES ======================== */
router.route('/webhook')
  .get(paymentController.handleWebhook)    // Sandbox/test GET
  .post(paymentController.handleWebhook);  // Real POST webhook from Chapa

module.exports = router;
