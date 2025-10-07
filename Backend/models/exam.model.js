const mongoose = require('mongoose');

const examSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Exam name is required'],
      trim: true,
    },
    code: {
      type: String,
      required: [true, 'Exam code is required'],
      unique: true,
      uppercase: true,
      trim: true,
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: [true, 'Exam must belong to a course'],
    },
    description: {
      type: String,
      trim: true,
    },
    date: {
      type: Date,
      required: [true, 'Exam date is required'],
    },
    duration: {
      type: Number, // duration in minutes
      required: [true, 'Exam duration is required'],
    },
    totalMarks: {
      type: Number,
      required: true,
      min: 0,
    },
    passingMarks: {
      type: Number,
      required: true,
      min: 0,
    },
    // Track students who paid for this specific exam
    subscribedStudents: [
      {
        studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        paymentStatus: {
          type: String,
          enum: ['unpaid', 'paid', 'pending', 'failed'],
          default: 'unpaid',
        },
        subscribedAt: { type: Date, default: Date.now },
      },
    ],
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// ====================== ADD STUDENT TO EXAM ======================
examSchema.methods.addStudent = async function (studentId, paymentStatus = 'paid') {
  const User = mongoose.model('User');

  const alreadySubscribed = this.subscribedStudents.some(
    (s) => s.studentId.toString() === studentId.toString()
  );

  if (!alreadySubscribed) {
    this.subscribedStudents.push({ studentId, paymentStatus });
    await this.save();
  }

  // Also add reference in User model
  const student = await User.findById(studentId);
  if (student) {
    const courseSubscription = student.subscribedCourses.find(
      (c) => c.courseId.toString() === this.courseId.toString()
    );

    if (courseSubscription) {
      // Add examId to user's course subscription if not already present
      courseSubscription.exams = courseSubscription.exams || [];
      if (!courseSubscription.exams.includes(this._id)) {
        courseSubscription.exams.push(this._id);
      }
      courseSubscription.paymentStatus = paymentStatus; // update payment status
      await student.save();
    }
  }

  return true;
};

// ====================== CHECK STUDENT ACCESS ======================
examSchema.methods.canAccess = function (studentId) {
  return this.subscribedStudents.some(
    (s) => s.studentId.toString() === studentId.toString() && s.paymentStatus === 'paid'
  );
};

module.exports = mongoose.model('Exam', examSchema);
