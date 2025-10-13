"use client"
import { useState, useEffect } from "react"
import ProtectedRoute from "@/components/ProtectedRoute"
import StudentLayout from "@/components/StudentLayout"
import { studentService } from "@/services/studentService"
import { FileText, Award, Clock, CheckCircle, AlertCircle, Sparkles, BookOpen, Unlock, Target } from "lucide-react"
import { motion } from "framer-motion"

export default function StudentDashboard() {
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [recentExams, setRecentExams] = useState<any[]>([])
  const [paidCourses, setPaidCourses] = useState<any[]>([])

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        console.log("[v0] Fetching dashboard data...")

        // Fetch dashboard stats
        const statsResponse = await studentService.getDashboardStats()
        console.log("[v0] Dashboard stats:", statsResponse.data)
        setStats(statsResponse.data)

        // Fetch recent exams
        const examsResponse = await studentService.getAvailableExams({ limit: 5 })
        const examsData = examsResponse.data?.data || examsResponse.data || []
        console.log("[v0] Recent exams:", examsData)
        setRecentExams(examsData)

        const coursesResponse = await studentService.getAllCourses()
        const allCourses = coursesResponse.data?.data || coursesResponse.data || []
        const currentStudentId = await studentService.getCurrentStudentId()

        console.log("[v0] All courses:", allCourses)
        console.log("[v0] Current student ID:", currentStudentId)

        if (currentStudentId && Array.isArray(allCourses)) {
          const paid = allCourses.filter((course: any) => {
            const subscription = course.subscribedStudents?.find(
              (sub: any) => sub.studentId?._id === currentStudentId || sub.studentId === currentStudentId,
            )
            return subscription?.coursePaymentStatus === "paid"
          })
          console.log("[v0] Paid courses:", paid)
          setPaidCourses(paid)
        }
      } catch (error) {
        console.error("[v0] Error fetching dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  if (loading) {
    return (
      <ProtectedRoute allowedRole="student">
        <StudentLayout>
          <div className="flex items-center justify-center h-96">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              className="relative"
            >
              <div className="w-16 h-16 rounded-full border-4 border-purple-200"></div>
              <div className="w-16 h-16 rounded-full border-4 border-purple-600 border-t-transparent absolute top-0 left-0"></div>
            </motion.div>
          </div>
        </StudentLayout>
      </ProtectedRoute>
    )
  }

  const statCards = [
    {
      icon: FileText,
      label: "Total Exams",
      value: stats?.totalExams || 0,
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-100",
      iconColor: "text-purple-600",
    },
    {
      icon: CheckCircle,
      label: "Completed",
      value: stats?.completedExams || 0,
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-100",
      iconColor: "text-green-600",
    },
    {
      icon: Clock,
      label: "Pending",
      value: stats?.pendingExams || 0,
      color: "from-orange-500 to-orange-600",
      bgColor: "bg-orange-100",
      iconColor: "text-orange-600",
    },
    {
      icon: Award,
      label: "Average Score",
      value: `${stats?.averageScore || 0}%`,
      color: "from-cyan-500 to-cyan-600",
      bgColor: "bg-cyan-100",
      iconColor: "text-cyan-600",
    },
  ]

  return (
    <ProtectedRoute allowedRole="student">
      <StudentLayout>
        <div className="space-y-8">
          {/* Header */}
          <div className="animate-fadeIn">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-100 to-cyan-100 text-purple-700 rounded-full text-sm font-bold mb-4">
              <Sparkles className="w-4 h-4" />
              Welcome Back
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-2">Student Dashboard</h1>
            <p className="text-xl text-gray-600 font-medium">Track your progress and manage your exams</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-fadeInScale">
            {statCards.map((stat, index) => {
              const Icon = stat.icon
              return (
                <div
                  key={index}
                  className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border-2 border-purple-100/50 shadow-lg hover:shadow-xl transition-all hover:scale-105 group"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`w-14 h-14 ${stat.bgColor} rounded-xl flex items-center justify-center ${stat.iconColor} group-hover:scale-110 transition-transform`}
                    >
                      <Icon className="w-7 h-7" />
                    </div>
                  </div>
                  <div className="text-3xl font-black text-gray-900 mb-1">{stat.value}</div>
                  <div className="text-sm font-semibold text-gray-600">{stat.label}</div>
                </div>
              )
            })}
          </div>

          {paidCourses.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/90 backdrop-blur-sm rounded-2xl border-2 border-green-100/50 shadow-lg overflow-hidden"
            >
              <div className="p-6 border-b border-green-100 bg-gradient-to-r from-green-50 to-emerald-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                      <Unlock className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-black text-gray-900">My Paid Courses</h2>
                      <p className="text-sm text-gray-600">Courses you have full access to</p>
                    </div>
                  </div>
                  <span className="bg-green-500 text-white px-4 py-2 rounded-full text-sm font-bold">
                    {paidCourses.length} Active
                  </span>
                </div>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {paidCourses.map((course) => {
                    const examCount = Array.isArray(course.exams) ? course.exams.length : 0
                    return (
                      <motion.div
                        key={course._id}
                        whileHover={{ scale: 1.02, y: -4 }}
                        className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-5 hover:shadow-lg transition-all cursor-pointer"
                        onClick={() => (window.location.href = `/dashboard/student/courses/${course._id}`)}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center text-white">
                            <BookOpen className="w-6 h-6" />
                          </div>
                          <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" /> Paid
                          </span>
                        </div>
                        <h3 className="font-black text-gray-900 text-lg mb-1 line-clamp-2">{course.name}</h3>
                        <p className="text-sm text-gray-600 mb-3">{course.code}</p>
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2 text-green-700">
                            <Target className="w-4 h-4" />
                            <span className="font-semibold">{examCount} Exams</span>
                          </div>
                          <button className="text-green-600 font-bold hover:text-green-700 transition-colors">
                            View →
                          </button>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              </div>
            </motion.div>
          )}

          {/* Recent Exams */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl border-2 border-purple-100/50 shadow-lg overflow-hidden animate-fadeInScale delay-200">
            <div className="p-6 border-b border-purple-100">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-black text-gray-900">Available Exams</h2>
                  <p className="text-sm text-gray-600 mt-1">Start your exams and track your progress</p>
                </div>
                <button
                  onClick={() => (window.location.href = "/dashboard/student/exams")}
                  className="px-4 py-2 bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-bold rounded-lg hover:shadow-lg transition-all"
                >
                  View All
                </button>
              </div>
            </div>

            <div className="p-6">
              {recentExams.length > 0 ? (
                <div className="space-y-4">
                  {recentExams.map((exam) => (
                    <div
                      key={exam._id}
                      className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-cyan-50 rounded-xl hover:shadow-md transition-all group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-cyan-600 rounded-lg flex items-center justify-center text-white font-bold">
                          <FileText className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900 group-hover:text-purple-600 transition-colors">
                            {exam.title || exam.name}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {exam.duration ? `${exam.duration} minutes` : "No time limit"}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => (window.location.href = `/dashboard/student/exams/${exam._id}`)}
                        className="px-4 py-2 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-all"
                      >
                        Start
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <AlertCircle className="w-8 h-8 text-purple-600" />
                  </div>
                  <p className="text-gray-600 font-medium">No exams available at the moment</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </StudentLayout>
    </ProtectedRoute>
  )
}
