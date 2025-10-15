const mongoose = require("mongoose");

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
    description: { type: String, trim: true },
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
    creditHours: { type: Number, required: true, min: 0 },
    semester: { type: Number, min: 1, max: 12, required: true },
    level: { type: String, enum: ["Bachelor", "Master", "PhD", "Diploma"], default: "Bachelor" },
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
        subscribedAt: { type: Date, default: Date.now },
        examsPaid: [
          {
            examId: { type: mongoose.Schema.Types.ObjectId, ref: "Exam" },
            paymentStatus: {
              type: String,
              enum: ["unpaid", "paid", "pending", "failed"],
              default: "unpaid",
            },
            paidAt: { type: Date },
          },
        ],
      },
    ],
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// ====================== INDEXES ======================
courseSchema.index({ "subscribedStudents.studentId": 1 });
courseSchema.index({ code: 1 });
courseSchema.index({ programId: 1 });
courseSchema.index({ isDeleted: 1 });

module.exports = mongoose.model("Course", courseSchema);
