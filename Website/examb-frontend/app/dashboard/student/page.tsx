"use client";
import { useState, useEffect } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import StudentLayout from "@/components/StudentLayout";
import { studentService } from "@/services/studentService";
import {
  FileText,
  Award,
  Clock,
  CheckCircle,
  AlertCircle,
  Sparkles,
  BookOpen,
  Unlock,
  Target,
  TrendingUp,
  Users,
  BarChart3,
  Calendar,
  Zap,
  Crown,
  Rocket,
  Star,
  Bookmark,
  Eye,
  PlayCircle,
  AlertTriangle,
  Lightbulb,
  RefreshCw,
  Brain,
  Trophy,
  GraduationCap,
  Shield,
  Clock4,
  ArrowRight,
  PieChart,
  CalendarDays,
  TrendingDown,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function StudentDashboard() {
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [timeframe, setTimeframe] = useState("30d");
  const [refreshing, setRefreshing] = useState(false);

  const fetchDashboardData = async () => {
    try {
      setRefreshing(true);
      console.log("🔍 Fetching dashboard stats from:", "/v1/exams/dashboard/stats");
      
      const response = await studentService.getDashboardStats();
      const data = response.data?.data || {};
      console.log("📊 Dashboard stats response:", data);
      setDashboardData(data);
      
    } catch (error) {
      console.error("❌ Error fetching dashboard stats:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Enhanced student progress with more metrics
  const studentProgress = {
    completedExams: 2,
    averageScore: 85,
    streak: 3,
    rank: "Silver",
    nextMilestone: 5,
    totalStudyTime: 1240, // minutes
    accuracy: 78,
    speed: "Above Average",
    level: "Intermediate",
  };

  // Enhanced stat cards with more metrics
  const statCards = [
    {
      icon: FileText,
      label: "Total Exams",
      value: dashboardData?.summary?.totalExams || 0,
      bgColor: "bg-gradient-to-br from-purple-500 to-indigo-600",
      iconColor: "text-white",
      description: "Available for learning",
      trend: "+12%",
      change: "positive",
      delay: 0.1
    },
    {
      icon: CheckCircle,
      label: "Active Exams",
      value: dashboardData?.summary?.activeExams || 0,
      bgColor: "bg-gradient-to-br from-green-500 to-emerald-600",
      iconColor: "text-white",
      description: "Ready to challenge you",
      trend: "100%",
      change: "positive",
      delay: 0.2
    },
    {
      icon: Brain,
      label: "Total Questions",
      value: dashboardData?.summary?.totalQuestions || 0,
      bgColor: "bg-gradient-to-br from-orange-500 to-red-500",
      iconColor: "text-white",
      description: "Knowledge pieces",
      trend: `${dashboardData?.summary?.avgQuestionsPerExam || 0}/exam`,
      change: "neutral",
      delay: 0.3
    },
    {
      icon: Clock4,
      label: "Avg Duration",
      value: `${dashboardData?.summary?.avgDuration || 0}m`,
      bgColor: "bg-gradient-to-br from-cyan-500 to-blue-600",
      iconColor: "text-white",
      description: "Per exam session",
      trend: "Optimal",
      change: "positive",
      delay: 0.4
    },
  ];

  // Enhanced achievement cards
  const achievementCards = [
    {
      icon: Crown,
      title: `${studentProgress.rank} Scholar`,
      description: "Top 25% performer in your cohort",
      progress: (studentProgress.completedExams / studentProgress.nextMilestone) * 100,
      color: "from-yellow-400 to-orange-500",
      points: 250,
      level: 2
    },
    {
      icon: Zap,
      title: `${studentProgress.streak} Day Streak`,
      description: "Consistent learning pays off!",
      progress: (studentProgress.streak / 7) * 100,
      color: "from-purple-500 to-pink-500",
      points: 150,
      level: 1
    },
    {
      icon: Rocket,
      title: `${studentProgress.level} Learner`,
      description: `${studentProgress.completedExams} exams mastered`,
      progress: (studentProgress.completedExams / 10) * 100,
      color: "from-blue-500 to-cyan-500",
      points: 180,
      level: 2
    },
    {
      icon: Trophy,
      title: "Accuracy Champion",
      description: `${studentProgress.accuracy}% average score`,
      progress: studentProgress.accuracy,
      color: "from-green-500 to-emerald-500",
      points: 220,
      level: 3
    },
  ];

  const examTypeColors = {
    final: "from-red-500 to-pink-500",
    midterm: "from-blue-500 to-cyan-500",
    quiz: "from-green-500 to-emerald-500",
    assignment: "from-purple-500 to-indigo-500",
  };

  const getStudentFriendlyAlert = (alert: any) => {
    const alertTypes = {
      add_questions: [
        {
          title: "New Content Incoming! 🚀",
          message: "We're crafting fresh, challenging questions to enhance your learning experience. New material drops soon!",
          type: "info",
          icon: Zap,
          gradient: "from-blue-500 to-cyan-500",
          action: "Stay tuned!"
        },
        {
          title: "Learning Expansion 🎯",
          message: "Our education team is developing new exam questions to help you master complex concepts. Exciting updates ahead!",
          type: "info",
          icon: Brain,
          gradient: "from-purple-500 to-pink-500",
          action: "Coming soon"
        }
      ],
      promote_exams: [
        {
          title: "Fresh Challenges Await! 🌟",
          message: "New exam topics have been added to your learning path. Perfect opportunity to test your growing knowledge!",
          type: "success",
          icon: Rocket,
          gradient: "from-green-500 to-emerald-500",
          action: "Explore now"
        },
        {
          title: "Knowledge Frontiers 🧠",
          message: "Discover recently added exams designed to push your understanding further. Your next breakthrough starts here!",
          type: "success",
          icon: Target,
          gradient: "from-orange-500 to-red-500",
          action: "Start learning"
        }
      ]
    };

    const alerts = alertTypes[alert.action as keyof typeof alertTypes];
    return alerts ? alerts[Math.floor(Math.random() * alerts.length)] : null;
  };

  if (loading) {
    return (
      <ProtectedRoute allowedRole="student">
        <StudentLayout>
          <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50 flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "linear",
                }}
                className="w-20 h-20 rounded-full border-4 border-purple-200 mx-auto mb-6"
              >
                <div className="w-20 h-20 rounded-full border-4 border-purple-600 border-t-transparent"></div>
              </motion.div>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-2xl font-bold text-gray-800 mb-2"
              >
                Preparing Your Learning Hub
              </motion.h2>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-gray-600"
              >
                Gathering your personalized insights and progress data...
              </motion.p>
            </motion.div>
          </div>
        </StudentLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute allowedRole="student">
      <StudentLayout>
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50 pb-12">
          {/* Enhanced Animated Background */}
          <div className="fixed inset-0 overflow-hidden pointer-events-none">
            <motion.div
              animate={{
                x: [0, 100, 0],
                y: [0, -50, 0],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "linear",
              }}
              className="absolute top-20 left-10 w-72 h-72 bg-purple-200 rounded-full blur-3xl opacity-20"
            />
            <motion.div
              animate={{
                x: [0, -100, 0],
                y: [0, 50, 0],
              }}
              transition={{
                duration: 25,
                repeat: Infinity,
                ease: "linear",
              }}
              className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-200 rounded-full blur-3xl opacity-20"
            />
            <motion.div
              animate={{
                x: [0, 80, 0],
                y: [0, 80, 0],
              }}
              transition={{
                duration: 30,
                repeat: Infinity,
                ease: "linear",
              }}
              className="absolute top-1/2 left-1/3 w-64 h-64 bg-blue-200 rounded-full blur-3xl opacity-15"
            />
          </div>

          <div className="relative space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Enhanced Header Section */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="pt-8"
            >
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <div className="flex-1">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="inline-flex items-center gap-4 px-6 py-4 bg-white/80 backdrop-blur-sm rounded-2xl border-2 border-purple-200/50 shadow-lg mb-6"
                  >
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
                      <Sparkles className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-lg font-black bg-gradient-to-r from-purple-600 to-cyan-600 bg-clip-text text-transparent">
                        Welcome to Your Learning Command Center 🎯
                      </p>
                      <p className="text-sm text-gray-600 font-medium">
                        {dashboardData?.message || "Personalized insights to accelerate your learning journey"}
                      </p>
                    </div>
                  </motion.div>
                  
                  <div className="space-y-4">
                    <h1 className="text-5xl md:text-6xl font-black text-gray-900 leading-tight">
                      Your Learning
                      <span className="block bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent">
                        Dashboard
                      </span>
                    </h1>
                    <p className="text-xl text-gray-600 font-medium max-w-2xl leading-relaxed">
                      Master {dashboardData?.summary?.totalExams || 0} exams with {dashboardData?.summary?.totalQuestions || 0} carefully crafted questions. 
                      <span className="block text-purple-600 font-bold mt-2">
                        🚀 You've conquered {studentProgress.completedExams} exams so far!
                      </span>
                    </p>
                  </div>
                </div>

                {/* Enhanced Quick Stats */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex-shrink-0"
                >
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border-2 border-purple-200/50 shadow-xl">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-black text-gray-900">Your Progress</h3>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={fetchDashboardData}
                        className="p-2 bg-purple-100 rounded-lg hover:bg-purple-200 transition-colors"
                      >
                        <RefreshCw className={`w-4 h-4 text-purple-600 ${refreshing ? 'animate-spin' : ''}`} />
                      </motion.button>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-2 shadow-lg">
                          <CheckCircle className="w-6 h-6 text-white" />
                        </div>
                        <p className="text-2xl font-black text-gray-900">{studentProgress.completedExams}</p>
                        <p className="text-xs text-gray-600 font-medium">Completed</p>
                      </div>
                      <div className="text-center">
                        <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center mx-auto mb-2 shadow-lg">
                          <TrendingUp className="w-6 h-6 text-white" />
                        </div>
                        <p className="text-2xl font-black text-gray-900">{studentProgress.averageScore}%</p>
                        <p className="text-xs text-gray-600 font-medium">Avg Score</p>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Level</span>
                        <span className="font-black text-purple-600">{studentProgress.level}</span>
                      </div>
                      <div className="flex justify-between text-sm mt-2">
                        <span className="text-gray-600">Study Time</span>
                        <span className="font-black text-blue-600">{Math.floor(studentProgress.totalStudyTime / 60)}h</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>

            {/* Enhanced Navigation Tabs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex space-x-1 bg-white/80 backdrop-blur-sm rounded-2xl p-2 border-2 border-purple-200/50 shadow-lg"
            >
              {[
                { id: "overview", label: "Overview", icon: PieChart },
                { id: "exams", label: "Exams", icon: FileText },
                { id: "analytics", label: "Analytics", icon: BarChart3 },
                { id: "achievements", label: "Achievements", icon: Trophy }
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 py-3 px-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
                      activeTab === tab.id
                        ? "bg-gradient-to-r from-purple-600 to-cyan-600 text-white shadow-lg"
                        : "text-gray-600 hover:text-purple-600 hover:bg-purple-50"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}
            </motion.div>

            {/* Enhanced Alerts Section */}
            {dashboardData?.alerts && dashboardData.alerts.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-4"
              >
                {dashboardData.alerts.map((alert: any, index: number) => {
                  const friendlyAlert = getStudentFriendlyAlert(alert);
                  if (!friendlyAlert) return null;

                  const Icon = friendlyAlert.icon;
                  
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.2 }}
                      whileHover={{ scale: 1.02, y: -2 }}
                      className={`bg-gradient-to-br ${friendlyAlert.gradient} rounded-2xl p-5 text-white shadow-xl hover:shadow-2xl transition-all cursor-pointer group`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <Icon className="w-8 h-8 text-white opacity-90" />
                        <div className="bg-white/20 rounded-full px-3 py-1 text-xs font-bold backdrop-blur-sm">
                          {friendlyAlert.action}
                        </div>
                      </div>
                      <h3 className="text-xl font-black mb-2">{friendlyAlert.title}</h3>
                      <p className="text-white/90 text-sm mb-4 leading-relaxed">{friendlyAlert.message}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs opacity-80">Learning Update</span>
                        <motion.div
                          whileHover={{ x: 3 }}
                          className="flex items-center gap-1 text-xs font-bold"
                        >
                          Learn more <ArrowRight className="w-3 h-3" />
                        </motion.div>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}

            {/* Enhanced Main Content */}
            <AnimatePresence mode="wait">
              {activeTab === "overview" && (
                <motion.div
                  key="overview"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-8"
                >
                  {/* Enhanced Stats Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {statCards.map((stat, index) => {
                      const Icon = stat.icon;
                      return (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: stat.delay }}
                          whileHover={{ 
                            scale: 1.05, 
                            y: -5,
                            transition: { type: "spring", stiffness: 300 }
                          }}
                          className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border-2 border-purple-100/50 shadow-xl hover:shadow-2xl transition-all group cursor-pointer"
                        >
                          <div className="flex items-center justify-between mb-4">
                            <div className={`w-16 h-16 ${stat.bgColor} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                              <Icon className="w-8 h-8 text-white" />
                            </div>
                            <motion.span 
                              className={`text-xs font-bold px-2 py-1 rounded-full ${
                                stat.change === 'positive' 
                                  ? 'bg-green-100 text-green-700'
                                  : stat.change === 'negative'
                                  ? 'bg-red-100 text-red-700'
                                  : 'bg-gray-100 text-gray-700'
                              }`}
                              whileHover={{ scale: 1.1 }}
                            >
                              {stat.trend}
                            </motion.span>
                          </div>
                          <div className="text-3xl font-black text-gray-900 mb-1">
                            {stat.value}
                          </div>
                          <div className="text-lg font-bold text-gray-900 mb-1">
                            {stat.label}
                          </div>
                          <div className="text-sm text-gray-600 font-medium">
                            {stat.description}
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>

                  {/* Enhanced Two Column Layout */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Exam Types Distribution */}
                    <div className="lg:col-span-2 space-y-8">
                      {/* Exam Types */}
                      {dashboardData?.distributions?.examTypes && (
                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="bg-white/90 backdrop-blur-sm rounded-3xl border-2 border-purple-200/50 shadow-xl overflow-hidden"
                        >
                          <div className="p-6 border-b border-purple-100 bg-gradient-to-r from-purple-50 to-blue-50">
                            <h2 className="text-2xl font-black text-gray-900 flex items-center gap-3">
                              <BarChart3 className="w-7 h-7 text-purple-600" />
                              Exam Types Distribution
                            </h2>
                          </div>
                          <div className="p-6">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                              {Object.entries(dashboardData.distributions.examTypes).map(([type, count]: [string, any]) => (
                                <motion.div
                                  key={type}
                                  whileHover={{ scale: 1.05 }}
                                  className={`bg-gradient-to-br ${examTypeColors[type as keyof typeof examTypeColors] || 'from-gray-500 to-gray-600'} rounded-2xl p-5 text-white text-center shadow-lg cursor-pointer`}
                                >
                                  <div className="text-2xl font-black mb-1">{count}</div>
                                  <div className="text-sm font-bold capitalize">{type}</div>
                                  <div className="text-xs opacity-80 mt-1">exams</div>
                                </motion.div>
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {/* Recent Exams */}
                      {dashboardData?.trends?.recentExams && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="bg-white/90 backdrop-blur-sm rounded-2xl border-2 border-purple-100/50 shadow-lg overflow-hidden"
                        >
                          <div className="p-6 border-b border-purple-100 bg-gradient-to-r from-purple-50 to-cyan-50">
                            <div className="flex items-center justify-between">
                              <h2 className="text-xl font-black text-gray-900 flex items-center gap-2">
                                <Clock className="w-5 h-5 text-purple-600" />
                                Recent Exams
                              </h2>
                              <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                                {dashboardData.trends.recentExams.length}
                              </span>
                            </div>
                          </div>
                          <div className="p-4 max-h-96 overflow-y-auto">
                            {dashboardData.trends.recentExams.slice(0, 6).map((exam: any, index: number) => (
                              <motion.div
                                key={exam.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-cyan-50 rounded-xl mb-3 hover:shadow-md transition-all group cursor-pointer border border-purple-100"
                                onClick={() => (window.location.href = `/dashboard/student/exams/${exam.id}`)}
                              >
                                <div className="flex items-center gap-4">
                                  <div className={`w-12 h-12 bg-gradient-to-br ${examTypeColors[exam.type as keyof typeof examTypeColors] || 'from-gray-500 to-gray-600'} rounded-xl flex items-center justify-center text-white font-bold shadow-md`}>
                                    <FileText className="w-6 h-6" />
                                  </div>
                                  <div>
                                    <h3 className="font-bold text-gray-900 group-hover:text-purple-600 transition-colors">
                                      {exam.name}
                                    </h3>
                                    <p className="text-sm text-gray-600 mt-1">
                                      {exam.duration}min • {exam.totalMarks} marks • {exam.course}
                                    </p>
                                  </div>
                                </div>
                                <motion.button 
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  className="px-4 py-2 bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all flex items-center gap-2"
                                >
                                  <PlayCircle className="w-4 h-4" />
                                  Start
                                </motion.button>
                              </motion.div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </div>

                    {/* Enhanced Achievements Sidebar */}
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="space-y-6"
                    >
                      {/* Quick Actions */}
                      <div className="bg-white/90 backdrop-blur-sm rounded-2xl border-2 border-purple-200/50 shadow-xl p-6">
                        <h3 className="text-lg font-black text-gray-900 mb-4 flex items-center gap-2">
                          <Zap className="w-5 h-5 text-purple-600" />
                          Quick Actions
                        </h3>
                        <div className="space-y-3">
                          <motion.button
                            whileHover={{ scale: 1.02, x: 5 }}
                            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl p-4 text-left hover:shadow-lg transition-all group"
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="font-bold">Start New Exam</div>
                                <div className="text-sm opacity-90">Test your knowledge</div>
                              </div>
                              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                            </div>
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.02, x: 5 }}
                            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl p-4 text-left hover:shadow-lg transition-all group"
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="font-bold">View Progress</div>
                                <div className="text-sm opacity-90">Track your growth</div>
                              </div>
                              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                            </div>
                          </motion.button>
                        </div>
                      </div>

                      {/* Study Stats */}
                      <div className="bg-white/90 backdrop-blur-sm rounded-2xl border-2 border-blue-200/50 shadow-xl p-6">
                        <h3 className="text-lg font-black text-gray-900 mb-4 flex items-center gap-2">
                          <TrendingUp className="w-5 h-5 text-blue-600" />
                          Study Statistics
                        </h3>
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Total Study Time</span>
                            <span className="font-black text-blue-600">{Math.floor(studentProgress.totalStudyTime / 60)}h</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Accuracy Rate</span>
                            <span className="font-black text-green-600">{studentProgress.accuracy}%</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Learning Speed</span>
                            <span className="font-black text-purple-600">{studentProgress.speed}</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              )}

              {/* Enhanced Exams Tab */}
              {activeTab === "exams" && dashboardData?.trends?.recentExams && (
                <motion.div
                  key="exams"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <div className="bg-white/90 backdrop-blur-sm rounded-3xl border-2 border-purple-200/50 shadow-xl overflow-hidden">
                    <div className="p-6 border-b border-purple-100 bg-gradient-to-r from-purple-50 to-blue-50">
                      <div className="flex items-center justify-between">
                        <div>
                          <h2 className="text-2xl font-black text-gray-900">All Available Exams</h2>
                          <p className="text-gray-600 mt-1">Challenge yourself with our comprehensive exam collection</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="bg-purple-600 text-white px-4 py-2 rounded-full text-sm font-bold">
                            {dashboardData.trends.recentExams.length} Exams
                          </span>
                          <select className="bg-white/80 border-2 border-purple-200 rounded-xl px-3 py-2 text-sm font-bold text-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500">
                            <option>All Types</option>
                            <option>Final Exams</option>
                            <option>Midterms</option>
                            <option>Quizzes</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {dashboardData.trends.recentExams.map((exam: any, index: number) => (
                          <motion.div
                            key={exam.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ scale: 1.02, y: -5 }}
                            className="bg-gradient-to-br from-white to-gray-50 border-2 border-purple-100 rounded-2xl p-6 hover:shadow-xl transition-all cursor-pointer group"
                            onClick={() => (window.location.href = `/dashboard/student/exams/${exam.id}`)}
                          >
                            <div className="flex items-start justify-between mb-4">
                              <div className={`w-14 h-14 bg-gradient-to-br ${examTypeColors[exam.type as keyof typeof examTypeColors] || 'from-gray-500 to-gray-600'} rounded-2xl flex items-center justify-center text-white shadow-lg`}>
                                <FileText className="w-7 h-7" />
                              </div>
                              <div className="text-right">
                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                  exam.status === 'active' 
                                    ? 'bg-green-100 text-green-700' 
                                    : 'bg-gray-100 text-gray-700'
                                }`}>
                                  {exam.status || 'active'}
                                </span>
                                <div className="text-xs text-gray-500 mt-1">{exam.type}</div>
                              </div>
                            </div>
                            <h3 className="font-black text-gray-900 text-xl mb-3 line-clamp-2 group-hover:text-purple-600 transition-colors leading-tight">
                              {exam.name}
                            </h3>
                            <p className="text-sm text-gray-600 font-medium mb-2">{exam.code}</p>
                            <p className="text-xs text-gray-500 mb-4 line-clamp-1">Course: {exam.course}</p>
                            
                            <div className="grid grid-cols-3 gap-3 mb-5 pt-4 border-t border-gray-200">
                              <div className="text-center">
                                <Clock className="w-4 h-4 text-purple-600 mx-auto mb-1" />
                                <p className="text-sm font-black text-gray-900">{exam.duration}m</p>
                                <p className="text-xs text-gray-500">Duration</p>
                              </div>
                              <div className="text-center">
                                <Target className="w-4 h-4 text-purple-600 mx-auto mb-1" />
                                <p className="text-sm font-black text-gray-900">{exam.totalMarks}</p>
                                <p className="text-xs text-gray-500">Marks</p>
                              </div>
                              <div className="text-center">
                                <CalendarDays className="w-4 h-4 text-purple-600 mx-auto mb-1" />
                                <p className="text-sm font-black text-gray-900">{new Date(exam.date).getDate()}</p>
                                <p className="text-xs text-gray-500">Day</p>
                              </div>
                            </div>
                            
                            <motion.button 
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold py-3 rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2 group-hover:from-purple-700 group-hover:to-blue-700"
                            >
                              <PlayCircle className="w-5 h-5" />
                              Start Exam
                            </motion.button>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Enhanced Analytics Tab */}
              {activeTab === "analytics" && (
                <motion.div
                  key="analytics"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  {/* Enhanced Insights Grid */}
                  {dashboardData?.insights && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      {Object.entries(dashboardData.insights).map(([key, value]: [string, any], index) => (
                        <motion.div
                          key={key}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border-2 border-purple-100/50 shadow-lg hover:shadow-xl transition-all"
                        >
                          <div className="text-2xl font-black text-purple-600 mb-2">
                            {typeof value === 'number' ? value.toFixed(1) : value}
                          </div>
                          <div className="text-sm font-bold text-gray-900 capitalize mb-1">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </div>
                          <div className="text-xs text-gray-500">
                            Learning Insight
                          </div>
                          <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${Math.min(100, (typeof value === 'number' ? value : 50))}%` }}
                              transition={{ delay: index * 0.2 + 0.5, duration: 1 }}
                              className="bg-purple-600 h-2 rounded-full"
                            />
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}

                  {/* Enhanced Analytics Cards */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Question Types */}
                    {dashboardData?.distributions?.questionTypes && (
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border-2 border-purple-100/50 shadow-lg"
                      >
                        <h3 className="text-lg font-black text-gray-900 mb-4 flex items-center gap-2">
                          <Brain className="w-5 h-5 text-purple-600" />
                          Question Types Analysis
                        </h3>
                        <div className="space-y-4">
                          {dashboardData.distributions.questionTypes.map((qType: any, index: number) => (
                            <div key={index} className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl border border-purple-100">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                                  <FileText className="w-5 h-5 text-white" />
                                </div>
                                <span className="font-bold text-gray-900 capitalize">{qType.type}</span>
                              </div>
                              <div className="text-right">
                                <div className="font-black text-purple-600 text-lg">{qType.count}</div>
                                <div className="text-xs text-gray-500">{qType.avgMarks} marks avg</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}

                    {/* Performance Metrics */}
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border-2 border-green-100/50 shadow-lg"
                    >
                      <h3 className="text-lg font-black text-gray-900 mb-4 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-green-600" />
                        Your Performance
                      </h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                          <span className="font-medium text-gray-900">Average Score</span>
                          <div className="text-right">
                            <div className="font-black text-green-600">{studentProgress.averageScore}%</div>
                            <div className="text-xs text-gray-500">Across all exams</div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                          <span className="font-medium text-gray-900">Completion Rate</span>
                          <div className="text-right">
                            <div className="font-black text-blue-600">
                              {Math.round((studentProgress.completedExams / (dashboardData?.summary?.totalExams || 1)) * 100)}%
                            </div>
                            <div className="text-xs text-gray-500">Exams completed</div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                          <span className="font-medium text-gray-900">Learning Streak</span>
                          <div className="text-right">
                            <div className="font-black text-purple-600">{studentProgress.streak} days</div>
                            <div className="text-xs text-gray-500">Current streak</div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              )}

              {/* Enhanced Achievements Tab */}
              {activeTab === "achievements" && (
                <motion.div
                  key="achievements"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <div className="bg-white/90 backdrop-blur-sm rounded-3xl border-2 border-yellow-200/50 shadow-xl overflow-hidden">
                    <div className="p-6 border-b border-yellow-100 bg-gradient-to-r from-yellow-50 to-orange-50">
                      <div className="flex items-center justify-between">
                        <div>
                          <h2 className="text-2xl font-black text-gray-900 flex items-center gap-3">
                            <Trophy className="w-7 h-7 text-yellow-600" />
                            Your Learning Achievements
                          </h2>
                          <p className="text-gray-600 mt-1">Celebrate your progress and unlock new milestones</p>
                        </div>
                        <div className="bg-yellow-500 text-white px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2">
                          <Star className="w-4 h-4" />
                          800 XP Total
                        </div>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {achievementCards.map((achievement, index) => {
                          const Icon = achievement.icon;
                          return (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.2 }}
                              whileHover={{ scale: 1.03, y: -5 }}
                              className={`bg-gradient-to-br ${achievement.color} rounded-2xl p-6 text-white shadow-lg cursor-pointer group relative overflow-hidden`}
                            >
                              {/* Achievement Level Badge */}
                              <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-bold">
                                Level {achievement.level}
                              </div>
                              
                              <div className="flex items-center gap-4 mb-4">
                                <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                                  <Icon className="w-7 h-7 text-white" />
                                </div>
                                <div>
                                  <h3 className="text-xl font-black mb-1">{achievement.title}</h3>
                                  <p className="text-white/80 text-sm">{achievement.description}</p>
                                </div>
                              </div>
                              
                              {/* Progress Bar */}
                              <div className="mb-3">
                                <div className="flex justify-between text-sm mb-1">
                                  <span>Progress</span>
                                  <span className="font-bold">{Math.round(achievement.progress)}%</span>
                                </div>
                                <div className="w-full bg-white/20 rounded-full h-2">
                                  <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${achievement.progress}%` }}
                                    transition={{ delay: index * 0.3 + 0.5, duration: 1 }}
                                    className="bg-white h-2 rounded-full"
                                  />
                                </div>
                              </div>
                              
                              {/* XP Points */}
                              <div className="flex justify-between items-center">
                                <div className="text-sm font-bold">
                                  {achievement.points} XP
                                </div>
                                <motion.div
                                  whileHover={{ scale: 1.1 }}
                                  className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center"
                                >
                                  <Star className="w-4 h-4 text-white" />
                                </motion.div>
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Next Milestones */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border-2 border-purple-200/50 shadow-lg"
                  >
                    <h3 className="text-lg font-black text-gray-900 mb-4 flex items-center gap-2">
                      <Target className="w-5 h-5 text-purple-600" />
                      Next Learning Milestones
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-4 border border-purple-100">
                        <div className="text-2xl font-black text-purple-600 mb-1">5</div>
                        <div className="text-sm font-bold text-gray-900">Exams to Gold</div>
                        <div className="text-xs text-gray-600">Complete 3 more exams</div>
                      </div>
                      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-100">
                        <div className="text-2xl font-black text-green-600 mb-1">7</div>
                        <div className="text-sm font-bold text-gray-900">Day Streak Goal</div>
                        <div className="text-xs text-gray-600">4 days to go</div>
                      </div>
                      <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-4 border border-orange-100">
                        <div className="text-2xl font-black text-orange-600 mb-1">90%</div>
                        <div className="text-sm font-bold text-gray-900">Accuracy Target</div>
                        <div className="text-xs text-gray-600">12% improvement needed</div>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </StudentLayout>
    </ProtectedRoute>
  );
}