const express = require('express');
const paymentController = require('../middleware/payment.middleware');
const authController = require('../controllers/auth.controller');

const router = express.Router();


router.post(
  '/course',
  authController.protect,         
  paymentController.createCoursePayment
);

router.get('/webhook', paymentController.handleWebhook);

module.exports = router;
