const axios = require("axios");
const Course = require("../models/course.model");
const Exam = require("../models/exam.model");
const User = require("../models/user.model");

// ======================== UTILITY FUNCTIONS ========================
const getCleanString = (value, defaultValue = "N/A") => {
  if (value === null || value === undefined) return defaultValue;
  if (Array.isArray(value)) return value[0] ? String(value[0]).trim() : defaultValue;
  return String(value).trim() || defaultValue;
};

// Sanitize and truncate description to meet Chapa API limits
const sanitizeDescription = (text) => {
  return text
    .replace(/[^a-zA-Z0-9\-_. ]/g, " ") // only allow letters, numbers, hyphen, underscore, dot, space
    .replace(/\s+/g, " ")
    .trim()
    .substring(0, 50); // max 50 chars
};

// Truncate title to max 16 chars
const truncateTitle = (title) => title.substring(0, 16).trim();

// ======================== PAYMENT VERIFICATION ========================
exports.verifyPayment = async (tx_ref) => {
  try {
    const response = await axios.get(`https://api.chapa.co/v1/transaction/verify/${tx_ref}`, {
      headers: { Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}` },
      timeout: 10000,
      validateStatus: (status) => status < 500,
    });
    return response.data;
  } catch (error) {
    console.error("❌ Payment verification failed:", error);
    return null;
  }
};

// ======================== COURSE PAYMENT ========================
exports.initiateCoursePayment = async (req, res, next) => {
  try {
    const courseId = req.params.id;
    const student = req.user;

    if (!student)
      return res.status(401).json({ status: "fail", message: "User not authenticated" });

    const course = await Course.findById(courseId);
    if (!course)
      return res.status(404).json({ status: "fail", message: "Course not found" });

    if (!course.price || course.price <= 0)
      return res.status(400).json({ status: "fail", message: "Invalid or missing course price" });

    const [firstName, ...rest] = getCleanString(student.name).split(" ");
    const lastName = rest.join(" ") || "User";
    const tx_ref = `course-${Date.now()}`;

    const paymentData = {
      amount: Math.round(Number(course.price)),
      currency: "ETB",
      email: getCleanString(student.email),
      first_name: getCleanString(firstName, "Customer"),
      last_name: getCleanString(lastName, "User"),
      tx_ref,
      callback_url: `${process.env.BASE_URL}/api/v1/payments/webhook`,
      customization: {
        title: truncateTitle(getCleanString(course.name, "Course Payment")),
        description: sanitizeDescription(getCleanString(course.code, "COURSE")),
      },
      metadata: { courseId: course._id.toString(), userId: student._id.toString(), type: "course" },
    };

    const response = await axios.post(
      "https://api.chapa.co/v1/transaction/initialize",
      paymentData,
      {
        headers: {
          Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
        timeout: 15000,
        validateStatus: (status) => status < 500,
      }
    );

    if (response.data.status !== "success" || !response.data.data?.checkout_url)
      return res.status(400).json({
        status: "fail",
        message: "Payment initialization failed",
        details: response.data,
      });

    res.status(200).json({
      status: "success",
      message: "💳 Course payment initialized",
      checkout_url: response.data.data.checkout_url,
    });
  } catch (error) {
    console.error("❌ Course payment error:", error);
    next(error);
  }
};

// ======================== EXAM PAYMENT ========================
exports.initiateExamPayment = async (req, res, next) => {
  try {
    const courseId = req.params.id; // course ID (for metadata)
    const { examId } = req.body;
    const student = req.user;

    if (!student)
      return res.status(401).json({ status: "fail", message: "User not authenticated" });

    const course = await Course.findById(courseId);
    if (!course)
      return res.status(404).json({ status: "fail", message: "Course not found" });

    if (!examId)
      return res.status(400).json({ status: "fail", message: "Exam ID is required" });

    const exam = await Exam.findById(examId);
    if (!exam)
      return res.status(404).json({ status: "fail", message: "Exam not found" });

    // Determine payment amount
    const amount = exam.price || course.examPrice || 100;

    const [firstName, ...rest] = getCleanString(student.name).split(" ");
    const lastName = rest.join(" ") || "User";
    const tx_ref = `exam-${Date.now()}`;

    const paymentData = {
      amount: Math.round(amount),
      currency: "ETB",
      email: getCleanString(student.email),
      first_name: getCleanString(firstName, "Customer"),
      last_name: getCleanString(lastName, "User"),
      tx_ref,
      callback_url: `${process.env.BASE_URL}/api/v1/payments/exam-webhook`,
      customization: {
        title: "Exam Payment",
        description: sanitizeDescription(`Payment for exam: ${getCleanString(exam.name)}`),
      },
      metadata: {
        courseId: course._id.toString(),
        examId: exam._id.toString(),
        userId: student._id.toString(),
        type: "exam",
      },
    };

    const response = await axios.post(
      "https://api.chapa.co/v1/transaction/initialize",
      paymentData,
      {
        headers: {
          Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
        timeout: 15000,
        validateStatus: (status) => status < 500,
      }
    );

    if (response.data.status !== "success" || !response.data.data?.checkout_url)
      return res.status(400).json({
        status: "fail",
        message: "Exam payment initialization failed",
        details: response.data,
      });

    res.status(200).json({
      status: "success",
      message: "💳 Exam payment initialized",
      checkout_url: response.data.data.checkout_url,
    });
  } catch (error) {
    console.error("❌ Exam payment error:", error);
    next(error);
  }
};

// ======================== WEBHOOK HANDLERS ========================
exports.handleCourseWebhook = async (req, res) => {
  console.log("💳 Course webhook received", req.body);
  // TODO: Verify payment & update student coursePaymentStatus
  res.status(200).json({ status: "success", message: "Course webhook handled" });
};

exports.handleExamWebhook = async (req, res) => {
  console.log("💳 Exam webhook received", req.body);
  // TODO: Verify payment & update student exam paymentStatus
  res.status(200).json({ status: "success", message: "Exam webhook handled" });
};
