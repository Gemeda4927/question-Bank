const mongoose = require('mongoose');

const collegeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'College name is required'],
      trim: true
    },
    code: {
      type: String,
      required: [true, 'College code is required'],
      unique: true,
      trim: true
    },
     price: {
      type: Number,
      required: [true, 'Course price is required'],
      min: [1, 'Course price must be greater than 0']
    },

    description: { type: String, trim: true },
    university: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'University',
      required: true
    },
    faculties: [
      { type: mongoose.Schema.Types.ObjectId, ref: 'Faculty', default: [] } // empty by default
    ],
    isDeleted: { type: Boolean, default: false },
    deletedAt: Date
  },
  { timestamps: true }
);

// No pre-save hook; faculties array starts empty

module.exports = mongoose.model('College', collegeSchema);
