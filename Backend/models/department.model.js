const mongoose = require('mongoose');

const departmentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Department name is required'],
      trim: true
    },
    code: {
      type: String,
      required: true,
      unique: true
    },
    description: {
      type: String,
      trim: true
    },
    university: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'University',
      required: true
    },
    programs: [
      { type: mongoose.Schema.Types.ObjectId, ref: 'Program' } 
    ],
    isDeleted: { type: Boolean, default: false },
    deletedAt: Date
  },
  { timestamps: true }
);

module.exports = mongoose.model('Department', departmentSchema);
