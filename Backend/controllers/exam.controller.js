// controllers/exam.controller.js

const Exam = require('../models/exam.model');
const Course = require('../models/course.model');
const User = require('../models/user.model');
const Question = require('../models/question.model');

/* ============================================================
   📘 CREATE EXAM
============================================================ */
exports.createExam = async (req, res) => {
  try {
    const {
      name,
      code,
      courseId,
      type = 'final',
      description,
      date,
      duration,
      totalMarks,
      passingMarks,
      questions = [], // Optional question IDs
    } = req.body;

    if (!courseId) {
      return res.status(400).json({
        status: 'fail',
        message: 'Course ID is required.',
      });
    }

    // Create new exam
    const exam = await Exam.create({
      name,
      code,
      courseId,
      type,
      description,
      date,
      duration,
      totalMarks,
      passingMarks,
      questions,
    });

    // Link exam to the corresponding course
    await Course.findByIdAndUpdate(courseId, { $push: { exams: exam._id } });

    // Populate related course and question data
    const populatedExam = await Exam.findById(exam._id)
      .populate('courseId', 'name code')
      .populate({
        path: 'questions',
        select: 'text type marks options correctAnswer imageUrl category',
      });

    res.status(201).json({
      status: 'success',
      message: '🎉 Exam created successfully!',
      data: populatedExam,
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

/* ============================================================
   📋 GET ALL EXAMS
============================================================ */
exports.getAllExams = async (req, res) => {
  try {
    const exams = await Exam.find({ isDeleted: false })
      .populate('courseId', 'name code')
      .populate({
        path: 'questions',
        select: 'text type marks options correctAnswer imageUrl category',
      })
      .populate('subscribedStudents.studentId', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      status: 'success',
      results: exams.length,
      data: exams,
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

/* ============================================================
   🔍 GET EXAM BY ID
============================================================ */
exports.getExamById = async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id)
      .populate('courseId', 'name code')
      .populate({
        path: 'questions',
        select: 'text type marks options correctAnswer imageUrl category',
      })
      .populate('subscribedStudents.studentId', 'name email');

    if (!exam || exam.isDeleted) {
      return res.status(404).json({ status: 'fail', message: 'Exam not found.' });
    }

    res.status(200).json({
      status: 'success',
      data: exam,
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

/* ============================================================
   ✏️ UPDATE EXAM
============================================================ */
exports.updateExam = async (req, res) => {
  try {
    const updates = { ...req.body };

    const exam = await Exam.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    })
      .populate('courseId', 'name code')
      .populate({
        path: 'questions',
        select: 'text type marks options correctAnswer imageUrl category',
      });

    if (!exam || exam.isDeleted) {
      return res.status(404).json({ status: 'fail', message: 'Exam not found.' });
    }

    res.status(200).json({
      status: 'success',
      message: '✅ Exam updated successfully!',
      data: exam,
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

/* ============================================================
   🗑️ SOFT DELETE EXAM
============================================================ */
exports.softDeleteExam = async (req, res) => {
  try {
    const exam = await Exam.findByIdAndUpdate(req.params.id, { isDeleted: true }, { new: true });

    if (!exam) {
      return res.status(404).json({ status: 'fail', message: 'Exam not found.' });
    }

    await Course.findByIdAndUpdate(exam.courseId, { $pull: { exams: exam._id } });

    res.status(200).json({
      status: 'success',
      message: '🗑️ Exam soft-deleted successfully.',
      data: exam,
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

/* ============================================================
   ♻️ RESTORE EXAM
============================================================ */
exports.restoreExam = async (req, res) => {
  try {
    const exam = await Exam.findByIdAndUpdate(req.params.id, { isDeleted: false }, { new: true });

    if (!exam) {
      return res.status(404).json({ status: 'fail', message: 'Exam not found.' });
    }

    await Course.findByIdAndUpdate(exam.courseId, { $addToSet: { exams: exam._id } });

    res.status(200).json({
      status: 'success',
      message: '♻️ Exam restored successfully!',
      data: exam,
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

/* ============================================================
   ❌ HARD DELETE EXAM
============================================================ */
exports.hardDeleteExam = async (req, res) => {
  try {
    const exam = await Exam.findByIdAndDelete(req.params.id);

    if (!exam) {
      return res.status(404).json({ status: 'fail', message: 'Exam not found.' });
    }

    // Clean up course reference
    await Course.findByIdAndUpdate(exam.courseId, { $pull: { exams: exam._id } });

    // Optional cascading delete
    // await Question.deleteMany({ examId: exam._id });

    res.status(200).json({
      status: 'success',
      message: '❌ Exam permanently deleted.',
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

/* ============================================================
   🎓 SUBSCRIBE STUDENT TO EXAM
============================================================ */
exports.subscribeStudentToExam = async (req, res) => {
  try {
    const { examId, studentId, paymentStatus = 'paid' } = req.body;

    const exam = await Exam.findById(examId);
    if (!exam || exam.isDeleted) {
      return res.status(404).json({ status: 'fail', message: 'Exam not found.' });
    }

    const student = await User.findById(studentId);
    if (!student) {
      return res.status(404).json({ status: 'fail', message: 'Student not found.' });
    }

    // Check if already subscribed
    const alreadySubscribed = exam.subscribedStudents.some(
      (s) => s.studentId.toString() === studentId
    );

    if (!alreadySubscribed) {
      exam.subscribedStudents.push({ studentId, paymentStatus });
      await exam.save();
    }

    res.status(200).json({
      status: 'success',
      message: `🎉 ${student.name} subscribed to ${exam.name}`,
      data: { examId: exam._id, studentId: student._id, paymentStatus },
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

/* ============================================================
   🔐 CHECK STUDENT ACCESS
============================================================ */
exports.checkExamAccess = async (req, res) => {
  try {
    const { examId, studentId } = req.body;

    const exam = await Exam.findById(examId);
    if (!exam || exam.isDeleted) {
      return res.status(404).json({ status: 'fail', message: 'Exam not found.' });
    }

    const hasAccess = exam.subscribedStudents.some(
      (s) => s.studentId.toString() === studentId && s.paymentStatus === 'paid'
    );

    res.status(200).json({
      status: 'success',
      data: { hasAccess },
      message: hasAccess
        ? '✅ Student has access to this exam.'
        : '❌ Student does not have access.',
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

/* ============================================================
   🧠 GET EXAM QUESTIONS
============================================================ */
exports.getExamQuestions = async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id).populate({
      path: 'questions',
      select: 'text type marks options correctAnswer imageUrl category',
    });

    if (!exam || exam.isDeleted) {
      return res.status(404).json({ status: 'fail', message: 'Exam not found.' });
    }

    res.status(200).json({
      status: 'success',
      message: `🧠 ${exam.questions.length} questions found for ${exam.name}`,
      data: exam.questions,
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};
