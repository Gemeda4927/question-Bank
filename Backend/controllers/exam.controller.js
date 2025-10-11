const Exam = require('../models/exam.model');
const Course = require('../models/course.model');
const User = require('../models/user.model');
const Question = require('../models/question.model');

// ======================== CREATE EXAM ========================
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
      questions = [], // optional question IDs
    } = req.body;

    if (!courseId) return res.status(400).json({ status: 'fail', message: 'Course ID is required' });

    // Create exam
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

    // Push exam to course's exams array
    await Course.findByIdAndUpdate(courseId, { $push: { exams: exam._id } });

    res.status(201).json({ status: 'success', message: '🎉 Exam created successfully!', data: exam });
  } catch (error) {
    res.status(400).json({ status: 'fail', message: error.message });
  }
};

// ======================== GET ALL EXAMS ========================
exports.getAllExams = async (req, res) => {
  try {
    const exams = await Exam.find({ isDeleted: false })
      .populate('courseId', 'name code')
      .populate({
        path: 'questions',
        select: 'text type marks options', // Include all relevant fields
      })
      .populate('subscribedStudents.studentId', 'name email');

    res.status(200).json({ status: 'success', results: exams.length, data: exams });
  } catch (error) {
    res.status(400).json({ status: 'fail', message: error.message });
  }
};

// ======================== GET EXAM BY ID ========================
exports.getExamById = async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id)
      .populate('courseId', 'name code')
      .populate({
        path: 'questions',
        select: 'text type marks options',
      })
      .populate('subscribedStudents.studentId', 'name email');

    if (!exam || exam.isDeleted) return res.status(404).json({ status: 'fail', message: 'Exam not found' });

    res.status(200).json({ status: 'success', data: exam });
  } catch (error) {
    res.status(400).json({ status: 'fail', message: error.message });
  }
};

// ======================== UPDATE EXAM ========================
exports.updateExam = async (req, res) => {
  try {
    const exam = await Exam.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

    if (!exam || exam.isDeleted) return res.status(404).json({ status: 'fail', message: 'Exam not found' });

    res.status(200).json({ status: 'success', message: '✅ Exam updated', data: exam });
  } catch (error) {
    res.status(400).json({ status: 'fail', message: error.message });
  }
};

// ======================== SOFT DELETE EXAM ========================
exports.softDeleteExam = async (req, res) => {
  try {
    const exam = await Exam.findByIdAndUpdate(req.params.id, { isDeleted: true }, { new: true });

    if (!exam) return res.status(404).json({ status: 'fail', message: 'Exam not found' });

    // Remove from course's exams array
    await Course.findByIdAndUpdate(exam.courseId, { $pull: { exams: exam._id } });

    res.status(200).json({ status: 'success', message: '🗑️ Exam soft-deleted', data: exam });
  } catch (error) {
    res.status(400).json({ status: 'fail', message: error.message });
  }
};

// ======================== RESTORE EXAM ========================
exports.restoreExam = async (req, res) => {
  try {
    const exam = await Exam.findByIdAndUpdate(req.params.id, { isDeleted: false }, { new: true });

    if (!exam) return res.status(404).json({ status: 'fail', message: 'Exam not found' });

    // Re-add to course exams array if not present
    await Course.findByIdAndUpdate(exam.courseId, { $addToSet: { exams: exam._id } });

    res.status(200).json({ status: 'success', message: '♻️ Exam restored', data: exam });
  } catch (error) {
    res.status(400).json({ status: 'fail', message: error.message });
  }
};

// ======================== HARD DELETE EXAM ========================
exports.hardDeleteExam = async (req, res) => {
  try {
    const exam = await Exam.findByIdAndDelete(req.params.id);
    if (!exam) return res.status(404).json({ status: 'fail', message: 'Exam not found' });

    // Remove from course's exams array
    await Course.findByIdAndUpdate(exam.courseId, { $pull: { exams: exam._id } });

    res.status(200).json({ status: 'success', message: '❌ Exam permanently deleted' });
  } catch (error) {
    res.status(400).json({ status: 'fail', message: error.message });
  }
};

// ======================== SUBSCRIBE STUDENT TO EXAM ========================
exports.subscribeStudentToExam = async (req, res) => {
  try {
    const { examId, studentId, paymentStatus = 'paid' } = req.body;

    const exam = await Exam.findById(examId);
    if (!exam || exam.isDeleted) return res.status(404).json({ status: 'fail', message: 'Exam not found' });

    const student = await User.findById(studentId);
    if (!student) return res.status(404).json({ status: 'fail', message: 'Student not found' });

    // Check if already subscribed
    const alreadySubscribed = exam.subscribedStudents.some(s => s.studentId.toString() === studentId);
    if (!alreadySubscribed) {
      exam.subscribedStudents.push({ studentId, paymentStatus });
      await exam.save();
    }

    res.status(200).json({
      status: 'success',
      message: `🎉 Student ${student.name} subscribed to exam ${exam.name}`,
      data: { examId: exam._id, studentId: student._id, paymentStatus },
    });
  } catch (error) {
    res.status(400).json({ status: 'fail', message: error.message });
  }
};

// ======================== CHECK STUDENT ACCESS TO EXAM ========================
exports.checkExamAccess = async (req, res) => {
  try {
    const { examId, studentId } = req.body;

    const exam = await Exam.findById(examId);
    if (!exam || exam.isDeleted) return res.status(404).json({ status: 'fail', message: 'Exam not found' });

    const hasAccess = exam.subscribedStudents.some(s => s.studentId.toString() === studentId && s.paymentStatus === 'paid');

    res.status(200).json({
      status: 'success',
      data: { hasAccess },
      message: hasAccess ? '✅ Student has access to this exam' : '❌ Student does not have access',
    });
  } catch (error) {
    res.status(400).json({ status: 'fail', message: error.message });
  }
};

// ======================== GET EXAM QUESTIONS ========================
exports.getExamQuestions = async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id)
      .populate({
        path: 'questions',
        select: 'text type marks options',
      });

    if (!exam || exam.isDeleted) return res.status(404).json({ status: 'fail', message: 'Exam not found' });

    res.status(200).json({ status: 'success', data: exam.questions });
  } catch (error) {
    res.status(400).json({ status: 'fail', message: error.message });
  }
};
