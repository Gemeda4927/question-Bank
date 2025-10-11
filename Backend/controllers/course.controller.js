const Course = require('../models/course.model');
const Program = require('../models/program.model');

// ======================== CREATE COURSE ========================
exports.createCourse = async (req, res) => {
  try {
    const {
      name,
      code,
      description,
      programId,
      creditHours,
      semester,
      level,
      price,
      prerequisites,
      instructors,
      exams,
      subscribedStudents, // optional on creation
    } = req.body;

    if (!programId) {
      return res.status(400).json({ status: 'fail', message: 'Program ID is required' });
    }

    const course = await Course.create({
      name,
      code,
      description,
      programId,
      creditHours,
      price,
      semester,
      level: level || 'Bachelor',
      prerequisites: prerequisites || [],
      instructors: instructors || [],
      exams: exams || [],
      subscribedStudents: subscribedStudents || [],
    });

    await Program.findByIdAndUpdate(programId, { $push: { courses: course._id } });

    // populate before sending response
    const populatedCourse = await Course.findById(course._id)
      .populate('programId', 'name code')
      .populate('prerequisites', 'name code')
      .populate('instructors', 'name email')
      .populate('exams', 'name description')
      .populate('subscribedStudents.studentId', 'name email');

    res.status(201).json({
      status: 'success',
      message: '🎉 Course created successfully!',
      data: populatedCourse,
    });
  } catch (error) {
    res.status(400).json({ status: 'fail', message: error.message });
  }
};

// ======================== GET ALL COURSES ========================
exports.getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find({ isDeleted: false })
      .populate('programId', 'name code')
      .populate('prerequisites', 'name code')
      .populate('instructors', 'name email')
      .populate('exams', 'name description')
      .populate('subscribedStudents.studentId', 'name email');

    res.status(200).json({
      status: 'success',
      results: courses.length,
      data: courses,
    });
  } catch (error) {
    res.status(400).json({ status: 'fail', message: error.message });
  }
};

// ======================== GET COURSE BY ID ========================
exports.getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('programId', 'name code')
      .populate('prerequisites', 'name code')
      .populate('instructors', 'name email')
      .populate('exams', 'name description')
      .populate('subscribedStudents.studentId', 'name email');

    if (!course || course.isDeleted) {
      return res.status(404).json({ status: 'fail', message: 'Course not found' });
    }

    res.status(200).json({ status: 'success', data: course });
  } catch (error) {
    res.status(400).json({ status: 'fail', message: error.message });
  }
};

// ======================== UPDATE COURSE ========================
exports.updateCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
      .populate('programId', 'name code')
      .populate('prerequisites', 'name code')
      .populate('instructors', 'name email')
      .populate('exams', 'name description')
      .populate('subscribedStudents.studentId', 'name email');

    if (!course || course.isDeleted) {
      return res.status(404).json({ status: 'fail', message: 'Course not found' });
    }

    res.status(200).json({ status: 'success', message: '✅ Course updated', data: course });
  } catch (error) {
    res.status(400).json({ status: 'fail', message: error.message });
  }
};

// ======================== SOFT DELETE COURSE ========================
exports.softDeleteCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(
      req.params.id,
      { isDeleted: true, deletedAt: Date.now() },
      { new: true }
    );

    if (!course) return res.status(404).json({ status: 'fail', message: 'Course not found' });

    res.status(200).json({ status: 'success', message: '🗑️ Course soft-deleted', data: course });
  } catch (error) {
    res.status(400).json({ status: 'fail', message: error.message });
  }
};

// ======================== RESTORE COURSE ========================
exports.restoreCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(
      req.params.id,
      { isDeleted: false, deletedAt: null },
      { new: true }
    );

    if (!course) return res.status(404).json({ status: 'fail', message: 'Course not found' });

    res.status(200).json({ status: 'success', message: '♻️ Course restored', data: course });
  } catch (error) {
    res.status(400).json({ status: 'fail', message: error.message });
  }
};

// ======================== HARD DELETE COURSE ========================
exports.hardDeleteCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) return res.status(404).json({ status: 'fail', message: 'Course not found' });

    await Program.findByIdAndUpdate(course.programId, { $pull: { courses: course._id } });

    res.status(200).json({ status: 'success', message: '❌ Course permanently deleted' });
  } catch (error) {
    res.status(400).json({ status: 'fail', message: error.message });
  }
};
