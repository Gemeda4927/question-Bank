"use client"
import { useState, useEffect } from "react"
import ProtectedRoute from "@/components/ProtectedRoute"
import StudentLayout from "@/components/StudentLayout"
import { studentService } from "@/services/studentService"
import { FileText, Clock, Search } from "lucide-react"

export default function StudentExamsPage() {
  const [exams, setExams] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")

  useEffect(() => {
    fetchExams()
  }, [])

  const fetchExams = async () => {
    try {
      setLoading(true)
      const response = await studentService.getAvailableExams()
      const data = response.data?.data || response.data || []
      setExams(data)
    } catch (error) {
      console.error("Error fetching exams:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredExams = exams.filter((exam) => {
    const matchesSearch =
      exam.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exam.name?.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesSearch
  })

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
            <FileText className="w-8 h-8 text-purple-600" />
            <div>
              <h1 className="text-4xl font-black text-gray-900">My Exams</h1>
              <p className="text-gray-600 font-medium">Browse and take available exams</p>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border-2 border-purple-100/50 shadow-lg">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search exams..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Exams Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredExams.map((exam) => (
              <div
                key={exam._id}
                className="bg-white/90 backdrop-blur-sm rounded-2xl border-2 border-purple-100/50 shadow-lg hover:shadow-xl transition-all hover:scale-105 overflow-hidden group"
              >
                <div className="bg-gradient-to-r from-purple-600 to-cyan-600 p-6">
                  <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mb-4">
                    <FileText className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-black text-white mb-2">{exam.title || exam.name}</h3>
                </div>

                <div className="p-6 space-y-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span className="font-medium">{exam.duration ? `${exam.duration} minutes` : "No time limit"}</span>
                  </div>

                  {exam.description && <p className="text-sm text-gray-600 line-clamp-2">{exam.description}</p>}

                  <button
                    onClick={() => (window.location.href = `/dashboard/student/exams/${exam._id}`)}
                    className="w-full py-3 bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-bold rounded-xl hover:shadow-lg transition-all"
                  >
                    Start Exam
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredExams.length === 0 && (
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-12 border-2 border-purple-100/50 shadow-lg text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No exams found</h3>
              <p className="text-gray-600">There are no exams available at the moment.</p>
            </div>
          )}
        </div>
      </StudentLayout>
    </ProtectedRoute>
  )
}
