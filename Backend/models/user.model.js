const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
const crypto = require("crypto")

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide your name"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Please provide your email"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
      minlength: 6,
      select: false,
    },
    role: {
      type: String,
      enum: ["student", "admin", "instructor"],
      default: "student",
    },
    subscribedCourses: [
      {
        courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
        paymentStatus: {
          type: String,
          enum: ["unpaid", "paid", "pending", "failed"],
          default: "unpaid",
        },
        subscribedAt: { type: Date, default: Date.now },
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
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  { timestamps: true },
)

// ====================== PASSWORD HASHING ======================
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next()
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
  next()
})

// ====================== MATCH PASSWORD ======================
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password)
}

// ====================== PASSWORD RESET TOKEN ======================
userSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex")
  this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex")
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000 // 10 minutes
  return resetToken
}

// ====================== CHECK COURSE ACCESS ======================
userSchema.methods.hasAccessToCourse = function (courseId) {
  const sub = this.subscribedCourses.find((c) => c.courseId.toString() === courseId.toString())
  return sub ? sub.paymentStatus === "paid" : false
}

// ====================== CHECK EXAM ACCESS ======================
userSchema.methods.hasAccessToExam = function (courseId, examId) {
  const sub = this.subscribedCourses.find((c) => c.courseId.toString() === courseId.toString())
  if (!sub) return false

  // Full course paid grants access to all exams
  if (sub.paymentStatus === "paid") return true

  // Otherwise, check exam payment
  return sub.examsPaid.some((e) => e.examId.toString() === examId.toString() && e.paymentStatus === "paid")
}

// ====================== SUBSCRIBE TO COURSE ======================
userSchema.methods.subscribeToCourse = async function (courseId, paymentStatus = "paid") {
  const Course = mongoose.model("Course")
  const course = await Course.findById(courseId)
  if (!course) throw new Error("Course not found")

  const existingSubIndex = this.subscribedCourses.findIndex((c) => c.courseId.toString() === courseId.toString())

  if (existingSubIndex === -1) {
    this.subscribedCourses.push({ courseId, paymentStatus, subscribedAt: new Date() })
  } else {
    // Update existing subscription
    this.subscribedCourses[existingSubIndex].paymentStatus = paymentStatus
  }

  await this.save()

  // Update Course subscribedStudents array
  const studentIndex = course.subscribedStudents.findIndex((s) => s.studentId.toString() === this._id.toString())

  if (studentIndex === -1) {
    course.subscribedStudents.push({
      studentId: this._id,
      coursePaymentStatus: paymentStatus,
      examsPaid: [],
    })
  } else {
    course.subscribedStudents[studentIndex].coursePaymentStatus = paymentStatus
  }

  await course.save()

  return true
}

// ====================== SUBSCRIBE TO EXAM ======================
userSchema.methods.subscribeToExam = async function (courseId, examId, paymentStatus = "paid") {
  const Course = mongoose.model("Course")
  const course = await Course.findById(courseId)
  if (!course) throw new Error("Course not found")

  const subIndex = this.subscribedCourses.findIndex((c) => c.courseId.toString() === courseId.toString())

  if (subIndex === -1) {
    this.subscribedCourses.push({
      courseId,
      paymentStatus: "unpaid",
      examsPaid: [{ examId, paymentStatus, paidAt: new Date() }],
    })
  } else {
    const examIndex = this.subscribedCourses[subIndex].examsPaid.findIndex(
      (e) => e.examId.toString() === examId.toString(),
    )

    if (examIndex === -1) {
      this.subscribedCourses[subIndex].examsPaid.push({
        examId,
        paymentStatus,
        paidAt: new Date(),
      })
    } else {
      this.subscribedCourses[subIndex].examsPaid[examIndex].paymentStatus = paymentStatus
      this.subscribedCourses[subIndex].examsPaid[examIndex].paidAt = new Date()
    }
  }

  await this.save()

  // Update course subscribedStudents examsPaid
  const courseSubIndex = course.subscribedStudents.findIndex((s) => s.studentId.toString() === this._id.toString())

  if (courseSubIndex === -1) {
    course.subscribedStudents.push({
      studentId: this._id,
      coursePaymentStatus: "unpaid",
      examsPaid: [{ examId, paymentStatus, paidAt: new Date() }],
    })
  } else {
    const examIndex = course.subscribedStudents[courseSubIndex].examsPaid.findIndex(
      (e) => e.examId.toString() === examId.toString(),
    )

    if (examIndex === -1) {
      course.subscribedStudents[courseSubIndex].examsPaid.push({
        examId,
        paymentStatus,
        paidAt: new Date(),
      })
    } else {
      course.subscribedStudents[courseSubIndex].examsPaid[examIndex].paymentStatus = paymentStatus
      course.subscribedStudents[courseSubIndex].examsPaid[examIndex].paidAt = new Date()
    }
  }

  await course.save()

  return true
}

module.exports = mongoose.model("User", userSchema)
