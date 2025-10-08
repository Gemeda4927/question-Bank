const axios = require('axios');
const Course = require('../models/course.model');
const User = require('../models/user.model');

/* ======================== HELPERS ======================== */

// Clean and validate strings for Chapa
const getCleanString = (value, defaultValue = 'N/A') => {
  if (value === null || value === undefined) return defaultValue;
  if (Array.isArray(value)) return value[0] ? String(value[0]).trim() : defaultValue;
  return String(value).trim() || defaultValue;
};

// Sanitize description (letters, numbers, hyphens, underscores, spaces, dots)
const sanitizeDescription = (text) => {
  return text.replace(/[^a-zA-Z0-9\-_ .]/g, ' ').replace(/\s+/g, ' ').trim();
};

// Truncate title to 16 chars
const truncateTitle = (title) => title.substring(0, 16).trim();

/* ======================== CREATE COURSE PAYMENT ======================== */
exports.createCoursePayment = async (req, res, next) => {
  try {
    if (!req.user) return res.status(401).json({ status: 'fail', message: 'User not authenticated' });

    const user = await User.findById(req.user._id).select('name email role');
    if (!user) return res.status(404).json({ status: 'fail', message: 'User not found' });
    if (user.role !== 'student') return res.status(403).json({ status: 'fail', message: 'Only students can pay for courses' });

    const { courseId } = req.body;
    if (!courseId) return res.status(400).json({ status: 'fail', message: 'Course ID is required' });

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ status: 'fail', message: 'Course not found' });
    if (!course.price || course.price <= 0) return res.status(400).json({ status: 'fail', message: 'Invalid or missing course price' });

    const alreadySubscribed = course.subscribedStudents.some(s => s.studentId.toString() === user._id.toString());
    if (alreadySubscribed) return res.status(400).json({ status: 'fail', message: 'You are already subscribed to this course' });

    const [firstName, ...rest] = getCleanString(user.name).split(' ');
    const lastName = rest.join(' ') || 'User';
    const tx_ref = `course-${courseId}-${Date.now()}`;

    const paymentData = {
      amount: Math.round(Number(course.price)),
      currency: 'ETB',
      email: getCleanString(user.email),
      first_name: getCleanString(firstName, 'Customer'),
      last_name: getCleanString(lastName, 'User'),
      tx_ref: getCleanString(tx_ref),
      callback_url: `${process.env.BASE_URL}/api/v1/payments/webhook`,
      customization: {
        title: truncateTitle(getCleanString(course.name, 'Course Payment')),
        description: sanitizeDescription(getCleanString(course.code, 'COURSE'))
      },
      metadata: {
        courseId: course._id.toString(),
        userId: user._id.toString()
      }
    };

    console.log('🔍 Cleaned payment data:', paymentData);

    const response = await axios.post(
      'https://api.chapa.co/v1/transaction/initialize',
      paymentData,
      {
        headers: {
          Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 15000,
        validateStatus: status => status < 500
      }
    );

    if (response.data.status !== 'success' || !response.data.data?.checkout_url) {
      return res.status(400).json({
        status: 'fail',
        message: 'Payment initialization failed',
        details: response.data
      });
    }

    res.status(200).json({
      status: 'success',
      message: '💳 Payment initialized',
      checkout_url: response.data.data.checkout_url
    });

  } catch (error) {
    console.error('❌ Payment initialization error:', error);
    if (error.response?.data) {
      return res.status(error.response.status).json({ status: 'fail', message: 'Payment initialization failed', details: error.response.data });
    }
    next(error);
  }
};

/* ======================== VERIFY PAYMENT ======================== */
exports.verifyPayment = async (tx_ref) => {
  try {
    const response = await axios.get(
      `https://api.chapa.co/v1/transaction/verify/${tx_ref}`,
      {
        headers: { Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}` },
        timeout: 10000,
        validateStatus: status => status < 500
      }
    );
    return response.data;
  } catch (error) {
    console.error('❌ Payment verification failed:', error);
    return null;
  }
};

/* ======================== CHAPA WEBHOOK ======================== */
exports.handleWebhook = async (req, res) => {
  // Support GET (sandbox/test) and POST (production)
  const data = req.body && Object.keys(req.body).length ? req.body : req.query;

  console.log('📥 Webhook payload received:', JSON.stringify(data, null, 2));

  const { trx_ref, tx_ref, status, metadata } = data;

  // Sandbox / GET testing
  if (req.method === 'GET' || process.env.NODE_ENV === 'development') {
    console.warn('⚠️ Sandbox/test webhook detected.');
    
    // Optional: Uncomment to update DB in test mode
    // await updateTestDatabase(data);

    return res.status(200).json({ status: 'success', message: 'Sandbox webhook received' });
  }

  // Validate reference
  if (!tx_ref && !trx_ref) {
    return res.status(400).json({ status: 'fail', message: 'Missing transaction reference' });
  }
  const reference = tx_ref || trx_ref;

  // Validate metadata
  if (!metadata?.courseId || !metadata?.userId) {
    return res.status(400).json({ status: 'fail', message: 'Missing metadata (courseId/userId)' });
  }

  try {
    // Verify payment with Chapa
    const verification = await exports.verifyPayment(reference);

    if (!verification || verification.status !== 'success' || verification.data.status !== 'success') {
      return res.status(400).json({ status: 'fail', message: 'Payment not verified' });
    }

    // Find course and user
    const course = await Course.findById(metadata.courseId);
    if (!course) return res.status(404).json({ status: 'fail', message: 'Course not found' });

    const user = await User.findById(metadata.userId);
    if (!user) return res.status(404).json({ status: 'fail', message: 'Student not found' });

    // Add or update student enrollment
    const studentIndex = course.subscribedStudents.findIndex(s => s.studentId.toString() === user._id.toString());
    const enrollmentData = { studentId: user._id, coursePaymentStatus: 'paid', enrolledAt: new Date(), examsPaid: [] };

    if (studentIndex === -1) course.subscribedStudents.push(enrollmentData);
    else course.subscribedStudents[studentIndex] = { ...course.subscribedStudents[studentIndex], ...enrollmentData };

    await course.save();

    // Update user's subscribed courses
    if (!user.subscribedCourses.includes(course._id)) {
      user.subscribedCourses.push(course._id);
      await user.save();
    }

    console.log('✅ Payment recorded:', { user: user.email, course: course.name, tx_ref: reference });
    res.status(200).json({ status: 'success', message: 'Payment verified and recorded' });

  } catch (error) {
    console.error('❌ Webhook processing error:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};
