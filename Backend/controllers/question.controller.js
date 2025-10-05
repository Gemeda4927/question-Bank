const Question = require('../models/question.model');
const Exam = require('../models/exam.model');

// ====================== CREATE QUESTION ======================
exports.createQuestion = async (req, res) => {
  try {
    const { text, options, correctAnswer, marks, examId } = req.body;

    // Check if exam exists
    const exam = await Exam.findById(examId);
    if (!exam || exam.isDeleted) {
      return res.status(404).json({ success: false, message: 'Exam not found' });
    }

    const question = await Question.create({
      text,
      options,
      correctAnswer,
      marks: marks || 1,
      exam: examId,
      image: req.file ? req.file.path : undefined
    });

    // Add question reference to exam
    exam.questions.push(question._id);
    await exam.save();

    res.status(201).json({ success: true, question });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ====================== GET ALL QUESTIONS ======================
exports.getAllQuestions = async (req, res) => {
  try {
    const questions = await Question.find({ isDeleted: false })
      .populate('exam', 'name examType program')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: questions.length, questions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ====================== GET QUESTION BY ID ======================
exports.getQuestion = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id)
      .populate('exam', 'name examType program');

    if (!question || question.isDeleted) {
      return res.status(404).json({ success: false, message: 'Question not found' });
    }

    res.status(200).json({ success: true, question });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ====================== UPDATE QUESTION ======================
exports.updateQuestion = async (req, res) => {
  try {
    const { text, options, correctAnswer, marks } = req.body;

    const question = await Question.findById(req.params.id);
    if (!question || question.isDeleted) {
      return res.status(404).json({ success: false, message: 'Question not found' });
    }

    if (text) question.text = text;
    if (options) question.options = options;
    if (correctAnswer) question.correctAnswer = correctAnswer;
    if (marks) question.marks = marks;
    if (req.file) question.image = req.file.path;

    question.updatedAt = Date.now();
    await question.save();

    res.status(200).json({ success: true, question });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ====================== SOFT DELETE QUESTION ======================
exports.softDeleteQuestion = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question || question.isDeleted) {
      return res.status(404).json({ success: false, message: 'Question not found' });
    }

    question.isDeleted = true;
    question.deletedAt = Date.now();
    await question.save();

    res.status(200).json({ success: true, message: 'Question soft-deleted', question });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ====================== RESTORE QUESTION ======================
exports.restoreQuestion = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question || !question.isDeleted) {
      return res.status(404).json({ success: false, message: 'Question not found or not deleted' });
    }

    question.isDeleted = false;
    question.deletedAt = null;
    await question.save();

    res.status(200).json({ success: true, message: 'Question restored', question });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ====================== HARD DELETE QUESTION ======================
exports.hardDeleteQuestion = async (req, res) => {
  try {
    const question = await Question.findByIdAndDelete(req.params.id);
    if (!question) {
      return res.status(404).json({ success: false, message: 'Question not found' });
    }

    // Remove reference from exam
    await Exam.findByIdAndUpdate(question.exam, {
      $pull: { questions: question._id }
    });

    res.status(200).json({ success: true, message: 'Question permanently deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
