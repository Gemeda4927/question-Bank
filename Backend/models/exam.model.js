const mongoose = require("mongoose");

const examSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Exam name is required"],
      trim: true,
    },
    code: {
      type: String,
      required: [true, "Exam code is required"],
      unique: true,
      uppercase: true,
      trim: true,
    },

    // 🔗 Foreign Keys
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: [true, "Exam must belong to a course"],
    },
    universityId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "University",
      required: [true, "Exam must belong to a university"],
    },

    // 🧾 Exam Details
    type: {
      type: String,
      enum: ["midterm", "final", "quiz", "assignment"],
      default: "final",
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    date: {
      type: Date,
      required: [true, "Exam date is required"],
    },
    duration: {
      type: Number, // in minutes
      required: [true, "Exam duration is required"],
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
    price: {
      type: Number,
      default: 0,
      min: 0,
    },

    // 🧠 Relations
    questions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Question",
      },
    ],
    subscribedStudents: [
      {
        studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        paymentStatus: {
          type: String,
          enum: ["unpaid", "paid", "pending", "failed"],
          default: "unpaid",
        },
        subscribedAt: { type: Date, default: Date.now },
      },
    ],

    // ⚙️ Flags
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// ====================== ADD STUDENT TO EXAM ======================
examSchema.methods.addStudent = async function (studentId, paymentStatus = "paid") {
  const User = mongoose.model("User");

  const existingIndex = this.subscribedStudents.findIndex(
    (s) => s.studentId.toString() === studentId.toString()
  );

  if (existingIndex === -1) {
    this.subscribedStudents.push({ studentId, paymentStatus, subscribedAt: new Date() });
  } else {
    this.subscribedStudents[existingIndex].paymentStatus = paymentStatus;
  }

  await this.save();

  const student = await User.findById(studentId);
  if (student) {
    const courseSubIndex = student.subscribedCourses.findIndex(
      (c) => c.courseId.toString() === this.courseId.toString()
    );

    if (courseSubIndex !== -1) {
      const examIndex = student.subscribedCourses[courseSubIndex].examsPaid.findIndex(
        (e) => e.examId.toString() === this._id.toString()
      );

      if (examIndex === -1) {
        student.subscribedCourses[courseSubIndex].examsPaid.push({
          examId: this._id,
          paymentStatus,
          paidAt: new Date(),
        });
      } else {
        student.subscribedCourses[courseSubIndex].examsPaid[examIndex].paymentStatus = paymentStatus;
        student.subscribedCourses[courseSubIndex].examsPaid[examIndex].paidAt = new Date();
      }

      await student.save();
    }
  }

  return true;
};

// ====================== CHECK STUDENT ACCESS ======================
examSchema.methods.canAccess = function (studentId) {
  return this.subscribedStudents.some(
    (s) => s.studentId.toString() === studentId.toString() && s.paymentStatus === "paid"
  );
};

// ====================== VIRTUAL POPULATE QUESTIONS ======================
examSchema.virtual("examQuestions", {
  ref: "Question",
  localField: "_id",
  foreignField: "examId",
});

// ====================== PRE-SAVE VALIDATION ======================
examSchema.pre("save", async function (next) {
  if (this.questions && this.questions.length > 50) {
    return next(new Error("An exam cannot have more than 50 questions."));
  }
  next();
});

module.exports = mongoose.model("Exam", examSchema);
