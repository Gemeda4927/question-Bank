const mongoose = require('mongoose');

const programSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Program name is required'],
      trim: true,
    },
    code: {
      type: String,
      required: [true, 'Program code is required'],
      unique: true,
    },
    description: {
      type: String,
      trim: true,
    },
    departmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Department',
      required: true,
    },
    courses: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Course', 
        },
      ],
      default: null, 
    },
    students: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
        default: [], 
      },
    ],
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Program', programSchema);
