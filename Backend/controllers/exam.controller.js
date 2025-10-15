// controllers/exam.controller.js

const Exam = require('../models/exam.model');
const Course = require('../models/course.model');
const User = require('../models/user.model');
const Question = require('../models/question.model');

// ====================== CREATE EXAM ======================
exports.createExam = async (req, res) => {
  try {
    const {
      name,
      code,
      courseId,
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
    if (!name || !code || !courseId || !date || !duration || totalMarks === undefined || passingMarks === undefined) {
      return res.status(400).json({
        status: "fail",
        message: "Missing required fields: name, code, courseId, date, duration, totalMarks, passingMarks",
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

    // ------------------ CREATE EXAM ------------------
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
      price,
      questions,
    });

    // Link exam to course
    await Course.findByIdAndUpdate(courseId, { $push: { exams: exam._id } });

    // Populate exam for response
    const populatedExam = await Exam.findById(exam._id)
      .populate("courseId", "name code")
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

    res.status(200).json({ status: 'success', data: exam });
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
    const exam = await Exam.findByIdAndUpdate(
      req.params.id,
      { isDeleted: true },
      { new: true }
    );

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
    const exam = await Exam.findByIdAndUpdate(
      req.params.id,
      { isDeleted: false },
      { new: true }
    );

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

    await Course.findByIdAndUpdate(exam.courseId, { $pull: { exams: exam._id } });

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

/* ============================================================
   📊 GET EXAM DASHBOARD SUMMARY
============================================================ */
/* ============================================================
   📊 GET EXAM DASHBOARD SUMMARY - INTELLIGENT VERSION
============================================================ */
exports.getExamDashboardStats = async (req, res) => {
  try {
    const { timeframe = '30d' } = req.query; // 7d, 30d, 90d, 1y, all
    
    // Calculate date range based on timeframe
    const getDateRange = (timeframe) => {
      const now = new Date();
      const ranges = {
        '7d': new Date(now.setDate(now.getDate() - 7)),
        '30d': new Date(now.setDate(now.getDate() - 30)),
        '90d': new Date(now.setDate(now.getDate() - 90)),
        '1y': new Date(now.setFullYear(now.getFullYear() - 1)),
        'all': new Date(0) // beginning of time
      };
      return ranges[timeframe] || ranges['30d'];
    };

    const dateFilter = { createdAt: { $gte: getDateRange(timeframe) } };

    // Get all exams with populated data
    const [allExams, recentExams, courseStats, questionStats] = await Promise.all([
      // All exams for overall stats
      Exam.find({ ...dateFilter })
        .populate('courseId', 'name code category')
        .populate('questions', 'type category difficultyLevel')
        .populate('subscribedStudents.studentId', 'name email'),

      // Recent exams for quick overview
      Exam.find({ ...dateFilter })
        .populate('courseId', 'name code')
        .populate('subscribedStudents.studentId')
        .sort({ createdAt: -1 })
        .limit(8),

      // Course-wise exam distribution
      Exam.aggregate([
        { $match: dateFilter },
        {
          $group: {
            _id: '$courseId',
            examCount: { $sum: 1 },
            totalSubscriptions: { $sum: { $size: '$subscribedStudents' } },
            avgDuration: { $avg: '$duration' },
            avgMarks: { $avg: '$totalMarks' }
          }
        },
        { $sort: { examCount: -1 } },
        { $limit: 5 }
      ]),

      // Question type analysis
      Exam.aggregate([
        { $match: dateFilter },
        { $unwind: '$questions' },
        {
          $lookup: {
            from: 'questions',
            localField: 'questions',
            foreignField: '_id',
            as: 'questionData'
          }
        },
        { $unwind: '$questionData' },
        {
          $group: {
            _id: '$questionData.type',
            count: { $sum: 1 },
            avgMarks: { $avg: '$questionData.marks' },
            totalMarks: { $sum: '$questionData.marks' }
          }
        },
        { $sort: { count: -1 } }
      ])
    ]);

    // Calculate comprehensive statistics
    const totalExams = allExams.length;
    const activeExams = allExams.filter(e => !e.isDeleted).length;
    const deletedExams = totalExams - activeExams;

    // Student subscription analytics
    const totalSubscribedStudents = allExams.reduce(
      (acc, exam) => acc + (exam.subscribedStudents?.length || 0), 0
    );

    const uniqueStudents = new Set();
    allExams.forEach(exam => {
      exam.subscribedStudents?.forEach(sub => {
        uniqueStudents.add(sub.studentId?._id?.toString());
      });
    });

    // Question analytics
    const totalQuestions = allExams.reduce(
      (acc, exam) => acc + (exam.questions?.length || 0), 0
    );

    const avgQuestionsPerExam = totalExams > 0 ? (totalQuestions / totalExams).toFixed(1) : 0;

    // Performance metrics
    const examDurations = allExams.map(e => e.duration || 0).filter(d => d > 0);
    const avgDuration = examDurations.length > 0 
      ? Math.round(examDurations.reduce((a, b) => a + b, 0) / examDurations.length)
      : 0;

    const examMarks = allExams.map(e => e.totalMarks || 0).filter(m => m > 0);
    const avgTotalMarks = examMarks.length > 0
      ? Math.round(examMarks.reduce((a, b) => a + b, 0) / examMarks.length)
      : 0;

    // Exam type distribution
    const examTypeDistribution = allExams.reduce((acc, exam) => {
      acc[exam.type] = (acc[exam.type] || 0) + 1;
      return acc;
    }, {});

    // Subscription trend analysis
    const subscriptionTrend = allExams
      .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
      .reduce((acc, exam, index) => {
        const date = new Date(exam.createdAt).toISOString().split('T')[0];
        const dailySubs = exam.subscribedStudents?.length || 0;
        
        if (!acc[date]) {
          acc[date] = { exams: 0, subscriptions: 0 };
        }
        acc[date].exams += 1;
        acc[date].subscriptions += dailySubs;
        return acc;
      }, {});

    // Popular exams (most subscribed)
    const popularExams = [...allExams]
      .sort((a, b) => (b.subscribedStudents?.length || 0) - (a.subscribedStudents?.length || 0))
      .slice(0, 5)
      .map(exam => ({
        id: exam._id,
        name: exam.name,
        code: exam.code,
        course: exam.courseId?.name || 'N/A',
        subscriptions: exam.subscribedStudents?.length || 0,
        duration: exam.duration,
        totalMarks: exam.totalMarks
      }));

    // Recent exams formatted
    const formattedRecentExams = recentExams.map(exam => ({
      id: exam._id,
      name: exam.name,
      code: exam.code,
      course: exam.courseId?.name || 'N/A',
      type: exam.type,
      subscriptions: exam.subscribedStudents?.length || 0,
      questions: exam.questions?.length || 0,
      duration: exam.duration,
      totalMarks: exam.totalMarks,
      status: exam.isDeleted ? 'deleted' : 'active',
      createdAt: exam.createdAt,
      date: exam.date
    }));

    // Course performance
    const topCourses = courseStats.map(course => ({
      courseId: course._id,
      examCount: course.examCount,
      totalSubscriptions: course.totalSubscriptions,
      avgDuration: Math.round(course.avgDuration || 0),
      avgMarks: Math.round(course.avgMarks || 0)
    }));

    // Question type insights
    const questionTypeInsights = questionStats.map(q => ({
      type: q._id,
      count: q.count,
      avgMarks: Math.round(q.avgMarks || 0),
      totalMarks: q.totalMarks
    }));

    // Intelligent alerts and recommendations
    const alerts = [];
    const recommendations = [];

    // Alert for exams with no questions
    const examsWithoutQuestions = allExams.filter(e => !e.questions || e.questions.length === 0);
    if (examsWithoutQuestions.length > 0) {
      alerts.push({
        type: 'warning',
        message: `${examsWithoutQuestions.length} exam(s) have no questions assigned`,
        action: 'add_questions'
      });
    }

    // Alert for exams with low subscription rates
    const lowSubscriptionExams = allExams.filter(e => 
      e.subscribedStudents?.length < 5 && !e.isDeleted
    );
    if (lowSubscriptionExams.length > 0) {
      alerts.push({
        type: 'info',
        message: `${lowSubscriptionExams.length} exam(s) have low student subscriptions`,
        action: 'promote_exams'
      });
    }

    // Recommendations based on data patterns
    if (avgQuestionsPerExam < 10) {
      recommendations.push({
        type: 'improvement',
        message: 'Consider adding more questions per exam for better assessment',
        priority: 'medium'
      });
    }

    if (Object.keys(examTypeDistribution).length === 1) {
      recommendations.push({
        type: 'diversification',
        message: 'Try creating different types of exams (quiz, midterm, final)',
        priority: 'low'
      });
    }

    res.status(200).json({
      status: 'success',
      message: `📊 Intelligent dashboard statistics retrieved for ${timeframe} timeframe!`,
      data: {
        // Core Metrics
        summary: {
          totalExams,
          activeExams,
          deletedExams,
          totalSubscribedStudents,
          uniqueStudents: uniqueStudents.size,
          totalQuestions,
          avgQuestionsPerExam: parseFloat(avgQuestionsPerExam),
          avgDuration,
          avgTotalMarks
        },

        // Distributions
        distributions: {
          examTypes: examTypeDistribution,
          questionTypes: questionTypeInsights,
          topCourses
        },

        // Trends & Analytics
        trends: {
          subscriptionTrend: Object.entries(subscriptionTrend).map(([date, data]) => ({
            date,
            exams: data.exams,
            subscriptions: data.subscriptions
          })),
          popularExams,
          recentExams: formattedRecentExams
        },

        // Intelligent Insights
        insights: {
          engagementRate: totalExams > 0 ? ((uniqueStudents.size / totalExams) * 100).toFixed(1) + '%' : '0%',
          avgSubscriptionRate: totalExams > 0 ? (totalSubscribedStudents / totalExams).toFixed(1) : 0,
          questionDiversity: questionTypeInsights.length,
          mostPopularExamType: Object.keys(examTypeDistribution).reduce((a, b) => 
            examTypeDistribution[a] > examTypeDistribution[b] ? a : b, ''
          )
        },

        // Alerts & Recommendations
        alerts,
        recommendations,

        // Timeframe context
        timeframe: {
          selected: timeframe,
          startDate: getDateRange(timeframe),
          endDate: new Date()
        }
      }
    });

  } catch (error) {
    console.error('Error fetching intelligent exam dashboard stats:', error);
    res.status(500).json({ 
      status: 'error', 
      message: 'Failed to generate intelligent dashboard insights',
      error: error.message 
    });
  }
};