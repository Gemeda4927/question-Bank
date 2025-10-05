const mongoose = require('mongoose');

const programSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Program name is required'],
      trim: true
    },
    description: {
      type: String,
      trim: true
    },
    university: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'University',
      required: [true, 'University ID is required']
    },
    level: {
      type: String,
      enum: ['Bachelor', 'Master', 'PhD', 'Diploma', 'Certificate'],
      default: 'Bachelor'
    },
    duration: {
      type: String,
      default: '4 years'
    },
    eligibility: {
      type: String,
      default: 'High School Diploma'
    },
    careerPaths: {
      type: [String],
      default: ['Undecided']
    },
    isFeatured: {
      type: Boolean,
      default: false
    },
    // ================= SUBSCRIPTIONS =================
    subscribers: [
      {
        student: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        subscribedAt: { type: Date, default: Date.now },
        fullAccess: { type: Boolean, default: true } // Full access to program content
      }
    ],
    examAccess: [
      {
        examId: { type: mongoose.Schema.Types.ObjectId, ref: 'Exam' },
        student: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        subscribedAt: { type: Date, default: Date.now }
      }
    ],
    exams: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Exam'
      }
    ],
    isDeleted: {
      type: Boolean,
      default: false
    },
    deletedAt: Date
  },
  { timestamps: true }
);

// Optional: unique index to prevent duplicate program names in same university
programSchema.index({ university: 1, name: 1 }, { unique: true });

// Virtual field to show placeholder if no exams added
programSchema.virtual('examsInfo').get(function () {
  if (!this.exams || this.exams.length === 0) {
    return ['Exams will be uploaded soon'];
  }
  return this.exams;
});

module.exports = mongoose.model('Program', programSchema);
