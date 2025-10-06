const mongoose = require('mongoose');
const Department = require('./department.model');

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
    departments: [
      { type: mongoose.Schema.Types.ObjectId, ref: 'Department' }
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

// Pre-save hook for default department
universitySchema.pre('save', async function (next) {
  try {
    if (this.isNew && (!this.departments || this.departments.length === 0)) {
      const timestamp = Date.now().toString(36);
      const randomStr = Math.random().toString(36).substring(2, 8);
      const defaultDeptCode = `DEF-${timestamp}-${randomStr}`.toUpperCase();

      const defaultDepartment = await Department.create({
        name: `Default Department - ${this.name}`,
        code: defaultDeptCode,
        description: 'Automatically added default department',
        university: this._id
      });

      this.departments = [defaultDepartment._id];
    }
    next();
  } catch (error) {
    console.error('Error creating default department:', error);
    next(error);
  }
});

module.exports = mongoose.model('University', universitySchema);
