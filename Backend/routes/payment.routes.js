const express = require('express');
const paymentController = require('../middleware/payment.middleware');
const authController = require('../controllers/auth.controller');

const router = express.Router();

// Protect all payment routes
router.use(authController.protect);

// Initialize a course payment
router.post('/course', paymentController.createCoursePayment);

// Chapa webhook (no authentication because Chapa calls this)
router.post('/webhook', paymentController.handleWebhook);

module.exports = router;
