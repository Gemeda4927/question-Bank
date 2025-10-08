const mongoose = require('mongoose');

const universitySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'University name is required'],
      unique: true,
      trim: true
    },
    location: { type: String, trim: true },
    logo: { type: String, default: null },
    description: { type: String, trim: true },
    type: {
      type: String,
      enum: ['Public', 'Private'],
      default: 'Public'
    },
    mode: {
      type: String,
      enum: ['Sync', 'Async'],
      default: 'Sync'
    },
    colleges: [
      { type: mongoose.Schema.Types.ObjectId, ref: 'College', default: [] }
    ],
    ratings: {
      average: { type: Number, default: 0 },
      count: { type: Number, default: 0 }
    },
    isDeleted: { type: Boolean, default: false },
    deletedAt: Date
  },
  { timestamps: true }
);


module.exports = mongoose.model('University', universitySchema);
