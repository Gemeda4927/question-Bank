"use client"
import { useState, useEffect } from "react"
import ProtectedRoute from "@/components/ProtectedRoute"
import StudentLayout from "@/components/StudentLayout"
import { studentService } from "@/services/studentService"
import { FileText, Clock, Search, CreditCard } from "lucide-react"

export default function StudentExamsPage() {
  const [exams, setExams] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

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
          <div className="flex items-center justify-center h-[70vh]">
            <div className="relative">
              <div className="w-16 h-16 rounded-full border-4 border-purple-200"></div>
              <div className="w-16 h-16 rounded-full border-4 border-t-transparent border-purple-600 animate-spin absolute top-0 left-0"></div>
            </div>
          </div>
        </StudentLayout>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute allowedRole="student">
      <StudentLayout>
        <div className="space-y-10">
          {/* Header */}
          <div className="flex items-center gap-4 mb-4">
            <FileText className="w-10 h-10 text-purple-600 drop-shadow-md" />
            <div>
              <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight bg-gradient-to-r from-purple-600 via-pink-500 to-cyan-500 bg-clip-text text-transparent">
                My Exams
              </h1>
              <p className="text-gray-600 font-medium">Explore your upcoming and active exams</p>
            </div>
          </div>

          {/* Search */}
          <div className="bg-gradient-to-r from-purple-50 via-white to-cyan-50 rounded-3xl p-6 shadow-lg border border-purple-100/50 backdrop-blur-sm">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search exams..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all text-gray-800"
                />
              </div>
            </div>
          </div>

          {/* Exam Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredExams.map((exam) => (
              <div
                key={exam._id}
                className="group relative overflow-hidden rounded-3xl shadow-lg bg-white/70 backdrop-blur-lg border border-purple-100 transition-all hover:scale-[1.03] hover:shadow-2xl"
              >
                {/* Top Gradient Banner */}
                <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 p-6 text-white relative">
                  <div className="absolute inset-0 bg-[url('/textures/noise.svg')] opacity-10"></div>

                  <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mb-4">
                    <FileText className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-1">{exam.title || exam.name}</h3>

                  {exam.price && (
                    <div className="flex items-center gap-1 text-sm text-white/90">
                      <CreditCard className="w-4 h-4" />
                      <span className="font-semibold">${exam.price.toFixed(2)}</span>
                    </div>
                  )}
                </div>

                {/* Exam Info */}
                <div className="p-6 space-y-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="w-4 h-4 text-purple-500" />
                    <span className="font-medium">
                      {exam.duration ? `${exam.duration} min` : "No time limit"}
                    </span>
                  </div>

                  {exam.description && (
                    <p className="text-sm text-gray-700 line-clamp-2 leading-relaxed">
                      {exam.description}
                    </p>
                  )}

                  <button
                    onClick={() => (window.location.href = `/dashboard/student/exams/${exam._id}`)}
                    className="relative w-full py-3 mt-2 rounded-xl font-semibold text-white text-sm 
                    bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-cyan-600 hover:to-purple-600 
                    shadow-md hover:shadow-xl transition-all duration-300"
                  >
                    <span className="relative z-10">Start Exam</span>
                    <span className="absolute inset-0 bg-gradient-to-r from-purple-600 to-cyan-600 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl"></span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredExams.length === 0 && (
            <div className="flex flex-col items-center justify-center text-center p-16 bg-white/70 backdrop-blur-xl rounded-3xl border border-purple-100 shadow-lg">
              <div className="w-20 h-20 rounded-full bg-gradient-to-r from-purple-100 to-cyan-100 flex items-center justify-center mb-6">
                <FileText className="w-10 h-10 text-purple-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">No Exams Found</h2>
              <p className="text-gray-600">You currently have no exams assigned.</p>
            </div>
          )}
        </div>
      </StudentLayout>
    </ProtectedRoute>
  )
}
