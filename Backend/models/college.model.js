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
    description: { type: String, trim: true },
    university: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'University',
      required: true
    },
    faculties: [
      { type: mongoose.Schema.Types.ObjectId, ref: 'Faculty', default: [] } 
    ],
    isDeleted: { type: Boolean, default: false },
    deletedAt: Date
  },
  { timestamps: true }
);

// No pre-save hook; faculties array starts empty

module.exports = mongoose.model('College', collegeSchema);
