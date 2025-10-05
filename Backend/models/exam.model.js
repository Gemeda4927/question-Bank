const mongoose = require('mongoose');

const examSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Exam name is required'],
      trim: true
    },
    description: {
      type: String,
      trim: true
    },
    program: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Program',
      required: [true, 'Program ID is required']
    },
    examType: {
      type: String,
      enum: [
        'Regular',
        'Mock',
        'Final',
        'Mid Exam',
        'COC Exam',
        'Exit Exam',
        'University Entrance Exam'
      ],
      default: 'Regular'
    },
    totalMarks: {
      type: Number,
      default: 100
    },
    passingMarks: {
      type: Number,
      default: 50
    },
    duration: {
      type: String,
      default: '2 hours',
      trim: true
    },
    schedule: {
      startTime: Date,
      endTime: Date
    },
    isPublished: {
      type: Boolean,
      default: false
    },
    accessType: {
      type: String,
      enum: ['SubscribedOnly', 'Free', 'ExamBased'],
      default: 'SubscribedOnly'
    },
    subscribers: [
      {
        student: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        subscribedAt: { type: Date, default: Date.now }
      }
    ],
    questions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question'
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

// Unique index to prevent duplicate exam names in the same program
examSchema.index({ program: 1, name: 1 }, { unique: true });

// Virtual field to return placeholder if no questions
examSchema.virtual('questionsInfo').get(function () {
  if (!this.questions || this.questions.length === 0) {
    return ['Questions on the way'];
  }
  return this.questions;
});

module.exports = mongoose.model('Exam', examSchema);
