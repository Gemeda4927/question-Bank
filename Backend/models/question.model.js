const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema(
  {
    exam: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Exam',
      required: [true, 'Exam ID is required']
    },
    questionText: {
      type: String,
      required: [true, 'Question text is required'],
      trim: true
    },
    questionType: {
      type: String,
      enum: ['MCQ', 'TrueFalse', 'Descriptive'],
      default: 'MCQ'
    },
    options: [
      {
        optionText: { type: String, trim: true },
        isCorrect: { type: Boolean, default: false }
      }
    ],
    marks: {
      type: Number,
      default: 1,
      min: [0, 'Marks cannot be negative']
    },
    image: {
      type: String, // URL or path to the image
      default: null
    },
    isDeleted: {
      type: Boolean,
      default: false
    },
    deletedAt: Date
  },
  { timestamps: true }
);

// Optional: unique index to prevent duplicate questions for same exam
questionSchema.index({ exam: 1, questionText: 1 }, { unique: true });

module.exports = mongoose.model('Question', questionSchema);
