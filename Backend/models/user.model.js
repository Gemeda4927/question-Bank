const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide your name'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please provide your email'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: 6,
      select: false,
    },
    role: {
      type: String,
      enum: ['student', 'admin', 'instructor'],
      default: 'student',
    },
    subscribedCourses: [
      {
        courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
        paymentStatus: {
          type: String,
          enum: ['unpaid', 'paid', 'pending', 'failed'],
          default: 'unpaid',
        },
        subscribedAt: { type: Date, default: Date.now },
        examsPaid: [
          {
            examId: { type: mongoose.Schema.Types.ObjectId, ref: 'Exam' },
            paymentStatus: {
              type: String,
              enum: ['unpaid', 'paid', 'pending', 'failed'],
              default: 'unpaid',
            },
            paidAt: { type: Date, default: Date.now },
          },
        ],
      },
    ],
    isDeleted: {
      type: Boolean,
      default: false,
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  { timestamps: true }
);

// ====================== PASSWORD HASHING ======================
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// ====================== MATCH PASSWORD ======================
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// ====================== PASSWORD RESET TOKEN ======================
userSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString('hex');
  this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes
  return resetToken;
};

// ====================== CHECK COURSE ACCESS ======================
userSchema.methods.hasAccessToCourse = function (courseId) {
  const sub = this.subscribedCourses.find(
    (c) => c.courseId.toString() === courseId.toString()
  );
  return sub ? sub.paymentStatus === 'paid' : false;
};

// ====================== CHECK EXAM ACCESS ======================
userSchema.methods.hasAccessToExam = function (courseId, examId) {
  const sub = this.subscribedCourses.find(
    (c) => c.courseId.toString() === courseId.toString()
  );
  if (!sub) return false;

  // Full course paid grants access to all exams
  if (sub.paymentStatus === 'paid') return true;

  // Otherwise, check exam payment
  return sub.examsPaid.some(
    (e) => e.examId.toString() === examId.toString() && e.paymentStatus === 'paid'
  );
};

// ====================== SUBSCRIBE TO COURSE ======================
userSchema.methods.subscribeToCourse = async function (courseId, paymentStatus = 'paid') {
  const Course = mongoose.model('Course');
  const course = await Course.findById(courseId);
  if (!course) throw new Error('Course not found');

  const alreadySubscribed = this.subscribedCourses.some(
    (c) => c.courseId.toString() === courseId.toString()
  );

  if (!alreadySubscribed) {
    this.subscribedCourses.push({ courseId, paymentStatus });
  } else {
    // Update paymentStatus if already subscribed
    this.subscribedCourses = this.subscribedCourses.map((c) =>
      c.courseId.toString() === courseId.toString() ? { ...c, paymentStatus } : c
    );
  }

  await this.save();

  // Update Course subscribedStudents array
  if (!course.subscribedStudents.includes(this._id)) {
    course.subscribedStudents.push({ studentId: this._id, coursePaymentStatus: paymentStatus });
    await course.save();
  }

  return true;
};

// ====================== SUBSCRIBE TO EXAM ======================
userSchema.methods.subscribeToExam = async function (courseId, examId, paymentStatus = 'paid') {
  const Course = mongoose.model('Course');
  const course = await Course.findById(courseId);
  if (!course) throw new Error('Course not found');

  let sub = this.subscribedCourses.find((c) => c.courseId.toString() === courseId.toString());

  if (!sub) {
    sub = { courseId, paymentStatus: 'unpaid', examsPaid: [] };
    this.subscribedCourses.push(sub);
  }

  const examAlreadyPaid = sub.examsPaid.some((e) => e.examId.toString() === examId.toString());
  if (!examAlreadyPaid) {
    sub.examsPaid.push({ examId, paymentStatus });
  }

  await this.save();

  // Update course subscribedStudents examsPaid
  let courseSub = course.subscribedStudents.find(
    (s) => s.studentId.toString() === this._id.toString()
  );
  if (!courseSub) {
    courseSub = { studentId: this._id, coursePaymentStatus: sub.paymentStatus, examsPaid: [] };
    course.subscribedStudents.push(courseSub);
  }
  if (!courseSub.examsPaid.some((e) => e.examId.toString() === examId.toString())) {
    courseSub.examsPaid.push({ examId, paymentStatus });
  }
  await course.save();

  return true;
};

module.exports = mongoose.model('User', userSchema);
