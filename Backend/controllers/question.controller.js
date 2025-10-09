const Question = require('../models/question.model');
const Exam = require('../models/exam.model');

// ======================== CREATE QUESTION ========================
exports.createQuestion = async (req, res) => {
  try {
    const { examId, text, type, options, correctAnswer, marks, category } = req.body;

    if (!examId) return res.status(400).json({ status: 'fail', message: 'Exam ID is required' });
    if (!text) return res.status(400).json({ status: 'fail', message: 'Question text is required' });

    // Validate options for multiple-choice questions
    if (type === 'multiple-choice') {
      if (!options || !Array.isArray(options) || options.length < 2) {
        return res.status(400).json({ status: 'fail', message: 'Multiple-choice questions require at least 2 options' });
      }
      if (!correctAnswer || !options.includes(correctAnswer)) {
        return res.status(400).json({ status: 'fail', message: 'Correct answer must be one of the options' });
      }
    }

    // Handle image URL if uploaded
    const imageUrl = req.file ? req.file.path : undefined;

    // Create question
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

    // Add question ID to the exam's questions array
    const exam = await Exam.findById(examId);
    if (exam) {
      exam.questions = exam.questions || [];
      exam.questions.push(question._id);
      await exam.save();
    }

    // Populate examId in the response
    const populatedQuestion = await Question.findById(question._id).populate('examId', 'name code');

    res.status(201).json({
      status: 'success',
      message: '🎉 Question created successfully!',
      data: populatedQuestion,
    });
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
    const question = await Question.findById(req.params.id).populate('examId', 'name code');
    if (!question || question.isDeleted) {
      return res.status(404).json({ status: 'fail', message: 'Question not found' });
    }
    res.status(200).json({ status: 'success', data: question });
  } catch (error) {
    res.status(400).json({ status: 'fail', message: error.message });
  }
};

// ======================== UPDATE QUESTION ========================
exports.updateQuestion = async (req, res) => {
  try {
    const updates = { ...req.body };

    // Handle new image if uploaded
    if (req.file) updates.imageUrl = req.file.path;

    // Validate options if type is multiple-choice
    if (updates.type === 'multiple-choice' && updates.options) {
      if (!Array.isArray(updates.options) || updates.options.length < 2) {
        return res.status(400).json({ status: 'fail', message: 'Multiple-choice questions require at least 2 options' });
      }
      if (!updates.correctAnswer || !updates.options.includes(updates.correctAnswer)) {
        return res.status(400).json({ status: 'fail', message: 'Correct answer must be one of the options' });
      }
    }

    const question = await Question.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
    if (!question || question.isDeleted) {
      return res.status(404).json({ status: 'fail', message: 'Question not found' });
    }

    const populatedQuestion = await Question.findById(question._id).populate('examId', 'name code');

    res.status(200).json({ status: 'success', message: '✅ Question updated', data: populatedQuestion });
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

    // Remove from exam's questions array
    if (question.examId) {
      await Exam.findByIdAndUpdate(question.examId, { $pull: { questions: question._id } });
    }

    res.status(200).json({ status: 'success', message: '❌ Question permanently deleted' });
  } catch (error) {
    res.status(400).json({ status: 'fail', message: error.message });
  }
};
