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
  final: "from-red-500 to-pink-500",
  midterm: "from-blue-500 to-cyan-500",
  quiz: "from-green-500 to-emerald-500",
  assignment: "from-purple-500 to-indigo-500",
}

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
      bgColor: "bg-gradient-to-br from-purple-500 to-indigo-600",
      trend: "+12%",
    },
    {
      icon: CheckCircle,
      label: "Active Exams",
      value: dashboardData?.summary?.activeExams || 0,
      bgColor: "bg-gradient-to-br from-green-500 to-emerald-600",
      trend: "100%",
    },
    {
      icon: Brain,
      label: "Total Questions",
      value: dashboardData?.summary?.totalQuestions || 0,
      bgColor: "bg-gradient-to-br from-orange-500 to-red-500",
      trend: `${dashboardData?.summary?.avgQuestionsPerExam || 0}/exam`,
    },
    {
      icon: Clock,
      label: "Avg Duration",
      value: `${dashboardData?.summary?.avgDuration || 0}m`,
      bgColor: "bg-gradient-to-br from-cyan-500 to-blue-600",
      trend: "Optimal",
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
              <div className="flex items-center gap-4 p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-purple-200/50">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-lg font-bold bg-gradient-to-r from-purple-600 to-cyan-600 bg-clip-text text-transparent">
                    Welcome to Your Learning Hub
                  </p>
                  <p className="text-sm text-gray-600">Personalized insights to accelerate your journey</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h1 className="text-4xl font-bold text-gray-900 mb-2">
                    Your Learning <span className="bg-gradient-to-r from-purple-600 to-cyan-600 bg-clip-text text-transparent">Dashboard</span>
                  </h1>
                  <p className="text-gray-600">
                    Master {dashboardData?.summary?.totalExams || 0} exams with {dashboardData?.summary?.totalQuestions || 0} questions.
                  </p>
                </div>

                {/* Quick Stats */}
                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-purple-200/50">
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
                      <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center mx-auto mb-2">
                        <CheckCircle className="w-6 h-6 text-white" />
                      </div>
                      <p className="text-2xl font-bold text-gray-900">{studentProgress.completedExams}</p>
                      <p className="text-sm text-gray-600">Completed</p>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center mx-auto mb-2">
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
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex space-x-1 bg-white/80 backdrop-blur-sm rounded-lg p-1 border border-purple-200/50">
              {TABS.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 py-3 px-4 rounded-md font-medium transition-all flex items-center justify-center gap-2 ${
                      activeTab === tab.id
                        ? "bg-gradient-to-r from-purple-600 to-cyan-600 text-white shadow"
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
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {statCards.map((stat, index) => {
                      const Icon = stat.icon
                      return (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="bg-white/90 backdrop-blur-sm rounded-xl p-6 border border-purple-100/50 shadow-sm hover:shadow-md transition-all"
                        >
                          <div className="flex items-center justify-between mb-4">
                            <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                              <Icon className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-sm font-medium bg-green-100 text-green-700 px-2 py-1 rounded">
                              {stat.trend}
                            </span>
                          </div>
                          <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
                          <div className="text-sm font-medium text-gray-600">{stat.label}</div>
                        </motion.div>
                      )
                    })}
                  </div>

                  {/* Two Column Layout */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                      {/* Exam Types */}
                      {dashboardData?.distributions?.examTypes && (
                        <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 border border-purple-100/50">
                          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <BarChart3 className="w-5 h-5 text-purple-600" />
                            Exam Types
                          </h2>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {Object.entries(dashboardData.distributions.examTypes).map(([type, count]: [string, any]) => (
                              <div
                                key={type}
                                className={`bg-gradient-to-br ${EXAM_TYPE_COLORS[type as keyof typeof EXAM_TYPE_COLORS] || "from-gray-500 to-gray-600"} rounded-lg p-4 text-white text-center`}
                              >
                                <div className="text-lg font-bold">{count}</div>
                                <div className="text-sm capitalize">{type}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Recent Exams */}
                      {dashboardData?.trends?.recentExams && (
                        <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 border border-purple-100/50">
                          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <Clock className="w-5 h-5 text-purple-600" />
                            Recent Exams
                          </h2>
                          <div className="space-y-3">
                            {dashboardData.trends.recentExams.slice(0, 4).map((exam: any) => (
                              <div
                                key={exam.id}
                                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                              >
                                <div className="flex items-center gap-3">
                                  <div className={`w-10 h-10 bg-gradient-to-br ${EXAM_TYPE_COLORS[exam.type as keyof typeof EXAM_TYPE_COLORS] || "from-gray-500 to-gray-600"} rounded-lg flex items-center justify-center text-white`}>
                                    <FileText className="w-5 h-5" />
                                  </div>
                                  <div>
                                    <h3 className="font-medium text-gray-900">{exam.name}</h3>
                                    <p className="text-sm text-gray-600">{exam.duration}min • {exam.course}</p>
                                  </div>
                                </div>
                                <button className="px-3 py-2 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-1">
                                  <PlayCircle className="w-4 h-4" />
                                  Start
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                      <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 border border-purple-100/50">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
                        <div className="space-y-3">
                          <button className="w-full bg-purple-600 text-white rounded-lg p-3 text-left hover:bg-purple-700 transition-colors flex items-center justify-between">
                            <span>Start New Exam</span>
                            <ArrowRight className="w-4 h-4" />
                          </button>
                          <button className="w-full bg-green-600 text-white rounded-lg p-3 text-left hover:bg-green-700 transition-colors flex items-center justify-between">
                            <span>View Progress</span>
                            <ArrowRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 border border-blue-100/50">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Study Stats</h3>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Study Time</span>
                            <span className="font-medium">{Math.floor(studentProgress.totalStudyTime / 60)}h</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Accuracy</span>
                            <span className="font-medium text-green-600">{studentProgress.accuracy}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Level</span>
                            <span className="font-medium text-purple-600">{studentProgress.level}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === "exams" && dashboardData?.trends?.recentExams && (
                <motion.div key="exams" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
                  <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 border border-purple-100/50">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900">All Exams</h2>
                        <p className="text-gray-600">Challenge yourself with our exam collection</p>
                      </div>
                      <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                        {dashboardData.trends.recentExams.length} Exams
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {dashboardData.trends.recentExams.map((exam: any) => (
                        <div
                          key={exam.id}
                          className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all cursor-pointer"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className={`w-12 h-12 bg-gradient-to-br ${EXAM_TYPE_COLORS[exam.type as keyof typeof EXAM_TYPE_COLORS] || "from-gray-500 to-gray-600"} rounded-lg flex items-center justify-center text-white`}>
                              <FileText className="w-6 h-6" />
                            </div>
                            <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-medium">
                              {exam.status || "active"}
                            </span>
                          </div>
                          <h3 className="font-bold text-gray-900 mb-2 line-clamp-2">{exam.name}</h3>
                          <p className="text-sm text-gray-600 mb-1">{exam.code}</p>
                          <p className="text-xs text-gray-500 mb-4">Course: {exam.course}</p>
                          
                          <div className="grid grid-cols-3 gap-2 mb-4 text-center">
                            <div>
                              <p className="text-sm font-bold text-gray-900">{exam.duration}m</p>
                              <p className="text-xs text-gray-500">Duration</p>
                            </div>
                            <div>
                              <p className="text-sm font-bold text-gray-900">{exam.totalMarks}</p>
                              <p className="text-xs text-gray-500">Marks</p>
                            </div>
                            <div>
                              <p className="text-sm font-bold text-gray-900">{new Date(exam.date).getDate()}</p>
                              <p className="text-xs text-gray-500">Day</p>
                            </div>
                          </div>

                          <button className="w-full bg-purple-600 text-white font-medium py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2">
                            <PlayCircle className="w-4 h-4" />
                            Start Exam
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === "achievements" && (
                <motion.div key="achievements" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
                  <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 border border-yellow-100/50">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900">Achievements</h2>
                        <p className="text-gray-600">Celebrate your learning milestones</p>
                      </div>
                      <div className="bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                        <Crown className="w-4 h-4" />
                        800 XP
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        { icon: Crown, title: "Silver Scholar", progress: 60, color: "from-yellow-400 to-orange-500", points: 250 },
                        { icon: Zap, title: "3 Day Streak", progress: 43, color: "from-purple-500 to-pink-500", points: 150 },
                        { icon: Rocket, title: "Intermediate Learner", progress: 20, color: "from-blue-500 to-cyan-500", points: 180 },
                        { icon: Trophy, title: "Accuracy Champion", progress: 78, color: "from-green-500 to-emerald-500", points: 220 },
                      ].map((achievement, index) => {
                        const Icon = achievement.icon
                        return (
                          <div
                            key={index}
                            className={`bg-gradient-to-br ${achievement.color} rounded-lg p-4 text-white`}
                          >
                            <div className="flex items-center gap-3 mb-3">
                              <Icon className="w-6 h-6" />
                              <div>
                                <h3 className="font-bold">{achievement.title}</h3>
                                <p className="text-sm opacity-90">{achievement.points} XP</p>
                              </div>
                            </div>
                            <div className="w-full bg-white/20 rounded-full h-2">
                              <div 
                                className="bg-white h-2 rounded-full transition-all duration-1000" 
                                style={{ width: `${achievement.progress}%` }}
                              />
                            </div>
                          </div>
                        )
                      })}
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