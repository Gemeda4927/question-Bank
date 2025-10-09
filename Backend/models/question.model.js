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
    options: [
      {
        type: String,
      },
    ],
    correctAnswer: {
      type: String,
      required: function () {
        return this.type !== 'short-answer';
      },
    },
    marks: {
      type: Number,
      default: 1,
      min: 0,
    },
    category: {
      type: String,
      trim: true,
    },
    imageUrl: {
      type: String, 
      trim: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Question', questionSchema);
