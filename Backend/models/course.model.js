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
    courses: [{
      name: {
        type: String,
        required: [true, 'Course name is required'],
        trim: true
      },
      code: {
        type: String,
        required: [true, 'Course code is required'],
        trim: true,
        uppercase: true
      },
      description: {
        type: String,
        trim: true
      },
      credits: {
        type: Number,
        default: 3,
        min: [1, 'Credits must be at least 1'],
        max: [10, 'Credits cannot exceed 10']
      },
      isDeleted: {
        type: Boolean,
        default: false
      },
      deletedAt: Date
    }],
    isDeleted: {
      type: Boolean,
      default: false
    },
    deletedAt: Date
  },
  { timestamps: true }
);

// Sparse unique index for course codes
programSchema.index({ 'courses.code': 1 }, { 
  unique: true, 
  sparse: true
});

// Pre-save middleware to validate course codes
programSchema.pre('save', function(next) {
  if (this.isModified('courses')) {
    const courseCodes = new Set();
    
    for (const course of this.courses) {
      if (course.code && !course.isDeleted) {
        const normalizedCode = course.code.trim().toUpperCase();
        if (courseCodes.has(normalizedCode)) {
          return next(new Error(`Duplicate course code found: ${normalizedCode}`));
        }
        courseCodes.add(normalizedCode);
        course.code = normalizedCode;
      }
    }
  }
  next();
});

module.exports = mongoose.model('Program', programSchema);