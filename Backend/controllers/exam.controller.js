// controllers/exam.controller.js

const Exam = require("../models/exam.model");
const Course = require("../models/course.model");
const University = require("../models/university.model");
const User = require("../models/user.model");
const Question = require("../models/question.model");

/* ============================================================
   🎯 CREATE EXAM
============================================================ */
exports.createExam = async (req, res) => {
  try {
    const {
      name,
      code,
      courseId,
      universityId,
      type = "final",
      description,
      date,
      duration,
      totalMarks,
      passingMarks,
      price = 0,
      questions = [],
    } = req.body;

    // ------------------ VALIDATIONS ------------------
    if (
      !name ||
      !code ||
      !courseId ||
      !universityId ||
      !date ||
      !duration ||
      totalMarks === undefined ||
      passingMarks === undefined
    ) {
      return res.status(400).json({
        status: "fail",
        message:
          "Missing required fields: name, code, courseId, universityId, date, duration, totalMarks, passingMarks",
      });
    }

    // Check if course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        status: "fail",
        message: "Course not found",
      });
    }

    // Check if university exists
    const university = await University.findById(universityId);
    if (!university) {
      return res.status(404).json({
        status: "fail",
        message: "University not found",
      });
    }

    // ------------------ CREATE EXAM ------------------
    const exam = await Exam.create({
      name,
      code,
      courseId,
      universityId,
      type,
      description,
      date,
      duration,
      totalMarks,
      passingMarks,
      price,
      questions,
    });

    // Link exam to course
    await Course.findByIdAndUpdate(courseId, { $push: { exams: exam._id } });

    // Populate for response
    const populatedExam = await Exam.findById(exam._id)
      .populate("courseId", "name code")
      .populate("universityId", "name type location")
      .populate({
        path: "questions",
        select: "text type marks options correctAnswer imageUrl category",
      });

    res.status(201).json({
      status: "success",
      message: "🎉 Exam created successfully!",
      data: populatedExam,
    });
  } catch (error) {
    console.error("❌ Create exam error:", error);
    res.status(500).json({ status: "error", message: error.message });
  }
};

