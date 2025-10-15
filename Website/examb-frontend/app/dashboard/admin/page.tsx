"use client"
import AdminLayout from "@/components/AdminLayout"
import ProtectedRoute from "@/components/ProtectedRoute"
import { useEffect, useState } from "react"
import { adminService } from "@/services/adminService"
import {
  Users,
  GraduationCap,
  FileText,
  School,
  HelpCircle,
  CreditCard,
  TrendingUp,
  TrendingDown,
  Activity,
  ArrowUpRight,
  Sparkles,
  Clock,
  CheckCircle2,
  AlertCircle,
  Calendar,
  DollarSign,
  UserCheck,
  Award,
  BarChart3,
  RefreshCw,
  AlertTriangle,
} from "lucide-react"

interface Stats {
  totalUsers: number
  totalUniversities: number
  totalExams: number
  totalCourses: number
  totalQuestions: number
  totalPayments: number
}

interface RecentActivity {
  id: string
  type: string
  message: string
  time: string
  icon: any
  color: string
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [userProfile, setUserProfile] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    fetchStats()
    const token = localStorage.getItem("token")
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]))
        setUserProfile({
          name: payload.name || "Admin User",
          email: payload.email || "admin@examb.com",
          role: payload.role || "admin",
          avatar: payload.avatar || null,
        })
      } catch (error) {
        console.error("Error parsing token:", error)
      }
    }
  }, [])

  const fetchStats = async () => {
    try {
      setRefreshing(true)
      setError(null)

      const [usersRes, universitiesRes, examsRes, coursesRes, questionsRes, paymentsRes] = await Promise.allSettled([
        adminService.getUsers(),
        adminService.getUniversities(),
        adminService.getExams(),
        adminService.getCourses(),
        adminService.getQuestions(),
        adminService.getPayments(),
      ])

      setStats({
        totalUsers:
          usersRes.status === "fulfilled" ? usersRes.value.data.totalCount || usersRes.value.data.length || 0 : 1247,
        totalUniversities:
          universitiesRes.status === "fulfilled"
            ? universitiesRes.value.data.totalCount || universitiesRes.value.data.length || 0
            : 45,
        totalExams:
          examsRes.status === "fulfilled" ? examsRes.value.data.totalCount || examsRes.value.data.length || 0 : 328,
        totalCourses:
          coursesRes.status === "fulfilled"
            ? coursesRes.value.data.totalCount || coursesRes.value.data.length || 0
            : 156,
        totalQuestions:
          questionsRes.status === "fulfilled"
            ? questionsRes.value.data.totalCount || questionsRes.value.data.length || 0
            : 4892,
        totalPayments:
          paymentsRes.status === "fulfilled"
            ? paymentsRes.value.data.totalCount || paymentsRes.value.data.length || 0
            : 892,
      })

      const failedRequests = [usersRes, universitiesRes, examsRes, coursesRes, questionsRes, paymentsRes].filter(
        (res) => res.status === "rejected",
      )

      if (failedRequests.length > 0) {
        setError(`Using placeholder data. ${failedRequests.length} API call(s) failed.`)
      }
    } catch (error) {
      console.error("Error fetching stats:", error)
      setStats({
        totalUsers: 1247,
        totalUniversities: 45,
        totalExams: 328,
        totalCourses: 156,
        totalQuestions: 4892,
        totalPayments: 892,
      })
      setError("Unable to connect to server. Showing placeholder data.")
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const recentActivities: RecentActivity[] = [
    {
      id: "1",
      type: "user",
      message: "New user registration: John Doe",
      time: "2 minutes ago",
      icon: UserCheck,
      color: "text-blue-600",
    },
    {
      id: "2",
      type: "exam",
      message: "Exam 'Advanced Mathematics' was published",
      time: "15 minutes ago",
      icon: CheckCircle2,
      color: "text-emerald-600",
    },
    {
      id: "3",
      type: "payment",
      message: "Payment received: $299.00",
      time: "1 hour ago",
      icon: DollarSign,
      color: "text-green-600",
    },
    {
      id: "4",
      type: "question",
      message: "50 new questions added to question bank",
      time: "2 hours ago",
      icon: HelpCircle,
      color: "text-purple-600",
    },
    {
      id: "5",
      type: "university",
      message: "University profile updated: MIT",
      time: "3 hours ago",
      icon: GraduationCap,
      color: "text-indigo-600",
    },
  ]

  const performanceMetrics = [
    {
      label: "Active Users",
      value: "2,847",
      change: "+12.5%",
      positive: true,
      icon: Users,
      color: "from-blue-500 to-cyan-500",
    },
    {
      label: "Exam Completion Rate",
      value: "87.3%",
      change: "+5.2%",
      positive: true,
      icon: Award,
      color: "from-emerald-500 to-teal-500",
    },
    {
      label: "Avg. Score",
      value: "78.5%",
      change: "+3.1%",
      positive: true,
      icon: BarChart3,
      color: "from-purple-500 to-pink-500",
    },
    {
      label: "Revenue",
      value: "$45.2K",
      change: "+18.7%",
      positive: true,
      icon: DollarSign,
      color: "from-orange-500 to-amber-500",
    },
  ]

  const statCards = [
    {
      title: "Total Users",
      value: stats?.totalUsers,
      icon: Users,
      gradient: "from-blue-500 via-blue-600 to-indigo-600",
      bgGradient: "from-blue-50 to-indigo-50",
      iconBg: "bg-gradient-to-br from-blue-500 to-indigo-600",
      path: "/dashboard/admin/users",
      change: "+12%",
      changePositive: true,
    },
    {
      title: "Universities",
      value: stats?.totalUniversities,
      icon: GraduationCap,
      gradient: "from-purple-500 via-purple-600 to-pink-600",
      bgGradient: "from-purple-50 to-pink-50",
      iconBg: "bg-gradient-to-br from-purple-500 to-pink-600",
      path: "/dashboard/admin/universities",
      change: "+5%",
      changePositive: true,
    },
    {
      title: "Exams",
      value: stats?.totalExams,
      icon: FileText,
      gradient: "from-emerald-500 via-emerald-600 to-teal-600",
      bgGradient: "from-emerald-50 to-teal-50",
      iconBg: "bg-gradient-to-br from-emerald-500 to-teal-600",
      path: "/dashboard/admin/exams",
      change: "+18%",
      changePositive: true,
    },
    {
      title: "Courses",
      value: stats?.totalCourses,
      icon: School,
      gradient: "from-orange-500 via-orange-600 to-amber-600",
      bgGradient: "from-orange-50 to-amber-50",
      iconBg: "bg-gradient-to-br from-orange-500 to-amber-600",
      path: "/dashboard/admin/courses",
      change: "+8%",
      changePositive: true,
    },
    {
      title: "Questions",
      value: stats?.totalQuestions,
      icon: HelpCircle,
      gradient: "from-cyan-500 via-cyan-600 to-blue-600",
      bgGradient: "from-cyan-50 to-blue-50",
      iconBg: "bg-gradient-to-br from-cyan-500 to-blue-600",
      path: "/dashboard/admin/questions",
      change: "+24%",
      changePositive: true,
    },
    {
      title: "Payments",
      value: stats?.totalPayments,
      icon: CreditCard,
      gradient: "from-pink-500 via-pink-600 to-rose-600",
      bgGradient: "from-pink-50 to-rose-50",
      iconBg: "bg-gradient-to-br from-pink-500 to-rose-600",
      path: "/dashboard/admin/payments",
      change: "+15%",
      changePositive: true,
    },
  ]

  if (loading) {
    return (
      <ProtectedRoute allowedRole="admin">
        <AdminLayout>
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center space-y-6">
              <div className="relative w-24 h-24 mx-auto">
                <div className="absolute inset-0 border-4 border-purple-200 rounded-full animate-ping"></div>
                <div className="relative w-24 h-24 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
              <div>
                <h2 className="text-2xl font-black text-gray-900 mb-2">Loading Dashboard</h2>
                <p className="text-gray-600 font-medium">Gathering your analytics...</p>
              </div>
            </div>
          </div>
        </AdminLayout>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute allowedRole="admin">
      <AdminLayout>
        {error && (
          <div className="mb-6 p-4 bg-yellow-50 border-2 border-yellow-200 rounded-2xl flex items-start gap-3 animate-fadeIn">
            <AlertTriangle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-bold text-yellow-900 mb-1">Connection Issue</p>
              <p className="text-sm text-yellow-700">{error}</p>
            </div>
            <button
              onClick={fetchStats}
              disabled={refreshing}
              className="px-4 py-2 bg-yellow-600 text-white font-bold rounded-lg hover:bg-yellow-700 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
              Retry
            </button>
          </div>
        )}

        <div className="mb-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <div className="flex items-center gap-4 mb-3">
              <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl shadow-lg">
                <Sparkles className="w-7 h-7 text-white" />
              </div>
              <h1 className="text-5xl font-black bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
                Welcome back, {userProfile?.name || "Admin"}!
              </h1>
            </div>
            <p className="text-gray-600 text-lg ml-16">Here's what's happening with your platform today.</p>
          </div>
          <div className="hidden lg:flex items-center gap-4 bg-white rounded-2xl p-5 shadow-lg border border-gray-100">
            <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-md">
              {userProfile?.name?.charAt(0) || "A"}
            </div>
            <div>
              <p className="font-bold text-gray-900 text-lg">{userProfile?.name || "Admin User"}</p>
              <p className="text-sm text-gray-500">{userProfile?.email || "admin@examb.com"}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {performanceMetrics.map((metric, index) => {
            const MetricIcon = metric.icon
            return (
              <div
                key={metric.label}
                className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 animate-fadeIn hover:-translate-y-1"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 bg-gradient-to-br ${metric.color} rounded-xl shadow-md`}>
                    <MetricIcon className="w-6 h-6 text-white" />
                  </div>
                  <div
                    className={`flex items-center gap-1.5 text-sm font-bold px-3 py-1.5 rounded-full ${
                      metric.positive ? "text-emerald-600 bg-emerald-50" : "text-red-600 bg-red-50"
                    }`}
                  >
                    {metric.positive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                    {metric.change}
                  </div>
                </div>
                <p className="text-3xl font-black text-gray-900 mb-2">{metric.value}</p>
                <p className="text-sm text-gray-600 font-medium">{metric.label}</p>
              </div>
            )
          })}
        </div>

        {!loading && stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-10">
            {statCards.map((stat, index) => {
              const Icon = stat.icon
              return (
                <div
                  key={stat.title}
                  onClick={() => (window.location.href = stat.path)}
                  className="group relative bg-white rounded-3xl p-8 cursor-pointer hover:shadow-2xl transition-all duration-500 border border-gray-100 overflow-hidden animate-fadeIn hover:-translate-y-2"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${stat.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                  />

                  <div className="relative z-10">
                    <div className="flex items-start justify-between mb-6">
                      <div
                        className={`p-4 rounded-2xl ${stat.iconBg} shadow-lg group-hover:scale-110 transition-transform duration-300`}
                      >
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <div
                        className={`flex items-center gap-2 px-4 py-2 rounded-full ${
                          stat.changePositive ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
                        } text-sm font-bold shadow-sm`}
                      >
                        <TrendingUp className="w-4 h-4" />
                        {stat.change}
                      </div>
                    </div>

                    <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">{stat.title}</h3>
                    <p className="text-5xl font-black bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-5">
                      {stat.value?.toLocaleString() || 0}
                    </p>

                    <div className="flex items-center text-sm font-bold text-gray-600 group-hover:text-purple-600 transition-colors">
                      View details
                      <ArrowUpRight className="w-5 h-5 ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
                    </div>
                  </div>

                  <div
                    className={`absolute -bottom-10 -right-10 w-40 h-40 bg-gradient-to-br ${stat.gradient} rounded-full opacity-10 group-hover:opacity-20 transition-opacity duration-500`}
                  />
                </div>
              )
            })}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          {/* Recent Activity */}
          <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl shadow-md">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-3xl font-black text-gray-900">Recent Activity</h2>
            </div>

            <div className="space-y-4">
              {recentActivities.map((activity, index) => {
                const ActivityIcon = activity.icon
                return (
                  <div
                    key={activity.id}
                    className="flex items-start gap-4 p-5 rounded-2xl hover:bg-gray-50 transition-colors duration-200 animate-fadeIn border border-transparent hover:border-gray-200"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className={`p-3 rounded-xl bg-gray-100 ${activity.color} shadow-sm`}>
                      <ActivityIcon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 mb-2">{activity.message}</p>
                      <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
                        <Clock className="w-4 h-4" />
                        {activity.time}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-md">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-3xl font-black text-gray-900">Quick Actions</h2>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {[
                {
                  title: "Manage Users",
                  desc: "Add, edit, or remove users",
                  path: "/dashboard/admin/users",
                  icon: Users,
                  gradient: "from-blue-500 to-indigo-600",
                },
                {
                  title: "Manage Universities",
                  desc: "Handle university data",
                  path: "/dashboard/admin/universities",
                  icon: GraduationCap,
                  gradient: "from-purple-500 to-pink-600",
                },
                {
                  title: "Manage Exams",
                  desc: "Create and manage exams",
                  path: "/dashboard/admin/exams",
                  icon: FileText,
                  gradient: "from-emerald-500 to-teal-600",
                },
                {
                  title: "View Payments",
                  desc: "Payment transactions",
                  path: "/dashboard/admin/payments",
                  icon: CreditCard,
                  gradient: "from-pink-500 to-rose-600",
                },
              ].map((action, index) => {
                const ActionIcon = action.icon
                return (
                  <button
                    key={action.title}
                    onClick={() => (window.location.href = action.path)}
                    className="group relative p-5 border-2 border-gray-100 rounded-2xl hover:border-transparent hover:shadow-xl transition-all duration-300 text-left overflow-hidden animate-fadeIn"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`p-3 bg-gradient-to-br ${action.gradient} rounded-xl group-hover:scale-110 transition-transform duration-300 shadow-md`}
                      >
                        <ActionIcon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-black text-gray-900 mb-1 text-lg">{action.title}</h3>
                        <p className="text-sm text-gray-600 font-medium">{action.desc}</p>
                      </div>
                      <ArrowUpRight className="w-6 h-6 text-gray-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300" />
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 bg-gradient-to-br from-orange-500 to-amber-600 rounded-2xl shadow-md">
              <AlertCircle className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-3xl font-black text-gray-900">System Status</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-emerald-50 border-2 border-emerald-200 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                <span className="font-black text-emerald-900 text-lg">All Systems Operational</span>
              </div>
              <p className="text-sm text-emerald-700 font-medium">Platform running smoothly</p>
            </div>

            <div className="p-6 rounded-2xl bg-blue-50 border-2 border-blue-200 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <Calendar className="w-6 h-6 text-blue-600" />
                <span className="font-black text-blue-900 text-lg">Last Backup</span>
              </div>
              <p className="text-sm text-blue-700 font-medium">2 hours ago</p>
            </div>

            <div className="p-6 rounded-2xl bg-purple-50 border-2 border-purple-200 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <Activity className="w-6 h-6 text-purple-600" />
                <span className="font-black text-purple-900 text-lg">Server Uptime</span>
              </div>
              <p className="text-sm text-purple-700 font-medium">99.9% (30 days)</p>
            </div>
          </div>
        </div>
      </AdminLayout>
    </ProtectedRoute>
  )
}
