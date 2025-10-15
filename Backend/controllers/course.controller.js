const Course = require('../models/course.model');
const Program = require('../models/program.model');
const User = require('../models/user.model');
const Exam = require('../models/exam.model');

// ======================== CREATE COURSE ========================
exports.createCourse = async (req, res) => {
  try {
    const {
      name, code, description, programId, creditHours, semester,
      level, price, prerequisites, instructors, exams, subscribedStudents
    } = req.body;

    if (!programId) {
      return res.status(400).json({ status: 'fail', message: 'Program ID is required' });
    }

    const program = await Program.findById(programId);
    if (!program) {
      return res.status(404).json({ status: 'fail', message: 'Program not found' });
    }

    // Validate student IDs and exam IDs if provided
    let validSubscribedStudents = [];
    if (subscribedStudents && Array.isArray(subscribedStudents)) {
      for (const student of subscribedStudents) {
        const exists = await User.findById(student.studentId);
        if (!exists) continue;

        let validExams = [];
        if (student.examsPaid && Array.isArray(student.examsPaid)) {
          for (const examPaid of student.examsPaid) {
            const examExists = await Exam.findById(examPaid.examId);
            if (!examExists) continue;
            validExams.push(examPaid);
          }
        }

        validSubscribedStudents.push({
          ...student,
          examsPaid: validExams
        });
      }
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
      subscribedStudents: validSubscribedStudents || [],
    });

    // Push course into program's courses array
    await Program.findByIdAndUpdate(programId, { $push: { courses: course._id } });

    const populatedCourse = await Course.findById(course._id)
      .populate('programId', 'name code')
      .populate('prerequisites', 'name code')
      .populate('instructors', 'name email')
      .populate('exams', 'name description')
      .populate('subscribedStudents.studentId', 'name email')
      .populate('subscribedStudents.examsPaid.examId', 'name description');

    res.status(201).json({
      status: 'success',
      message: '🎉 Course created successfully!',
      data: populatedCourse
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ status: 'fail', message: 'Course code already exists' });
    }
    res.status(400).json({ status: 'fail', message: error.message });
  }
};

// ======================== GET ALL COURSES ========================
exports.getAllCourses = async (req, res) => {
  try {
    const { page = 1, limit = 10, program, level, semester } = req.query;
    
    const filter = { isDeleted: false };
    if (program) filter.programId = program;
    if (level) filter.level = level;
    if (semester) filter.semester = parseInt(semester);

    const courses = await Course.find(filter)
      .populate('programId', 'name code')
      .populate('prerequisites', 'name code')
      .populate('instructors', 'name email')
      .populate('exams', 'name description')
      .populate('subscribedStudents.studentId', 'name email')
      .populate('subscribedStudents.examsPaid.examId', 'name description')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Course.countDocuments(filter);

    res.status(200).json({
      status: 'success',
      results: courses.length,
      data: courses,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total
      }
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
      .populate('subscribedStudents.studentId', 'name email')
      .populate('subscribedStudents.examsPaid.examId', 'name description');

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
    const course = await Course.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
      .populate('programId', 'name code')
      .populate('prerequisites', 'name code')
      .populate('instructors', 'name email')
      .populate('exams', 'name description')
      .populate('subscribedStudents.studentId', 'name email')
      .populate('subscribedStudents.examsPaid.examId', 'name description');

    if (!course || course.isDeleted) {
      return res.status(404).json({ status: 'fail', message: 'Course not found' });
    }

    res.status(200).json({ status: 'success', message: '✅ Course updated', data: course });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ status: 'fail', message: 'Course code already exists' });
    }
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
    
    if (!course) {
      return res.status(404).json({ status: 'fail', message: 'Course not found' });
    }

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
    
    if (!course) {
      return res.status(404).json({ status: 'fail', message: 'Course not found' });
    }

    res.status(200).json({ status: 'success', message: '♻️ Course restored', data: course });
  } catch (error) {
    res.status(400).json({ status: 'fail', message: error.message });
  }
};

// ======================== HARD DELETE COURSE ========================
exports.hardDeleteCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) {
      return res.status(404).json({ status: 'fail', message: 'Course not found' });
    }

    await Program.findByIdAndUpdate(course.programId, { $pull: { courses: course._id } });

    res.status(200).json({ status: 'success', message: '❌ Course permanently deleted' });
  } catch (error) {
    res.status(400).json({ status: 'fail', message: error.message });
  }
};

// ======================== GET STUDENT COURSES ========================
exports.getStudentCourses = async (req, res) => {
  try {
    const studentId = req.user._id;
    const courses = await Course.find({ "subscribedStudents.studentId": studentId, isDeleted: false })
      .populate('programId', 'name code')
      .populate('exams', 'name description')
      .populate('subscribedStudents.studentId', 'name email')
      .populate('subscribedStudents.examsPaid.examId', 'name description');

    res.status(200).json({
      status: 'success',
      results: courses.length,
      data: courses
    });
  } catch (error) {
    res.status(400).json({ status: 'fail', message: error.message });
  }
};

// ======================== GET COURSE ENROLLMENT STATUS ========================
exports.getEnrollmentStatus = async (req, res) => {
  try {
    const studentId = req.user._id;
    const course = await Course.findById(req.params.id)
      .populate('subscribedStudents.studentId', 'name email')
      .populate('subscribedStudents.examsPaid.examId', 'name description');

    if (!course || course.isDeleted) {
      return res.status(404).json({ status: 'fail', message: 'Course not found' });
    }

    const enrollment = course.subscribedStudents.find(
      s => s.studentId._id.toString() === studentId.toString()
    );

    res.status(200).json({
      status: 'success',
      data: {
        enrolled: !!enrollment,
        enrollment: enrollment || null,
        course: {
          name: course.name,
          code: course.code,
          price: course.price
        }
      }
    });
  } catch (error) {
    res.status(400).json({ status: 'fail', message: error.message });
  }
};
