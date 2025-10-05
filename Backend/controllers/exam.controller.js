const Exam = require('../models/exam.model');

// ====================== CREATE EXAM ======================
exports.createExam = async (req, res) => {
  try {
    const exam = await Exam.create(req.body);

    const populatedExam = await Exam.findById(exam._id)
      .populate({
        path: 'program',
        select: 'name level duration university',
        populate: { path: 'university', select: 'name location' }
      })
      .populate('subscribers.student', 'name email')
      .populate('questions', 'text options');

    res.status(201).json({ success: true, exam: populatedExam });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ====================== GET ALL EXAMS ======================
exports.getAllExams = async (req, res) => {
  try {
    const exams = await Exam.find({ isDeleted: false })
      .populate({
        path: 'program',
        select: 'name level duration university',
        populate: { path: 'university', select: 'name location' }
      })
      .populate('subscribers.student', 'name email')
      .populate('questions', 'text options');

    res.status(200).json({ success: true, count: exams.length, exams });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ====================== GET EXAM BY ID ======================
exports.getExam = async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id)
      .populate({
        path: 'program',
        select: 'name level duration university',
        populate: { path: 'university', select: 'name location' }
      })
      .populate('subscribers.student', 'name email')
      .populate('questions', 'text options');

    if (!exam || exam.isDeleted) {
      return res.status(404).json({ success: false, message: 'Exam not found' });
    }

    const questionsInfo = exam.questions && exam.questions.length > 0
      ? exam.questions
      : ['Questions on the way'];

    res.status(200).json({ success: true, exam: { ...exam.toObject(), questions: questionsInfo } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ====================== UPDATE EXAM ======================
exports.updateExam = async (req, res) => {
  try {
    const exam = await Exam.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    })
      .populate({
        path: 'program',
        select: 'name level duration university',
        populate: { path: 'university', select: 'name location' }
      })
      .populate('subscribers.student', 'name email')
      .populate('questions', 'text options');

    if (!exam || exam.isDeleted) {
      return res.status(404).json({ success: false, message: 'Exam not found' });
    }

    res.status(200).json({ success: true, exam });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ====================== SOFT DELETE EXAM ======================
exports.softDeleteExam = async (req, res) => {
  try {
    const exam = await Exam.findByIdAndUpdate(
      req.params.id,
      { isDeleted: true, deletedAt: Date.now() },
      { new: true }
    );

    if (!exam) return res.status(404).json({ success: false, message: 'Exam not found' });

    res.status(200).json({ success: true, message: 'Exam soft-deleted', exam });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ====================== RESTORE EXAM ======================
exports.restoreExam = async (req, res) => {
  try {
    const exam = await Exam.findByIdAndUpdate(
      req.params.id,
      { isDeleted: false, deletedAt: null },
      { new: true }
    );

    if (!exam) return res.status(404).json({ success: false, message: 'Exam not found' });

    res.status(200).json({ success: true, message: 'Exam restored', exam });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ====================== HARD DELETE EXAM ======================
exports.hardDeleteExam = async (req, res) => {
  try {
    const exam = await Exam.findByIdAndDelete(req.params.id);
    if (!exam) return res.status(404).json({ success: false, message: 'Exam not found' });

    res.status(200).json({ success: true, message: 'Exam permanently deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
