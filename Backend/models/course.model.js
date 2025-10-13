const mongoose = require("mongoose")

const courseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Course name is required"],
      trim: true,
    },
    code: {
      type: String,
      required: [true, "Course code is required"],
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
      required: [true, "Course price is required"],
      min: [1, "Course price must be greater than 0"],
    },
    programId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Program",
      required: [true, "Course must belong to a program"],
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
      enum: ["Bachelor", "Master", "PhD", "Diploma"],
      default: "Bachelor",
    },
    prerequisites: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],
    instructors: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    exams: [{ type: mongoose.Schema.Types.ObjectId, ref: "Exam" }],
    subscribedStudents: [
      {
        studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        coursePaymentStatus: {
          type: String,
          enum: ["unpaid", "paid", "pending", "failed"],
          default: "unpaid",
        },
        examsPaid: [
          {
            examId: { type: mongoose.Schema.Types.ObjectId, ref: "Exam" },
            paymentStatus: {
              type: String,
              enum: ["unpaid", "paid", "pending", "failed"],
              default: "unpaid",
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
  { timestamps: true },
)

// ====================== METHODS ======================

courseSchema.methods.addStudent = async function (userId, paymentStatus = "paid") {
  const User = mongoose.model("User")

  const studentIndex = this.subscribedStudents.findIndex((s) => s.studentId.toString() === userId.toString())

  if (studentIndex === -1) {
    this.subscribedStudents.push({
      studentId: userId,
      coursePaymentStatus: paymentStatus,
      examsPaid: [],
    })
  } else {
    this.subscribedStudents[studentIndex].coursePaymentStatus = paymentStatus
  }

  await this.save()

  const user = await User.findById(userId)
  if (!user) throw new Error("User not found")

  const subCourseIndex = user.subscribedCourses.findIndex((c) => c.courseId.toString() === this._id.toString())

  if (subCourseIndex === -1) {
    user.subscribedCourses.push({
      courseId: this._id,
      paymentStatus,
      subscribedAt: new Date(),
      examsPaid: [],
    })
  } else {
    user.subscribedCourses[subCourseIndex].paymentStatus = paymentStatus
  }

  await user.save()

  return true
}

courseSchema.methods.addExamPayment = async function (userId, examId, paymentStatus = "paid") {
  const User = mongoose.model("User")
  const user = await User.findById(userId)
  if (!user) throw new Error("User not found")

  // Update Course
  const studentIndex = this.subscribedStudents.findIndex((s) => s.studentId.toString() === userId.toString())

  if (studentIndex === -1) {
    this.subscribedStudents.push({
      studentId: userId,
      coursePaymentStatus: "unpaid",
      examsPaid: [{ examId, paymentStatus, paidAt: new Date() }],
    })
  } else {
    const examIndex = this.subscribedStudents[studentIndex].examsPaid.findIndex(
      (e) => e.examId.toString() === examId.toString(),
    )

    if (examIndex === -1) {
      this.subscribedStudents[studentIndex].examsPaid.push({
        examId,
        paymentStatus,
        paidAt: new Date(),
      })
    } else {
      this.subscribedStudents[studentIndex].examsPaid[examIndex].paymentStatus = paymentStatus
      this.subscribedStudents[studentIndex].examsPaid[examIndex].paidAt = new Date()
    }
  }

  await this.save()

  // Update User
  const subCourseIndex = user.subscribedCourses.findIndex((c) => c.courseId.toString() === this._id.toString())

  if (subCourseIndex === -1) {
    user.subscribedCourses.push({
      courseId: this._id,
      paymentStatus: "unpaid",
      examsPaid: [{ examId, paymentStatus, paidAt: new Date() }],
    })
  } else {
    const examIndex = user.subscribedCourses[subCourseIndex].examsPaid.findIndex(
      (e) => e.examId.toString() === examId.toString(),
    )

    if (examIndex === -1) {
      user.subscribedCourses[subCourseIndex].examsPaid.push({
        examId,
        paymentStatus,
        paidAt: new Date(),
      })
    } else {
      user.subscribedCourses[subCourseIndex].examsPaid[examIndex].paymentStatus = paymentStatus
      user.subscribedCourses[subCourseIndex].examsPaid[examIndex].paidAt = new Date()
    }
  }

  await user.save()

  return true
}

// Check if student can access course or exam
courseSchema.methods.canAccess = function (userId, examId = null) {
  const student = this.subscribedStudents.find((s) => s.studentId.toString() === userId.toString())
  if (!student) return false

  if (student.coursePaymentStatus === "paid") return true

  if (examId) {
    return student.examsPaid.some((e) => e.examId.toString() === examId.toString() && e.paymentStatus === "paid")
  }

  return false
}

module.exports = mongoose.model("Course", courseSchema)
