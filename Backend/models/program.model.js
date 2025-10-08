const mongoose = require('mongoose');

const programSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Program name is required'],
      trim: true
    },
    code: {
      type: String,
      required: [true, 'Program code is required'],
      unique: true,
      trim: true
    },
    description: {
      type: String,
      trim: true
    },
    faculty: {  // changed from departmentId to faculty for hierarchy
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Faculty',
      required: true
    },
    courses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course'
      }
    ],
    students: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    ],
    type: {
      type: String,
      enum: ['Undergraduate', 'Postgraduate', 'Diploma', 'Certificate'],
      default: 'Undergraduate'
    },
    level: {
      type: String,
      enum: ['1', '2', '3', '4', '5', '6'],
      default: '1'
    },
    isDeleted: {
      type: Boolean,
      default: false
    },
    deletedAt: {
      type: Date,
      default: null
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Program', programSchema);
