"use client"
import { useState, useEffect } from "react"
import ProtectedRoute from "@/components/ProtectedRoute"
import StudentLayout from "@/components/StudentLayout"
import { studentService } from "@/services/studentService"
import {
  FileText,
  Clock,
  CheckCircle,
  Sparkles,
  TrendingUp,
  BarChart3,
  Zap,
  Crown,
  Rocket,
  Trophy,
  ArrowRight,
  PieChart,
  RefreshCw,
  Brain,
  PlayCircle,
  Users,
  Target,
  Award,
  Star,
  Calendar,
  BookOpen,
  ChevronRight,
  Eye,
  BarChart,
  Lightbulb,
  AlertTriangle,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

// Constants
const TABS = [
  { id: "overview", label: "Overview", icon: PieChart },
  { id: "exams", label: "Exams", icon: FileText },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
  { id: "achievements", label: "Achievements", icon: Trophy },
]

const EXAM_TYPE_COLORS = {
  final: { bg: "from-red-500 to-pink-500", text: "text-red-600", light: "bg-red-50" },
  midterm: { bg: "from-blue-500 to-cyan-500", text: "text-blue-600", light: "bg-blue-50" },
  quiz: { bg: "from-green-500 to-emerald-500", text: "text-green-600", light: "bg-green-50" },
  assignment: { bg: "from-purple-500 to-indigo-500", text: "text-purple-600", light: "bg-purple-50" },
}

const STATS_GRADIENT = [
  "from-purple-500 to-indigo-600",
  "from-green-500 to-emerald-600",
  "from-orange-500 to-red-500",
  "from-cyan-500 to-blue-600",
  "from-pink-500 to-rose-600",
  "from-yellow-500 to-amber-600",
]

export default function StudentDashboard() {
  const [dashboardData, setDashboardData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")
  const [refreshing, setRefreshing] = useState(false)

  const studentProgress = {
    completedExams: 2,
    averageScore: 85,
    streak: 3,
    rank: "Silver",
    nextMilestone: 5,
    totalStudyTime: 1240,
    accuracy: 78,
    speed: "Above Average",
    level: "Intermediate",
    xp: 1240,
    nextLevelXp: 2000,
  }

  const fetchDashboardData = async () => {
    try {
      setRefreshing(true)
      const response = await studentService.getDashboardStats()
      const data = response.data?.data || {}
      setDashboardData(data)
    } catch (error) {
      console.error("Error fetching dashboard stats:", error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const statCards = [
    {
      icon: FileText,
      label: "Total Exams",
      value: dashboardData?.summary?.totalExams || 0,
      description: "Available for attempt",
      trend: "+12%",
      gradient: STATS_GRADIENT[0],
    },
    {
      icon: CheckCircle,
      label: "Active Exams",
      value: dashboardData?.summary?.activeExams || 0,
      description: "Ready to start",
      trend: "100%",
      gradient: STATS_GRADIENT[1],
    },
    {
      icon: Brain,
      label: "Total Questions",
      value: dashboardData?.summary?.totalQuestions || 0,
      description: "Across all exams",
      trend: `${dashboardData?.summary?.avgQuestionsPerExam || 0}/exam`,
      gradient: STATS_GRADIENT[2],
    },
    {
      icon: Clock,
      label: "Avg Duration",
      value: `${dashboardData?.summary?.avgDuration || 0}m`,
      description: "Per exam",
      trend: "Optimal",
      gradient: STATS_GRADIENT[3],
    },
    {
      icon: Target,
      label: "Avg Marks",
      value: dashboardData?.summary?.avgTotalMarks || 0,
      description: "Per exam",
      trend: "Good",
      gradient: STATS_GRADIENT[4],
    },
    {
      icon: Users,
      label: "Your Rank",
      value: studentProgress.rank,
      description: "Among peers",
      trend: "Top 25%",
      gradient: STATS_GRADIENT[5],
    },
  ]

  if (loading) {
    return (
      <ProtectedRoute allowedRole="student">
        <StudentLayout>
          <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50 flex items-center justify-center">
            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-20 h-20 rounded-full border-4 border-purple-200 mx-auto mb-6"
              >
                <div className="w-20 h-20 rounded-full border-4 border-purple-600 border-t-transparent" />
              </motion.div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Preparing Your Learning Hub</h2>
              <p className="text-gray-600">Gathering your personalized insights...</p>
            </motion.div>
          </div>
        </StudentLayout>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute allowedRole="student">
      <StudentLayout>
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50 pb-16">
          {/* Animated Background */}
          <div className="fixed inset-0 overflow-hidden pointer-events-none">
            {[
              { class: "top-20 left-10 w-72 h-72 bg-purple-200", duration: 20 },
              { class: "bottom-20 right-10 w-96 h-96 bg-cyan-200", duration: 25 },
              { class: "top-1/2 left-1/3 w-64 h-64 bg-blue-200", duration: 30 },
            ].map((bg, i) => (
              <motion.div
                key={i}
                animate={{ x: [0, 100, 0], y: [0, -50, 0] }}
                transition={{ duration: bg.duration, repeat: Infinity, ease: "linear" }}
                className={`absolute ${bg.class} rounded-full blur-3xl opacity-20`}
              />
            ))}
          </div>

          <div className="relative space-y-8 max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 pt-8">
            {/* Header */}
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div className="flex items-center justify-between p-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-purple-200/50 shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
                    <Sparkles className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <p className="text-lg font-bold bg-gradient-to-r from-purple-600 to-cyan-600 bg-clip-text text-transparent">
                      Welcome to Your Learning Hub
                    </p>
                    <p className="text-sm text-gray-600">Personalized insights to accelerate your journey</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">{studentProgress.xp} XP</div>
                  <div className="text-sm text-gray-600">Level {studentProgress.level}</div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <h1 className="text-4xl font-bold text-gray-900 mb-2">
                    Your Learning <span className="bg-gradient-to-r from-purple-600 to-cyan-600 bg-clip-text text-transparent">Dashboard</span>
                  </h1>
                  <p className="text-gray-600 text-lg">
                    Master {dashboardData?.summary?.totalExams || 0} exams with {dashboardData?.summary?.totalQuestions || 0} questions across your courses.
                  </p>
                </div>

                {/* Quick Stats */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-purple-200/50 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-gray-900">Your Progress</h3>
                    <button
                      onClick={fetchDashboardData}
                      className="p-2 bg-purple-100 rounded-lg hover:bg-purple-200 transition-colors"
                    >
                      <RefreshCw className={`w-4 h-4 text-purple-600 ${refreshing ? "animate-spin" : ""}`} />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-2 shadow-md">
                        <CheckCircle className="w-6 h-6 text-white" />
                      </div>
                      <p className="text-2xl font-bold text-gray-900">{studentProgress.completedExams}</p>
                      <p className="text-sm text-gray-600">Completed</p>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center mx-auto mb-2 shadow-md">
                        <TrendingUp className="w-6 h-6 text-white" />
                      </div>
                      <p className="text-2xl font-bold text-gray-900">{studentProgress.averageScore}%</p>
                      <p className="text-sm text-gray-600">Avg Score</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Navigation Tabs */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex space-x-1 bg-white/80 backdrop-blur-sm rounded-xl p-1 border border-purple-200/50 shadow-sm">
              {TABS.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
                      activeTab === tab.id
                        ? "bg-gradient-to-r from-purple-600 to-cyan-600 text-white shadow-lg shadow-purple-500/25"
                        : "text-gray-600 hover:text-purple-600 hover:bg-purple-50"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                )
              })}
            </motion.div>

            {/* Main Content */}
            <AnimatePresence mode="wait">
              {activeTab === "overview" && (
                <motion.div key="overview" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-8">
                  {/* Stats Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
                    {statCards.map((stat, index) => {
                      const Icon = stat.icon
                      return (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          whileHover={{ y: -5, scale: 1.02 }}
                          className="bg-white/90 backdrop-blur-sm rounded-xl p-5 border border-purple-100/50 shadow-sm hover:shadow-lg transition-all cursor-pointer group"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div className={`w-12 h-12 ${stat.gradient} rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow`}>
                              <Icon className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-xs font-medium bg-green-100 text-green-700 px-2 py-1 rounded-full">
                              {stat.trend}
                            </span>
                          </div>
                          <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
                          <div className="text-sm font-medium text-gray-600 mb-1">{stat.label}</div>
                          <div className="text-xs text-gray-500">{stat.description}</div>
                        </motion.div>
                      )
                    })}
                  </div>

                  {/* Two Column Layout */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                      {/* Exam Types */}
                      {dashboardData?.distributions?.examTypes && (
                        <motion.div 
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-purple-100/50 shadow-sm"
                        >
                          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <BarChart3 className="w-5 h-5 text-purple-600" />
                            Exam Types Distribution
                          </h2>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {Object.entries(dashboardData.distributions.examTypes).map(([type, count]: [string, any], index) => (
                              <motion.div
                                key={type}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.1 }}
                                className={`bg-gradient-to-br ${EXAM_TYPE_COLORS[type as keyof typeof EXAM_TYPE_COLORS]?.bg || "from-gray-500 to-gray-600"} rounded-xl p-4 text-white text-center shadow-md hover:shadow-lg transition-all cursor-pointer transform hover:scale-105`}
                              >
                                <div className="text-2xl font-bold mb-1">{count}</div>
                                <div className="text-sm capitalize font-medium">{type}</div>
                                <div className="text-xs opacity-80 mt-1">Exams</div>
                              </motion.div>
                            ))}
                          </div>
                        </motion.div>
                      )}

                      {/* Recent Exams */}
                      {dashboardData?.trends?.recentExams && (
                        <motion.div 
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.2 }}
                          className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-purple-100/50 shadow-sm"
                        >
                          <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                              <Clock className="w-5 h-5 text-purple-600" />
                              Recent Exams
                            </h2>
                            <button className="text-sm text-purple-600 font-medium flex items-center gap-1 hover:text-purple-700">
                              View All <ChevronRight className="w-4 h-4" />
                            </button>
                          </div>
                          <div className="space-y-4">
                            {dashboardData.trends.recentExams.slice(0, 4).map((exam: any, index: number) => (
                              <motion.div
                                key={exam.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all cursor-pointer group border border-gray-200/50"
                              >
                                <div className="flex items-center gap-4">
                                  <div className={`w-12 h-12 bg-gradient-to-br ${EXAM_TYPE_COLORS[exam.type as keyof typeof EXAM_TYPE_COLORS]?.bg || "from-gray-500 to-gray-600"} rounded-xl flex items-center justify-center text-white shadow-md group-hover:shadow-lg transition-shadow`}>
                                    <FileText className="w-6 h-6" />
                                  </div>
                                  <div>
                                    <h3 className="font-semibold text-gray-900 group-hover:text-purple-600 transition-colors">{exam.name}</h3>
                                    <div className="flex items-center gap-3 text-sm text-gray-600 mt-1">
                                      <span className="flex items-center gap-1">
                                        <Clock className="w-4 h-4" />
                                        {exam.duration}m
                                      </span>
                                      <span>•</span>
                                      <span>{exam.course}</span>
                                      <span>•</span>
                                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${EXAM_TYPE_COLORS[exam.type as keyof typeof EXAM_TYPE_COLORS]?.light} ${EXAM_TYPE_COLORS[exam.type as keyof typeof EXAM_TYPE_COLORS]?.text}`}>
                                        {exam.type}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                <motion.button 
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  className="px-4 py-2 bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-medium rounded-lg hover:shadow-lg transition-all flex items-center gap-2 shadow-md"
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

                    {/* Sidebar */}
                    <div className="space-y-6">
                      {/* Quick Actions */}
                      <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-purple-100/50 shadow-sm"
                      >
                        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                          <Zap className="w-5 h-5 text-yellow-500" />
                          Quick Actions
                        </h3>
                        <div className="space-y-3">
                          <motion.button 
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 text-white rounded-xl p-4 text-left hover:shadow-lg transition-all flex items-center justify-between shadow-md"
                          >
                            <div className="flex items-center gap-3">
                              <PlayCircle className="w-5 h-5" />
                              <div>
                                <div className="font-semibold">Start New Exam</div>
                                <div className="text-sm opacity-90">Challenge yourself</div>
                              </div>
                            </div>
                            <ArrowRight className="w-4 h-4" />
                          </motion.button>
                          <motion.button 
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl p-4 text-left hover:shadow-lg transition-all flex items-center justify-between shadow-md"
                          >
                            <div className="flex items-center gap-3">
                              <BarChart className="w-5 h-5" />
                              <div>
                                <div className="font-semibold">View Progress</div>
                                <div className="text-sm opacity-90">Track performance</div>
                              </div>
                            </div>
                            <ArrowRight className="w-4 h-4" />
                          </motion.button>
                        </div>
                      </motion.div>

                      {/* Study Stats */}
                      <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-blue-100/50 shadow-sm"
                      >
                        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                          <Target className="w-5 h-5 text-blue-500" />
                          Study Stats
                        </h3>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                            <div className="flex items-center gap-3">
                              <Clock className="w-4 h-4 text-blue-600" />
                              <span className="text-gray-700">Study Time</span>
                            </div>
                            <span className="font-semibold text-gray-900">{Math.floor(studentProgress.totalStudyTime / 60)}h</span>
                          </div>
                          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                            <div className="flex items-center gap-3">
                              <Target className="w-4 h-4 text-green-600" />
                              <span className="text-gray-700">Accuracy</span>
                            </div>
                            <span className="font-semibold text-green-600">{studentProgress.accuracy}%</span>
                          </div>
                          <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                            <div className="flex items-center gap-3">
                              <Award className="w-4 h-4 text-purple-600" />
                              <span className="text-gray-700">Level</span>
                            </div>
                            <span className="font-semibold text-purple-600">{studentProgress.level}</span>
                          </div>
                          <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                            <div className="flex items-center gap-3">
                              <TrendingUp className="w-4 h-4 text-orange-600" />
                              <span className="text-gray-700">Speed</span>
                            </div>
                            <span className="font-semibold text-orange-600">{studentProgress.speed}</span>
                          </div>
                        </div>
                      </motion.div>

                      {/* Notifications & Alerts */}
                      {dashboardData?.alerts && dashboardData.alerts.length > 0 && (
                        <motion.div 
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.2 }}
                          className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-orange-100/50 shadow-sm"
                        >
                          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5 text-orange-500" />
                            Notifications
                          </h3>
                          <div className="space-y-3">
                            {dashboardData.alerts.slice(0, 2).map((alert: any, index: number) => (
                              <div key={index} className={`p-3 rounded-lg border ${
                                alert.type === 'warning' 
                                  ? 'bg-orange-50 border-orange-200' 
                                  : 'bg-blue-50 border-blue-200'
                              }`}>
                                <div className="flex items-center gap-2 mb-1">
                                  {alert.type === 'warning' ? (
                                    <AlertTriangle className="w-4 h-4 text-orange-600" />
                                  ) : (
                                    <Lightbulb className="w-4 h-4 text-blue-600" />
                                  )}
                                  <span className={`text-sm font-medium ${
                                    alert.type === 'warning' ? 'text-orange-700' : 'text-blue-700'
                                  }`}>
                                    {alert.type === 'warning' ? 'Action Needed' : 'Suggestion'}
                                  </span>
                                </div>
                                <p className="text-sm text-gray-700">{alert.message}</p>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === "exams" && dashboardData?.trends?.recentExams && (
                <motion.div key="exams" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
                  <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-purple-100/50 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900">All Exams</h2>
                        <p className="text-gray-600">Challenge yourself with our comprehensive exam collection</p>
                      </div>
                      <span className="bg-gradient-to-r from-purple-600 to-cyan-600 text-white px-4 py-2 rounded-full text-sm font-medium shadow-md">
                        {dashboardData.trends.recentExams.length} Exams Available
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {dashboardData.trends.recentExams.map((exam: any, index: number) => (
                        <motion.div
                          key={exam.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          whileHover={{ y: -5, scale: 1.02 }}
                          className="bg-white border border-gray-200 rounded-2xl p-5 hover:shadow-xl transition-all cursor-pointer group"
                        >
                          <div className="flex items-start justify-between mb-4">
                            <div className={`w-14 h-14 bg-gradient-to-br ${EXAM_TYPE_COLORS[exam.type as keyof typeof EXAM_TYPE_COLORS]?.bg || "from-gray-500 to-gray-600"} rounded-xl flex items-center justify-center text-white shadow-lg group-hover:shadow-xl transition-shadow`}>
                              <FileText className="w-6 h-6" />
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${EXAM_TYPE_COLORS[exam.type as keyof typeof EXAM_TYPE_COLORS]?.light} ${EXAM_TYPE_COLORS[exam.type as keyof typeof EXAM_TYPE_COLORS]?.text}`}>
                              {exam.type}
                            </span>
                          </div>
                          <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-purple-600 transition-colors">{exam.name}</h3>
                          <p className="text-sm text-gray-600 mb-1 font-medium">{exam.code}</p>
                          <p className="text-xs text-gray-500 mb-4">Course: {exam.course}</p>
                          
                          <div className="grid grid-cols-3 gap-3 mb-5 text-center">
                            <div className="bg-gray-50 rounded-lg p-2">
                              <p className="text-sm font-bold text-gray-900">{exam.duration}m</p>
                              <p className="text-xs text-gray-500">Duration</p>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-2">
                              <p className="text-sm font-bold text-gray-900">{exam.totalMarks}</p>
                              <p className="text-xs text-gray-500">Marks</p>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-2">
                              <p className="text-sm font-bold text-gray-900">{new Date(exam.date).getDate()}</p>
                              <p className="text-xs text-gray-500">Day</p>
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <motion.button 
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="flex-1 bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-medium py-3 rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2 shadow-md"
                            >
                              <PlayCircle className="w-4 h-4" />
                              Start Exam
                            </motion.button>
                            <button className="p-3 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors">
                              <Eye className="w-4 h-4 text-gray-600" />
                            </button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === "achievements" && (
                <motion.div key="achievements" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
                  <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-yellow-100/50 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900">Achievements & Milestones</h2>
                        <p className="text-gray-600">Celebrate your learning journey and accomplishments</p>
                      </div>
                      <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 shadow-md">
                        <Crown className="w-4 h-4" />
                        {studentProgress.xp} XP
                      </div>
                    </div>
                    
                    {/* Level Progress */}
                    <div className="bg-gradient-to-r from-purple-500 to-cyan-500 rounded-2xl p-6 text-white mb-8 shadow-lg">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-bold">Level {studentProgress.level}</h3>
                          <p className="text-purple-100">Keep learning to level up!</p>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold">{studentProgress.xp} / {studentProgress.nextLevelXp} XP</div>
                          <div className="text-sm text-purple-100">Next Level</div>
                        </div>
                      </div>
                      <div className="w-full bg-white/20 rounded-full h-3">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${(studentProgress.xp / studentProgress.nextLevelXp) * 100}%` }}
                          transition={{ duration: 1, ease: "easeOut" }}
                          className="bg-white h-3 rounded-full"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {[
                        { 
                          icon: Crown, 
                          title: "Silver Scholar", 
                          description: "Complete 5 exams with 80%+ score",
                          progress: 60, 
                          color: "from-yellow-400 to-orange-500", 
                          points: 250,
                          current: 3,
                          target: 5
                        },
                        { 
                          icon: Zap, 
                          title: "3 Day Streak", 
                          description: "Study for 3 consecutive days",
                          progress: 43, 
                          color: "from-purple-500 to-pink-500", 
                          points: 150,
                          current: 2,
                          target: 3
                        },
                        { 
                          icon: Rocket, 
                          title: "Intermediate Learner", 
                          description: "Reach intermediate level",
                          progress: 20, 
                          color: "from-blue-500 to-cyan-500", 
                          points: 180,
                          current: 1,
                          target: 5
                        },
                        { 
                          icon: Trophy, 
                          title: "Accuracy Champion", 
                          description: "Maintain 90% accuracy across exams",
                          progress: 78, 
                          color: "from-green-500 to-emerald-500", 
                          points: 220,
                          current: 78,
                          target: 90
                        },
                        { 
                          icon: Star, 
                          title: "Quick Learner", 
                          description: "Complete exams 20% faster than average",
                          progress: 45, 
                          color: "from-pink-500 to-rose-500", 
                          points: 200,
                          current: 9,
                          target: 20
                        },
                        { 
                          icon: BookOpen, 
                          title: "Course Master", 
                          description: "Master all exams in one course",
                          progress: 30, 
                          color: "from-indigo-500 to-purple-500", 
                          points: 300,
                          current: 1,
                          target: 3
                        },
                      ].map((achievement, index) => {
                        const Icon = achievement.icon
                        return (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ y: -5, scale: 1.02 }}
                            className={`bg-gradient-to-br ${achievement.color} rounded-2xl p-5 text-white shadow-md hover:shadow-xl transition-all cursor-pointer`}
                          >
                            <div className="flex items-center gap-3 mb-4">
                              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                                <Icon className="w-6 h-6" />
                              </div>
                              <div>
                                <h3 className="font-bold text-lg">{achievement.title}</h3>
                                <p className="text-sm opacity-90">{achievement.points} XP</p>
                              </div>
                            </div>
                            <p className="text-sm opacity-90 mb-3">{achievement.description}</p>
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span>Progress</span>
                                <span>{achievement.current}/{achievement.target}</span>
                              </div>
                              <div className="w-full bg-white/20 rounded-full h-2">
                                <motion.div 
                                  initial={{ width: 0 }}
                                  animate={{ width: `${achievement.progress}%` }}
                                  transition={{ duration: 1, delay: index * 0.1 }}
                                  className="bg-white h-2 rounded-full"
                                />
                              </div>
                            </div>
                          </motion.div>
                        )
                      })}
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === "analytics" && (
                <motion.div key="analytics" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
                  <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-purple-100/50 shadow-sm">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Learning Analytics</h2>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      {/* Performance Metrics */}
                      <div className="space-y-6">
                        <h3 className="text-lg font-semibold text-gray-900">Performance Overview</h3>
                        {[
                          { label: "Average Score", value: `${studentProgress.averageScore}%`, color: "text-green-600", icon: TrendingUp },
                          { label: "Accuracy Rate", value: `${studentProgress.accuracy}%`, color: "text-blue-600", icon: Target },
                          { label: "Completion Rate", value: "40%", color: "text-purple-600", icon: CheckCircle },
                          { label: "Learning Speed", value: studentProgress.speed, color: "text-orange-600", icon: Zap },
                        ].map((metric, index) => {
                          const Icon = metric.icon
                          return (
                            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                              <div className="flex items-center gap-3">
                                <Icon className="w-5 h-5 text-gray-600" />
                                <span className="text-gray-700">{metric.label}</span>
                              </div>
                              <span className={`font-semibold ${metric.color}`}>{metric.value}</span>
                            </div>
                          )
                        })}
                      </div>

                      {/* Study Patterns */}
                      <div className="space-y-6">
                        <h3 className="text-lg font-semibold text-gray-900">Study Patterns</h3>
                        {[
                          { label: "Total Study Time", value: `${Math.floor(studentProgress.totalStudyTime / 60)}h ${studentProgress.totalStudyTime % 60}m`, icon: Clock },
                          { label: "Active Streak", value: `${studentProgress.streak} days`, icon: Calendar },
                          { label: "Exams Completed", value: studentProgress.completedExams, icon: FileText },
                          { label: "Questions Attempted", value: "156", icon: Brain },
                        ].map((pattern, index) => {
                          const Icon = pattern.icon
                          return (
                            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                              <div className="flex items-center gap-3">
                                <Icon className="w-5 h-5 text-gray-600" />
                                <span className="text-gray-700">{pattern.label}</span>
                              </div>
                              <span className="font-semibold text-gray-900">{pattern.value}</span>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </StudentLayout>
    </ProtectedRoute>
  )
}