"use client"
import { useState, useEffect } from "react"
import ProtectedRoute from "@/components/ProtectedRoute"
import StudentLayout from "@/components/StudentLayout"
import { studentService } from "@/services/studentService"
import {
  BookOpen,
  Search,
  ShoppingCart,
  CheckCircle2,
  Loader2,
  Filter,
  Clock,
  Users,
  Award,
  BookMarked,
  Star,
  Sparkles,
} from "lucide-react"
import { motion } from "framer-motion"
import { toast } from "sonner"

export default function MarketplacePage() {
  const [courses, setCourses] = useState<any[]>([])
  const [enrolledCourses, setEnrolledCourses] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [processingPayment, setProcessingPayment] = useState<string | null>(null)
  const [selectedLevel, setSelectedLevel] = useState<string>("all")
  const [selectedSemester, setSelectedSemester] = useState<string>("all")

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const allCoursesRes = await studentService.getAllCourses()
      const myCoursesRes = await studentService.getMyCourses()

      let allCourses = []
      if (Array.isArray(allCoursesRes.data)) {
        allCourses = allCoursesRes.data
      } else if (allCoursesRes.data?.data && Array.isArray(allCoursesRes.data.data)) {
        allCourses = allCoursesRes.data.data
      } else if (allCoursesRes.data?.courses && Array.isArray(allCoursesRes.data.courses)) {
        allCourses = allCoursesRes.data.courses
      }

      let myCourses = []
      if (Array.isArray(myCoursesRes.data)) {
        myCourses = myCoursesRes.data
      } else if (myCoursesRes.data?.data && Array.isArray(myCoursesRes.data.data)) {
        myCourses = myCoursesRes.data.data
      } else if (myCoursesRes.data?.courses && Array.isArray(myCoursesRes.data.courses)) {
        myCourses = myCoursesRes.data.courses
      }

      setCourses(allCourses)
      setEnrolledCourses(new Set(myCourses.map((c: any) => c._id)))
    } catch (error: any) {
      console.error("Error fetching courses:", error)
      toast.error("Failed to load courses")
    } finally {
      setLoading(false)
    }
  }

  const handlePurchase = async (courseId: string) => {
    try {
      setProcessingPayment(courseId)
      const response = await studentService.initializeCoursePayment(courseId)
      const checkoutUrl = response.data?.checkout_url

      if (checkoutUrl) {
        toast.success("Redirecting to payment gateway...")
        window.location.href = checkoutUrl
      } else {
        toast.error("Failed to initialize payment")
      }
    } catch (error: any) {
      console.error("Payment error:", error)
      toast.error(error.response?.data?.message || "Failed to process payment")
    } finally {
      setProcessingPayment(null)
    }
  }

  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.code?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesLevel = selectedLevel === "all" || course.level === selectedLevel
    const matchesSemester = selectedSemester === "all" || course.semester?.toString() === selectedSemester
    return matchesSearch && matchesLevel && matchesSemester
  })

  const levels = Array.from(new Set(courses.map((c) => c.level).filter(Boolean)))
  const semesters = Array.from(new Set(courses.map((c) => c.semester).filter(Boolean))).sort()

  if (loading) {
    return (
      <ProtectedRoute allowedRole="student">
        <StudentLayout>
          <div className="flex items-center justify-center h-96">
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
          </div>
        </StudentLayout>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute allowedRole="student">
      <StudentLayout>
        <motion.div
          className="space-y-6"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <h1 className="text-4xl font-extrabold bg-gradient-to-r from-blue-700 to-indigo-500 text-transparent bg-clip-text tracking-tight">
                Course Marketplace
              </h1>
              <p className="text-gray-600 mt-2 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-500 animate-pulse" />
                Explore, learn, and enroll in your next challenge 🚀
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-br from-blue-50 to-white rounded-xl px-4 py-3 border border-blue-100 shadow-sm">
                <p className="text-xs text-gray-500">Available</p>
                <p className="text-lg font-semibold text-blue-700">{courses.length}</p>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-white rounded-xl px-4 py-3 border border-green-100 shadow-sm">
                <p className="text-xs text-gray-500">Enrolled</p>
                <p className="text-lg font-semibold text-green-700">{enrolledCourses.size}</p>
              </div>
            </div>
          </div>

          {/* Search + Filters */}
          <div className="bg-white/70 backdrop-blur-md border border-gray-200 rounded-2xl p-5 shadow-sm">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="🔍 Search courses by name or code..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-all"
                />
              </div>

              <div className="flex gap-3">
                <select
                  value={selectedLevel}
                  onChange={(e) => setSelectedLevel(e.target.value)}
                  className="px-4 py-3 rounded-xl border border-gray-300 bg-white focus:ring-2 focus:ring-blue-200 focus:border-blue-500 text-gray-700 cursor-pointer"
                >
                  <option value="all">All Levels</option>
                  {levels.map((level) => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
                </select>

                <select
                  value={selectedSemester}
                  onChange={(e) => setSelectedSemester(e.target.value)}
                  className="px-4 py-3 rounded-xl border border-gray-300 bg-white focus:ring-2 focus:ring-blue-200 focus:border-blue-500 text-gray-700 cursor-pointer"
                >
                  <option value="all">All Semesters</option>
                  {semesters.map((sem) => (
                    <option key={sem} value={sem}>
                      Semester {sem}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Courses Grid */}
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6"
          >
            {filteredCourses.map((course, index) => {
              const isEnrolled = enrolledCourses.has(course._id)
              const isProcessing = processingPayment === course._id
              const programName = course.programId?.name || "General"
              const examCount = course.exams?.length || 0
              const studentCount = course.subscribedStudents?.length || 0

              return (
                <motion.div
                  key={course._id}
                  initial={{ opacity: 0, y: 25 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.4 }}
                  whileHover={{ scale: 1.02 }}
                  className="bg-white rounded-2xl border border-gray-100 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
                >
                  <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-6 text-white relative">
                    <div className="flex justify-between items-center mb-4">
                      <div className="bg-white/20 rounded-lg p-3">
                        <BookOpen className="w-6 h-6" />
                      </div>
                      {isEnrolled && (
                        <span className="bg-green-500 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Enrolled
                        </span>
                      )}
                    </div>
                    <h3 className="text-xl font-bold leading-tight mb-1">{course.name}</h3>
                    <p className="text-blue-100 text-sm">{course.code}</p>
                  </div>

                  <div className="p-6 space-y-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Award className="w-4 h-4 text-indigo-500" />
                      <span>{programName}</span>
                    </div>

                    {course.description && (
                      <p className="text-gray-600 text-sm line-clamp-2">{course.description}</p>
                    )}

                    <div className="grid grid-cols-3 border-t border-b border-gray-100 py-3 text-center">
                      <div>
                        <BookMarked className="w-4 h-4 mx-auto text-gray-400" />
                        <p className="text-xs text-gray-500">Credits</p>
                        <p className="font-semibold text-gray-800">{course.creditHours || 0}</p>
                      </div>
                      <div>
                        <Star className="w-4 h-4 mx-auto text-gray-400" />
                        <p className="text-xs text-gray-500">Exams</p>
                        <p className="font-semibold text-gray-800">{examCount}</p>
                      </div>
                      <div>
                        <Users className="w-4 h-4 mx-auto text-gray-400" />
                        <p className="text-xs text-gray-500">Students</p>
                        <p className="font-semibold text-gray-800">{studentCount}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      {course.price && course.price > 0 ? (
                        <div>
                          <span className="text-2xl font-bold text-gray-900">{course.price}</span>
                          <span className="text-sm text-gray-500"> ETB</span>
                        </div>
                      ) : (
                        <span className="text-lg font-semibold text-green-600">Free</span>
                      )}

                      {!isEnrolled ? (
                        <motion.button
                          onClick={() => handlePurchase(course._id)}
                          disabled={isProcessing}
                          whileTap={{ scale: 0.95 }}
                          className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium shadow-sm hover:shadow-lg transition-all flex items-center gap-2 text-sm disabled:opacity-50"
                        >
                          {isProcessing ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" /> Processing...
                            </>
                          ) : (
                            <>
                              <ShoppingCart className="w-4 h-4" />
                              {course.price > 0 ? "Subscribe" : "Enroll"}
                            </>
                          )}
                        </motion.button>
                      ) : (
                        <button
                          disabled
                          className="px-6 py-2.5 bg-green-100 text-green-700 font-medium rounded-lg flex items-center gap-2 text-sm cursor-not-allowed"
                        >
                          <CheckCircle2 className="w-4 h-4" /> Enrolled
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </motion.div>

          {filteredCourses.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white p-12 rounded-2xl text-center border border-gray-100"
            >
              <BookOpen className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900">No courses found</h3>
              <p className="text-gray-600">Try adjusting your filters or search again.</p>
            </motion.div>
          )}
        </motion.div>
      </StudentLayout>
    </ProtectedRoute>
  )
}
