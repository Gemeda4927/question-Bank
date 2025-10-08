const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Course name is required'],
      trim: true,
    },
    code: {
      type: String,
      required: [true, 'Course code is required'],
      unique: true,
      uppercase: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'Course price is required'],
      min: [1, 'Course price must be greater than 0'],
    },
    programId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Program',
      required: [true, 'Course must belong to a program'],
    },
    creditHours: {
      type: Number,
      required: true,
      min: 0,
    },
    semester: {
      type: Number,
      min: 1,
      max: 12,
      required: true,
    },
    level: {
      type: String,
      enum: ['Bachelor', 'Master', 'PhD', 'Diploma'],
      default: 'Bachelor',
    },
    prerequisites: [
      { type: mongoose.Schema.Types.ObjectId, ref: 'Course' }
    ],
    instructors: [
      { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
    ],
    exams: [
      { type: mongoose.Schema.Types.ObjectId, ref: 'Exam' }
    ],
    subscribedStudents: [
      {
        studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        coursePaymentStatus: {
          type: String,
          enum: ['unpaid', 'paid', 'pending', 'failed'],
          default: 'unpaid',
        },
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
  },
  { timestamps: true }
);

// ====================== METHODS ======================

// Add or update student subscription
courseSchema.methods.addStudent = async function (userId, paymentStatus = 'paid') {
  const User = mongoose.model('User');

  let student = this.subscribedStudents.find(s => s.studentId.toString() === userId.toString());
  if (!student) {
    this.subscribedStudents.push({ studentId: userId, coursePaymentStatus: paymentStatus });
  } else {
    student.coursePaymentStatus = paymentStatus;
  }
  await this.save();

  const user = await User.findById(userId);
  let subCourse = user.subscribedCourses.find(c => c.courseId.toString() === this._id.toString());
  if (!subCourse) {
    user.subscribedCourses.push({ courseId: this._id, paymentStatus });
  } else {
    subCourse.paymentStatus = paymentStatus;
  }
  await user.save();

  return true;
};

// Add or update exam payment for student
courseSchema.methods.addExamPayment = async function (userId, examId, paymentStatus = 'paid') {
  const User = mongoose.model('User');
  const user = await User.findById(userId);

  // Update Course
  let student = this.subscribedStudents.find(s => s.studentId.toString() === userId.toString());
  if (!student) {
    student = { studentId: userId, coursePaymentStatus: 'unpaid', examsPaid: [] };
    this.subscribedStudents.push(student);
  }
  if (!student.examsPaid.some(e => e.examId.toString() === examId.toString())) {
    student.examsPaid.push({ examId, paymentStatus });
  }
  await this.save();

  // Update User
  let subCourse = user.subscribedCourses.find(c => c.courseId.toString() === this._id.toString());
  if (!subCourse) {
    subCourse = { courseId: this._id, paymentStatus: 'unpaid', examsPaid: [] };
    user.subscribedCourses.push(subCourse);
  }
  if (!subCourse.examsPaid.some(e => e.examId.toString() === examId.toString())) {
    subCourse.examsPaid.push({ examId, paymentStatus });
  }
  await user.save();

  return true;
};

// Check if student can access course or exam
courseSchema.methods.canAccess = function (userId, examId = null) {
  const student = this.subscribedStudents.find(s => s.studentId.toString() === userId.toString());
  if (!student) return false;

  if (student.coursePaymentStatus === 'paid') return true;

  if (examId) {
    return student.examsPaid.some(e => e.examId.toString() === examId.toString() && e.paymentStatus === 'paid');
  }

  return false;
};

module.exports = mongoose.model('Course', courseSchema);
