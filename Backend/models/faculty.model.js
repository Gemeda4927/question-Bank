const mongoose = require('mongoose');

const facultySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Faculty name is required'],
      trim: true
    },
    code: {
      type: String,
      required: [true, 'Faculty code is required'],
      unique: true,
      trim: true
    },
    description: { type: String, trim: true },
    college: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'College',
      required: true
    },
    programs: [
      { type: mongoose.Schema.Types.ObjectId, ref: 'Program', default: [] }
    ],
    type: {
      type: String,
      enum: ['Undergraduate', 'Postgraduate', 'Diploma', 'Certificate'],
      default: 'Undergraduate'
    },
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Faculty', facultySchema);
