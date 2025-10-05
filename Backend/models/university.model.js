const mongoose = require('mongoose');
const Program = require('./course.model'); // Your Program model

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
    programs: [
      { type: mongoose.Schema.Types.ObjectId, ref: 'Program' }
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

// Fixed pre-save hook for default program
universitySchema.pre('save', async function (next) {
  try {
    // Only add default program if programs array is empty and this is a new document
    if (this.isNew && (!this.programs || this.programs.length === 0)) {
      // Generate unique course code
      const timestamp = Date.now().toString(36);
      const randomStr = Math.random().toString(36).substring(2, 8);
      const defaultCourseCode = `DEF-${timestamp}-${randomStr}`.toUpperCase();

      // Create default program
      const defaultProgram = await Program.create({
        name: `Default Program - ${this.name}`,
        description: 'Automatically added default program',
        courses: [
          {
            name: 'Introduction to University Studies',
            code: defaultCourseCode,
            credits: 3,
            description: 'Default course for university orientation'
          }
        ],
        university: this._id
      });

      // Add the default program to the university
      this.programs = [defaultProgram._id];
    }
    next();
  } catch (error) {
    console.error('Error creating default program:', error);
    next(error);
  }
});

module.exports = mongoose.model('University', universitySchema);