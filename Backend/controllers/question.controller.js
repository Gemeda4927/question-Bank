const Question = require("../models/question.model")
const Exam = require("../models/exam.model")

// ======================== CREATE QUESTION ========================

// ======================== CREATE QUESTION (SYNCED) ========================
exports.createQuestion = async (req, res) => {
  try {
    const { examId, text, type, options, correctAnswer, marks, category, imageUrl } = req.body

    // 1️⃣ Validate required fields
    if (!examId || !text) {
      return res.status(400).json({
        status: "fail",
        message: "Exam ID and question text are required.",
      })
    }

    // 2️⃣ Check exam existence
    const exam = await Exam.findById(examId)
    if (!exam || exam.isDeleted) {
      return res.status(404).json({
        status: "fail",
        message: "Exam not found.",
      })
    }

    // 3️⃣ Check for duplicate question
    const existing = await Question.findOne({ examId, text })
    if (existing) {
      return res.status(400).json({
        status: "fail",
        message: "Duplicate question detected. This question already exists for the selected exam.",
      })
    }

    // 4️⃣ Create new question
    const question = await Question.create({
      examId,
      text,
      type: type || "multiple-choice",
      options: options || [],
      correctAnswer: correctAnswer || "",
      marks: marks || 1,
      category: category || "",
      imageUrl: imageUrl || "",
    })

    // 5️⃣ Add question ID to the exam.questions array
    if (!exam.questions.includes(question._id)) {
      exam.questions.push(question._id)
      await exam.save()
    }

    // 6️⃣ Send success response
    res.status(201).json({
      status: "success",
      message: "🎉 Question created and linked to the exam successfully!",
      data: question,
    })
  } catch (error) {
    console.error("Error creating question:", error)

    // Handle unique index violation
    if (error.code === 11000) {
      return res.status(400).json({
        status: "fail",
        message: "Duplicate question detected for this exam.",
      })
    }

    res.status(500).json({ status: "error", message: error.message })
  }
}

// ======================== GET ALL QUESTIONS ========================
exports.getAllQuestions = async (req, res) => {
  try {
    const questions = await Question.find().populate("examId", "name code")
    res.status(200).json({
      status: "success",
      results: questions.length,
      data: questions,
    })
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message })
  }
}

// ======================== GET QUESTION BY ID ========================
exports.getQuestionById = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id).populate("examId", "name code")
    if (!question) {
      return res.status(404).json({
        status: "fail",
        message: "Question not found.",
      })
    }

    res.status(200).json({
      status: "success",
      data: question,
    })
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message })
  }
}

// ======================== UPDATE QUESTION ========================
exports.updateQuestion = async (req, res) => {
  try {
    const updated = await Question.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })

    if (!updated) {
      return res.status(404).json({
        status: "fail",
        message: "Question not found.",
      })
    }

    res.status(200).json({
      status: "success",
      message: "Question updated successfully.",
      data: updated,
    })
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message })
  }
}

// ======================== HARD DELETE QUESTION ========================
exports.hardDeleteQuestion = async (req, res) => {
  try {
    const deleted = await Question.findByIdAndDelete(req.params.id)
    if (!deleted) {
      return res.status(404).json({
        status: "fail",
        message: "Question not found.",
      })
    }

    // Remove question from exam
    await Exam.findByIdAndUpdate(deleted.examId, { $pull: { questions: deleted._id } })

    res.status(200).json({
      status: "success",
      message: "Question deleted permanently.",
    })
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message })
  }
}

// ======================== SOFT DELETE QUESTION ========================
exports.softDeleteQuestion = async (req, res) => {
  try {
    const question = await Question.findByIdAndUpdate(req.params.id, { isDeleted: true }, { new: true })

    if (!question) {
      return res.status(404).json({
        status: "fail",
        message: "Question not found.",
      })
    }

    res.status(200).json({
      status: "success",
      message: "Question soft-deleted successfully.",
      data: question,
    })
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message })
  }
}

// ======================== RESTORE QUESTION ========================
exports.restoreQuestion = async (req, res) => {
  try {
    const question = await Question.findByIdAndUpdate(req.params.id, { isDeleted: false }, { new: true })

    if (!question) {
      return res.status(404).json({
        status: "fail",
        message: "Question not found.",
      })
    }

    res.status(200).json({
      status: "success",
      message: "Question restored successfully.",
      data: question,
    })
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message })
  }
}

// ======================== ADD OPTION TO QUESTION ========================
exports.addOptionToQuestion = async (req, res) => {
  try {
    const { option } = req.body
    if (!option || option.trim() === "") {
      return res.status(400).json({
        status: "fail",
        message: "Option text is required.",
      })
    }

    const question = await Question.findById(req.params.id)
    if (!question) {
      return res.status(404).json({
        status: "fail",
        message: "Question not found.",
      })
    }

    // Prevent duplicate options
    if (question.options.includes(option)) {
      return res.status(400).json({
        status: "fail",
        message: "This option already exists in the question.",
      })
    }

    question.options.push(option)
    await question.save()

    res.status(200).json({
      status: "success",
      message: "Option added successfully.",
      data: question,
    })
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message })
  }
}

// ======================== UPDATE OPTION BY INDEX ========================
exports.updateOptionByIndex = async (req, res) => {
  try {
    const { index } = req.params
    const { option } = req.body

    const question = await Question.findById(req.params.id)
    if (!question) {
      return res.status(404).json({
        status: "fail",
        message: "Question not found.",
      })
    }

    if (!question.options[index]) {
      return res.status(400).json({
        status: "fail",
        message: "Invalid option index.",
      })
    }

    question.options[index] = option
    await question.save()

    res.status(200).json({
      status: "success",
      message: "Option updated successfully.",
      data: question,
    })
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message })
  }
}

// ======================== DELETE OPTION BY INDEX ========================
exports.deleteOptionByIndex = async (req, res) => {
  try {
    const { index } = req.params

    const question = await Question.findById(req.params.id)
    if (!question) {
      return res.status(404).json({
        status: "fail",
        message: "Question not found.",
      })
    }

    if (!question.options[index]) {
      return res.status(400).json({
        status: "fail",
        message: "Invalid option index.",
      })
    }

    question.options.splice(index, 1)
    await question.save()

    res.status(200).json({
      status: "success",
      message: "Option deleted successfully.",
      data: question,
    })
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message })
  }
}