/* ============================================================
   📋 GET ALL EXAMS
============================================================ */
exports.getAllExams = async (req, res) => {
  try {
    const exams = await Exam.find({ isDeleted: false })
      .populate("courseId", "name code")
      .populate("universityId", "name type location")
      .populate({
        path: "questions",
        select: "text type marks options correctAnswer imageUrl category",
      })
      .populate("subscribedStudents.studentId", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      status: "success",
      results: exams.length,
      data: exams,
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

/* ============================================================
   🔍 GET EXAM BY ID
============================================================ */
exports.getExamById = async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id)
      .populate("courseId", "name code")
      .populate("universityId", "name type location")
      .populate({
        path: "questions",
        select: "text type marks options correctAnswer imageUrl category",
      })
      .populate("subscribedStudents.studentId", "name email");

    if (!exam || exam.isDeleted) {
      return res.status(404).json({ status: "fail", message: "Exam not found." });
    }

    res.status(200).json({ status: "success", data: exam });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

/* ============================================================
   ✏️ UPDATE EXAM
============================================================ */
exports.updateExam = async (req, res) => {
  try {
    const updates = { ...req.body };

    // Optional: verify new university exists if provided
    if (updates.universityId) {
      const uni = await University.findById(updates.universityId);
      if (!uni) {
        return res.status(404).json({ status: "fail", message: "University not found." });
      }
    }

    const exam = await Exam.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    })
      .populate("courseId", "name code")
      .populate("universityId", "name type location")
      .populate({
        path: "questions",
        select: "text type marks options correctAnswer imageUrl category",
      });

    if (!exam || exam.isDeleted) {
      return res.status(404).json({ status: "fail", message: "Exam not found." });
    }

    res.status(200).json({
      status: "success",
      message: "✅ Exam updated successfully!",
      data: exam,
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

/* ============================================================
   🗑️ SOFT DELETE EXAM
============================================================ */
exports.softDeleteExam = async (req, res) => {
  try {
    const exam = await Exam.findByIdAndUpdate(
      req.params.id,
      { isDeleted: true },
      { new: true }
    );

    if (!exam) {
      return res.status(404).json({ status: "fail", message: "Exam not found." });
    }

    await Course.findByIdAndUpdate(exam.courseId, { $pull: { exams: exam._id } });

    res.status(200).json({
      status: "success",
      message: "🗑️ Exam soft-deleted successfully.",
      data: exam,
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

/* ============================================================
   ♻️ RESTORE EXAM
============================================================ */
exports.restoreExam = async (req, res) => {
  try {
    const exam = await Exam.findByIdAndUpdate(
      req.params.id,
      { isDeleted: false },
      { new: true }
    );

    if (!exam) {
      return res.status(404).json({ status: "fail", message: "Exam not found." });
    }

    await Course.findByIdAndUpdate(exam.courseId, { $addToSet: { exams: exam._id } });

    res.status(200).json({
      status: "success",
      message: "♻️ Exam restored successfully!",
      data: exam,
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

/* ============================================================
   ❌ HARD DELETE EXAM
============================================================ */
exports.hardDeleteExam = async (req, res) => {
  try {
    const exam = await Exam.findByIdAndDelete(req.params.id);

    if (!exam) {
      return res.status(404).json({ status: "fail", message: "Exam not found." });
    }

    await Course.findByIdAndUpdate(exam.courseId, { $pull: { exams: exam._id } });

    res.status(200).json({
      status: "success",
      message: "❌ Exam permanently deleted.",
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

/* ============================================================
   🎓 SUBSCRIBE STUDENT TO EXAM
============================================================ */
exports.subscribeStudentToExam = async (req, res) => {
  try {
    const { examId, studentId, paymentStatus = "paid" } = req.body;

    const exam = await Exam.findById(examId);
    if (!exam || exam.isDeleted) {
      return res.status(404).json({ status: "fail", message: "Exam not found." });
    }

    const student = await User.findById(studentId);
    if (!student) {
      return res.status(404).json({ status: "fail", message: "Student not found." });
    }

    const alreadySubscribed = exam.subscribedStudents.some(
      (s) => s.studentId.toString() === studentId
    );

    if (!alreadySubscribed) {
      exam.subscribedStudents.push({ studentId, paymentStatus });
      await exam.save();
    }

    res.status(200).json({
      status: "success",
      message: `🎉 ${student.name} subscribed to ${exam.name}`,
      data: { examId: exam._id, studentId: student._id, paymentStatus },
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
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
      return res.status(404).json({ status: "fail", message: "Exam not found." });
    }

    const hasAccess = exam.subscribedStudents.some(
      (s) => s.studentId.toString() === studentId && s.paymentStatus === "paid"
    );

    res.status(200).json({
      status: "success",
      data: { hasAccess },
      message: hasAccess
        ? "✅ Student has access to this exam."
        : "❌ Student does not have access.",
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

/* ============================================================
   🧠 GET EXAM QUESTIONS
============================================================ */
exports.getExamQuestions = async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id).populate({
      path: "questions",
      select: "text type marks options correctAnswer imageUrl category",
    });

    if (!exam || exam.isDeleted) {
      return res.status(404).json({ status: "fail", message: "Exam not found." });
    }

    res.status(200).json({
      status: "success",
      message: `🧠 ${exam.questions.length} questions found for ${exam.name}`,
      data: exam.questions,
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

/* ============================================================
   📊 GET EXAM DASHBOARD STATS (with University info)
============================================================ */
exports.getExamDashboardStats = async (req, res) => {
  try {
    const { timeframe = "30d" } = req.query;

    const getDateRange = (timeframe) => {
      const now = new Date();
      const ranges = {
        "7d": new Date(now.setDate(now.getDate() - 7)),
        "30d": new Date(now.setDate(now.getDate() - 30)),
        "90d": new Date(now.setDate(now.getDate() - 90)),
        "1y": new Date(now.setFullYear(now.getFullYear() - 1)),
        all: new Date(0),
      };
      return ranges[timeframe] || ranges["30d"];
    };

    const dateFilter = { createdAt: { $gte: getDateRange(timeframe) } };

    const allExams = await Exam.find({ ...dateFilter })
      .populate("courseId", "name code")
      .populate("universityId", "name type location")
      .populate("questions", "type category difficultyLevel")
      .populate("subscribedStudents.studentId", "name email");

    const totalExams = allExams.length;
    const totalUniversities = new Set(allExams.map((e) => e.universityId?._id?.toString())).size;

    const totalSubscribedStudents = allExams.reduce(
      (acc, exam) => acc + (exam.subscribedStudents?.length || 0),
      0
    );

    const summary = {
      totalExams,
      totalUniversities,
      totalSubscribedStudents,
    };

    res.status(200).json({
      status: "success",
      message: "📊 Dashboard stats retrieved successfully",
      data: summary,
    });
  } catch (error) {
    console.error("Error fetching exam dashboard stats:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to generate dashboard insights",
      error: error.message,
    });
  }
};
