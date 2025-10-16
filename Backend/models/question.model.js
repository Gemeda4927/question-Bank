const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema(
  {
    examId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Exam',
      required: [true, 'Question must belong to an exam'],
    },
    text: {
      type: String,
      required: [true, 'Question text is required'],
      trim: true,
    },
    type: {
      type: String,
      enum: ['multiple-choice', 'true-false', 'short-answer'],
      default: 'multiple-choice',
    },
    options: {
      type: [String],
      default: [],
    },
    correctAnswer: {
      type: String,
      trim: true,
      default: '',
    },
    marks: {
      type: Number,
      default: 1,
    },
    category: {
      type: String,
      trim: true,
      default: '',
    },
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
      default: 'easy',
    },
    tags: {
      type: [String],
      default: [],
    },
    timeLimit: {
      type: Number, // in seconds
      default: 0,
    },
    hints: {
      type: [String],
      default: [],
    },
    explanation: {
      type: String,
      trim: true,
      default: '',
    },
    shuffleOptions: {
      type: Boolean,
      default: false,
    },
    reference: {
      type: String,
      trim: true,
      default: '',
    },
    imageUrl: {
      type: String,
      trim: true,
      default: '',
    },
  },
  { timestamps: true }
);

// UNIQUE INDEX: prevent duplicate questions for same exam
questionSchema.index({ examId: 1, text: 1 }, { unique: true });

module.exports = mongoose.model('Question', questionSchema);
