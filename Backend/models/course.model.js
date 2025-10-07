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
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
      },
    ],
    instructors: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    exams: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Exam',
      },
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

// ====================== ADD STUDENT TO COURSE ======================
courseSchema.methods.addStudent = async function (userId, paymentStatus = 'paid') {
  const User = mongoose.model('User');

  // Check if student already exists in course
  let subStudent = this.subscribedStudents.find(
    (s) => s.studentId.toString() === userId.toString()
  );

  if (!subStudent) {
    this.subscribedStudents.push({ studentId: userId, coursePaymentStatus: paymentStatus });
    await this.save();
  } else {
    subStudent.coursePaymentStatus = paymentStatus;
    await this.save();
  }

  // Update User model
  const user = await User.findById(userId);
  const alreadySubscribed = user.subscribedCourses.some(
    (c) => c.courseId.toString() === this._id.toString()
  );

  if (!alreadySubscribed) {
    user.subscribedCourses.push({ courseId: this._id, paymentStatus });
    await user.save();
  } else {
    user.subscribedCourses = user.subscribedCourses.map((c) =>
      c.courseId.toString() === this._id.toString() ? { ...c, paymentStatus } : c
    );
    await user.save();
  }

  return true;
};

// ====================== ADD EXAM PAYMENT ======================
courseSchema.methods.addExamPayment = async function (userId, examId, paymentStatus = 'paid') {
  const User = mongoose.model('User');
  const user = await User.findById(userId);

  // Update Course
  let subStudent = this.subscribedStudents.find((s) => s.studentId.toString() === userId.toString());
  if (!subStudent) {
    subStudent = { studentId: userId, coursePaymentStatus: 'unpaid', examsPaid: [] };
    this.subscribedStudents.push(subStudent);
  }
  if (!subStudent.examsPaid.some((e) => e.examId.toString() === examId.toString())) {
    subStudent.examsPaid.push({ examId, paymentStatus });
  }
  await this.save();

  // Update User
  let subCourse = user.subscribedCourses.find((c) => c.courseId.toString() === this._id.toString());
  if (!subCourse) {
    subCourse = { courseId: this._id, paymentStatus: 'unpaid', examsPaid: [] };
    user.subscribedCourses.push(subCourse);
  }
  if (!subCourse.examsPaid.some((e) => e.examId.toString() === examId.toString())) {
    subCourse.examsPaid.push({ examId, paymentStatus });
  }
  await user.save();

  return true;
};

// ====================== CHECK ACCESS ======================
courseSchema.methods.canAccess = function (userId, examId = null) {
  const student = this.subscribedStudents.find((s) => s.studentId.toString() === userId.toString());
  if (!student) return false;

  // Full course payment grants full access
  if (student.coursePaymentStatus === 'paid') return true;

  // Exam-level access
  if (examId) {
    return student.examsPaid.some((e) => e.examId.toString() === examId.toString() && e.paymentStatus === 'paid');
  }

  return false;
};

module.exports = mongoose.model('Course', courseSchema);
