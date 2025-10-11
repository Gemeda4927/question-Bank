"use client"
import { useState, useEffect } from "react"
import ProtectedRoute from "@/components/ProtectedRoute"
import StudentLayout from "@/components/StudentLayout"
import { studentService } from "@/services/studentService"
import { BarChart3, TrendingUp, Award, CheckCircle, XCircle, Eye, Calendar } from "lucide-react"

export default function StudentResultsPage() {
  const [results, setResults] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalExams: 0,
    averageScore: 0,
    highestScore: 0,
    lowestScore: 0,
    passedExams: 0,
  })

  useEffect(() => {
    fetchResults()
  }, [])

  const fetchResults = async () => {
    try {
      setLoading(true)
      const response = await studentService.getMyResults()
      const data = response.data?.data || response.data || []
      setResults(data)

      // Calculate stats
      if (data.length > 0) {
        const scores = data.map((r: any) => r.score || 0)
        const total = data.length
        const avg = scores.reduce((a: number, b: number) => a + b, 0) / total
        const highest = Math.max(...scores)
        const lowest = Math.min(...scores)
        const passed = data.filter((r: any) => (r.score || 0) >= 50).length

        setStats({
          totalExams: total,
          averageScore: Math.round(avg),
          highestScore: highest,
          lowestScore: lowest,
          passedExams: passed,
        })
      }
    } catch (error) {
      console.error("Error fetching results:", error)
    } finally {
      setLoading(false)
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600 bg-green-100"
    if (score >= 60) return "text-blue-600 bg-blue-100"
    if (score >= 50) return "text-orange-600 bg-orange-100"
    return "text-red-600 bg-red-100"
  }

  const getScoreIcon = (score: number) => {
    if (score >= 50) return <CheckCircle className="w-5 h-5 text-green-600" />
    return <XCircle className="w-5 h-5 text-red-600" />
  }

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

  return (
    <ProtectedRoute allowedRole="student">
      <StudentLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <BarChart3 className="w-8 h-8 text-purple-600" />
            <div>
              <h1 className="text-4xl font-black text-gray-900">My Results</h1>
              <p className="text-gray-600 font-medium">Track your exam performance and progress</p>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {[
              {
                icon: BarChart3,
                label: "Total Exams",
                value: stats.totalExams,
                color: "from-purple-500 to-purple-600",
                bgColor: "bg-purple-100",
                iconColor: "text-purple-600",
              },
              {
                icon: TrendingUp,
                label: "Average Score",
                value: `${stats.averageScore}%`,
                color: "from-blue-500 to-blue-600",
                bgColor: "bg-blue-100",
                iconColor: "text-blue-600",
              },
              {
                icon: Award,
                label: "Highest Score",
                value: `${stats.highestScore}%`,
                color: "from-green-500 to-green-600",
                bgColor: "bg-green-100",
                iconColor: "text-green-600",
              },
              {
                icon: CheckCircle,
                label: "Passed Exams",
                value: stats.passedExams,
                color: "from-cyan-500 to-cyan-600",
                bgColor: "bg-cyan-100",
                iconColor: "text-cyan-600",
              },
              {
                icon: XCircle,
                label: "Lowest Score",
                value: `${stats.lowestScore}%`,
                color: "from-orange-500 to-orange-600",
                bgColor: "bg-orange-100",
                iconColor: "text-orange-600",
              },
            ].map((stat, index) => {
              const Icon = stat.icon
              return (
                <div
                  key={index}
                  className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border-2 border-purple-100/50 shadow-lg hover:shadow-xl transition-all hover:scale-105 group"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center ${stat.iconColor} group-hover:scale-110 transition-transform`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                  </div>
                  <div className="text-3xl font-black text-gray-900 mb-1">{stat.value}</div>
                  <div className="text-sm font-semibold text-gray-600">{stat.label}</div>
                </div>
              )
            })}
          </div>

          {/* Results List */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl border-2 border-purple-100/50 shadow-lg overflow-hidden">
            <div className="p-6 border-b border-purple-100">
              <h2 className="text-2xl font-black text-gray-900">Exam History</h2>
              <p className="text-sm text-gray-600 mt-1">View detailed results for all your completed exams</p>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-border">
                <thead className="bg-purple-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-purple-900 uppercase tracking-wider">
                      Exam Name
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-purple-900 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-purple-900 uppercase tracking-wider">
                      Score
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-purple-900 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-bold text-purple-900 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {results.length > 0 ? (
                    results.map((result) => (
                      <tr key={result._id} className="hover:bg-purple-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-cyan-600 rounded-lg flex items-center justify-center text-white font-bold">
                              <BarChart3 className="w-5 h-5" />
                            </div>
                            <div>
                              <div className="font-bold text-gray-900">{result.examName || "Exam"}</div>
                              <div className="text-sm text-gray-600">{result.examCode || "N/A"}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Calendar className="w-4 h-4" />
                            {result.completedAt ? new Date(result.completedAt).toLocaleDateString() : "N/A"}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold ${getScoreColor(result.score || 0)}`}
                          >
                            {result.score || 0}%
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            {getScoreIcon(result.score || 0)}
                            <span className="font-semibold text-sm">
                              {(result.score || 0) >= 50 ? "Passed" : "Failed"}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => (window.location.href = `/dashboard/student/results/${result._id}`)}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-all text-sm"
                          >
                            <Eye className="w-4 h-4" />
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center justify-center gap-3">
                          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
                            <BarChart3 className="w-8 h-8 text-purple-600" />
                          </div>
                          <div>
                            <p className="font-bold text-lg text-gray-900 mb-1">No results yet</p>
                            <p className="text-sm text-gray-600">Complete some exams to see your results here</p>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </StudentLayout>
    </ProtectedRoute>
  )
}
