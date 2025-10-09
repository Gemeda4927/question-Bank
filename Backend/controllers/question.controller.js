const Question = require('../models/question.model');
const Exam = require('../models/exam.model');

// ======================== CREATE QUESTION ========================
exports.createQuestion = async (req, res) => {
  try {
    const { examId, text, type, options, correctAnswer, marks, category } = req.body;

    if (!examId) return res.status(400).json({ status: 'fail', message: 'Exam ID is required' });

    const imageUrl = req.file ? req.file.path : undefined; 

    const question = await Question.create({
      examId,
      text,
      type,
      options,
      correctAnswer,
      marks,
      category,
      imageUrl,
    });

    const exam = await Exam.findById(examId);
    if (exam) {
      exam.questions = exam.questions || [];
      exam.questions.push(question._id);
      await exam.save();
    }

    res.status(201).json({ status: 'success', message: '🎉 Question created successfully!', data: question });
  } catch (error) {
    res.status(400).json({ status: 'fail', message: error.message });
  }
};


// ======================== GET ALL QUESTIONS ========================
exports.getAllQuestions = async (req, res) => {
  try {
    const questions = await Question.find({ isDeleted: false })
      .populate('examId', 'name code');
    res.status(200).json({ status: 'success', results: questions.length, data: questions });
  } catch (error) {
    res.status(400).json({ status: 'fail', message: error.message });
  }
};

// ======================== GET QUESTION BY ID ========================
exports.getQuestionById = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id)
      .populate('examId', 'name code');

    if (!question || question.isDeleted) return res.status(404).json({ status: 'fail', message: 'Question not found' });

    res.status(200).json({ status: 'success', data: question });
  } catch (error) {
    res.status(400).json({ status: 'fail', message: error.message });
  }
};

// ======================== UPDATE QUESTION ========================
exports.updateQuestion = async (req, res) => {
  try {
    const updates = { ...req.body };
    if (req.file) updates.imageUrl = req.file.path; 

    const question = await Question.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });

    if (!question || question.isDeleted) return res.status(404).json({ status: 'fail', message: 'Question not found' });

    res.status(200).json({ status: 'success', message: '✅ Question updated', data: question });
  } catch (error) {
    res.status(400).json({ status: 'fail', message: error.message });
  }
};

// ======================== SOFT DELETE QUESTION ========================
exports.softDeleteQuestion = async (req, res) => {
  try {
    const question = await Question.findByIdAndUpdate(req.params.id, { isDeleted: true }, { new: true });
    if (!question) return res.status(404).json({ status: 'fail', message: 'Question not found' });

    res.status(200).json({ status: 'success', message: '🗑️ Question soft-deleted', data: question });
  } catch (error) {
    res.status(400).json({ status: 'fail', message: error.message });
  }
};

// ======================== RESTORE QUESTION ========================
exports.restoreQuestion = async (req, res) => {
  try {
    const question = await Question.findByIdAndUpdate(req.params.id, { isDeleted: false }, { new: true });
    if (!question) return res.status(404).json({ status: 'fail', message: 'Question not found' });

    res.status(200).json({ status: 'success', message: '♻️ Question restored', data: question });
  } catch (error) {
    res.status(400).json({ status: 'fail', message: error.message });
  }
};

// ======================== HARD DELETE QUESTION ========================
exports.hardDeleteQuestion = async (req, res) => {
  try {
    const question = await Question.findByIdAndDelete(req.params.id);
    if (!question) return res.status(404).json({ status: 'fail', message: 'Question not found' });

    if (question.examId) {
      await Exam.findByIdAndUpdate(question.examId, { $pull: { questions: question._id } });
    }

    res.status(200).json({ status: 'success', message: '❌ Question permanently deleted' });
  } catch (error) {
    res.status(400).json({ status: 'fail', message: error.message });
  }
};
