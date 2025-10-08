const axios = require('axios');
const Course = require('../models/course.model');
const User = require('../models/user.model');

// ======================== CREATE COURSE PAYMENT ========================
exports.createCoursePayment = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ status: 'fail', message: 'User not authenticated' });
    }

    const { courseId } = req.body;
    if (!courseId) {
      return res.status(400).json({ status: 'fail', message: 'Course ID is required' });
    }

    // Only students can pay
    if (req.user.role !== 'student') {
      return res.status(403).json({ status: 'fail', message: 'Only students can make course payments' });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ status: 'fail', message: 'Course not found' });
    }

    // Amount to pay
    const amount = course.price || 1000; // fallback if price not set

    // Check if student already subscribed
    const alreadySubscribed = course.subscribedStudents.some(
      s => s.studentId.toString() === req.user._id.toString()
    );
    if (alreadySubscribed) {
      return res.status(400).json({ status: 'fail', message: 'You are already subscribed to this course' });
    }

    // Fallback for user name
    const fullName = req.user.name || 'Student User';
    const nameParts = fullName.split(' ');
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(' ') || 'User';

    // Short tx_ref for Chapa
    const shortId = courseId.toString().slice(-6); // last 6 chars
    const tx_ref = `cr-${shortId}-${Date.now().toString().slice(-8)}`;

    // const returnUrl = process.env.FRONTEND_URL || 'https://your-frontend.com';
    const courseTitle = course.name.length > 13 ? course.name.slice(0, 13) + '...' : course.name;

    const paymentData = {
      amount: Math.round(amount),
      currency: 'ETB',
      email: req.user.email || `testuser${Date.now()}@mail.com`, // fallback email
      first_name: firstName,
      last_name: lastName,
      tx_ref,
      callback_url: `${process.env.BASE_URL}/api/v1/payments/webhook`,
    //   return_url: `${returnUrl}/payment-success`,
      customization: {
        title: courseTitle,
        description: `Course ${course.code}`
      }
    };

    console.log('Payment data being sent:', paymentData);

    const response = await axios.post(
      'https://api.chapa.co/v1/transaction/initialize',
      paymentData,
      {
        headers: {
          Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 15000
      }
    );

    res.status(200).json({
      status: 'success',
      message: '💳 Payment initialized',
      data: response.data,
      checkout_url: response.data.data.checkout_url
    });

  } catch (error) {
    console.error('Payment initialization error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });

    if (error.response?.status === 400) {
      return res.status(400).json({
        status: 'fail',
        message: 'Invalid payment request. Check your details.',
        details: error.response.data
      });
    }

    next(error);
  }
};

// ======================== VERIFY PAYMENT ========================
exports.verifyPayment = async (tx_ref) => {
  try {
    const response = await axios.get(
      `https://api.chapa.co/v1/transaction/verify/${tx_ref}`,
      { headers: { Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}` }, timeout: 10000 }
    );
    return response.data;
  } catch (error) {
    console.error('Payment verification failed:', error.message);
    return null;
  }
};

// ======================== CHAPA WEBHOOK ========================
exports.handleWebhook = async (req, res, next) => {
    console.log('Webhook payload:', req.body);
  try {
    const { tx_ref, status, customer } = req.body;
    console.log('Webhook received:', { tx_ref, status });

    if (!tx_ref || !customer?.email) {
      return res.status(400).json({ status: 'fail', message: 'Invalid webhook data' });
    }

    const verification = await exports.verifyPayment(tx_ref);
    if (!verification || verification.status !== 'success' || verification.data.status !== 'success') {
      return res.status(400).json({ status: 'fail', message: 'Payment not verified' });
    }

    // Extract course short ID
    const match = tx_ref.match(/^cr-(.+)-(\d+)$/);
    if (!match) return res.status(400).json({ status: 'fail', message: 'Invalid tx_ref format' });
    const shortId = match[1];

    const courses = await Course.find();
    const course = courses.find(c => c._id.toString().endsWith(shortId));
    if (!course) return res.status(404).json({ status: 'fail', message: 'Course not found' });

    const user = await User.findOne({ email: customer.email });
    if (!user) return res.status(404).json({ status: 'fail', message: 'Student not found' });

    // Update course subscription
    const studentIndex = course.subscribedStudents.findIndex(
      s => s.studentId.toString() === user._id.toString()
    );
    if (studentIndex === -1) {
      course.subscribedStudents.push({ studentId: user._id, coursePaymentStatus: 'paid', enrolledAt: new Date(), examsPaid: [] });
    } else {
      course.subscribedStudents[studentIndex].coursePaymentStatus = 'paid';
      course.subscribedStudents[studentIndex].enrolledAt = new Date();
    }
    await course.save();

    // Update user subscribed courses
    if (!user.subscribedCourses.includes(course._id)) {
      user.subscribedCourses.push(course._id);
      await user.save();
    }

    console.log('Payment successful for:', { user: user.email, course: course.name, tx_ref });

    res.status(200).json({ status: 'success', message: '✅ Payment verified and recorded' });

  } catch (error) {
    console.error('Webhook error:', error);
    next(error);
  }
};
