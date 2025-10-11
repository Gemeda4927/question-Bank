"use client"
import { useState, useEffect } from "react"
import ProtectedRoute from "@/components/ProtectedRoute"
import StudentLayout from "@/components/StudentLayout"
import { studentService } from "@/services/studentService"
import { BookOpen, Award, Search } from "lucide-react"

export default function StudentCoursesPage() {
  const [courses, setCourses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    fetchCourses()
  }, [])

  const fetchCourses = async () => {
    try {
      setLoading(true)
      const response = await studentService.getMyCourses()
      const data = response.data?.data || response.data || []
      setCourses(data)
    } catch (error) {
      console.error("Error fetching courses:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredCourses = courses.filter((course) => course.name?.toLowerCase().includes(searchTerm.toLowerCase()))

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
            <BookOpen className="w-8 h-8 text-purple-600" />
            <div>
              <h1 className="text-4xl font-black text-gray-900">My Courses</h1>
              <p className="text-gray-600 font-medium">View and manage your enrolled courses</p>
            </div>
          </div>

          {/* Search */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border-2 border-purple-100/50 shadow-lg">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all"
              />
            </div>
          </div>

          {/* Courses Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <div
                key={course._id}
                className="bg-white/90 backdrop-blur-sm rounded-2xl border-2 border-purple-100/50 shadow-lg hover:shadow-xl transition-all hover:scale-105 overflow-hidden group"
              >
                <div className="bg-gradient-to-r from-cyan-600 to-purple-600 p-6">
                  <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mb-4">
                    <BookOpen className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-black text-white mb-1">{course.name}</h3>
                  <p className="text-sm text-purple-100 font-medium">{course.code}</p>
                </div>

                <div className="p-6 space-y-4">
                  {course.description && <p className="text-sm text-gray-600 line-clamp-3">{course.description}</p>}

                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    {course.creditHours && (
                      <div className="flex items-center gap-1">
                        <Award className="w-4 h-4" />
                        <span className="font-medium">{course.creditHours} Credits</span>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => (window.location.href = `/dashboard/student/courses/${course._id}`)}
                    className="w-full py-3 bg-gradient-to-r from-cyan-600 to-purple-600 text-white font-bold rounded-xl hover:shadow-lg transition-all"
                  >
                    View Course
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredCourses.length === 0 && (
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-12 border-2 border-purple-100/50 shadow-lg text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No courses found</h3>
              <p className="text-gray-600">You are not enrolled in any courses yet.</p>
            </div>
          )}
        </div>
      </StudentLayout>
    </ProtectedRoute>
  )
}
