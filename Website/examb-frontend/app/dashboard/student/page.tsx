"use client"
import { useState, useEffect } from "react"
import ProtectedRoute from "@/components/ProtectedRoute"
import StudentLayout from "@/components/StudentLayout"
import { studentService } from "@/services/studentService"
import { FileText, Award, Clock, CheckCircle, AlertCircle, Sparkles } from "lucide-react"

export default function StudentDashboard() {
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [recentExams, setRecentExams] = useState<any[]>([])

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch dashboard stats
        const statsResponse = await studentService.getDashboardStats()
        setStats(statsResponse.data)

        // Fetch recent exams
        const examsResponse = await studentService.getAvailableExams({ limit: 5 })
        const examsData = examsResponse.data?.data || examsResponse.data || []
        setRecentExams(examsData)
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
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
            <div className="relative">
              <div className="w-16 h-16 rounded-full border-4 border-purple-200"></div>
              <div className="w-16 h-16 rounded-full border-4 border-purple-600 border-t-transparent animate-spin absolute top-0 left-0"></div>
            </div>
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
