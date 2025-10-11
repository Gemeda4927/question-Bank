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
  Users,
  Award,
  BookMarked,
  Star,
  Sparkles,
  AlertCircle,
  RefreshCw,
} from "lucide-react"
import { motion } from "framer-motion"
import { toast } from "sonner"

// Type definitions
interface Program {
  _id: string
  name: string
  code: string
}

interface Exam {
  _id: string
  name: string
  description: string
}

interface Course {
  _id: string
  name: string
  code: string
  description?: string
  level?: string
  semester?: number
  price?: number
  creditHours?: number
  programId?: Program
  exams?: Exam[]
  subscribedStudents?: any[]
  createdAt?: string
  updatedAt?: string
}

export default function MarketplacePage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [enrolledCourses, setEnrolledCourses] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [processingPayment, setProcessingPayment] = useState<string | null>(null)
  const [selectedLevel, setSelectedLevel] = useState<string>("all")
  const [selectedSemester, setSelectedSemester] = useState<string>("all")

  useEffect(() => {
    fetchData()
  }, [])

  const extractCoursesData = (response: any): Course[] => {
    console.log("API Response:", response)
    
    // Handle the structure from your expected backend response
    if (response.data && response.data.status === "success" && Array.isArray(response.data.data)) {
      return response.data.data
    }
    
    // Handle direct array response
    if (Array.isArray(response.data)) {
      return response.data
    }
    
    // Handle nested data array
    if (response.data && Array.isArray(response.data.data)) {
      return response.data.data
    }
    
    // Handle courses array
    if (response.data && Array.isArray(response.data.courses)) {
      return response.data.courses
    }
    
    console.warn("Unexpected API response structure:", response)
    return []
  }

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      console.log("Starting to fetch courses...")
      
      // Fetch only all courses since enrolled courses endpoint is not available
      const allCoursesRes = await studentService.getAllCourses()

      console.log("All courses raw response:", allCoursesRes)

      // Extract courses from response
      const allCourses = extractCoursesData(allCoursesRes)

      console.log("Extracted all courses:", allCourses)

      setCourses(allCourses)
      
      // Since enrolled courses endpoint is not available, initialize enrolledCourses as empty for now
      setEnrolledCourses(new Set())

      if (allCourses.length === 0) {
        toast.info("No courses available at the moment")
      } else {
        toast.success(`Loaded ${allCourses.length} courses`)
      }
    } catch (error: any) {
      console.error("Error fetching courses:", error)
      
      // More detailed error logging
      if (error.response) {
        console.error("Error response data:", error.response.data)
        console.error("Error response status:", error.response.status)
        console.error("Error response headers:", error.response.headers)
      }
      
      const errorMessage = error.response?.data?.message || error.message || "Failed to load courses. Please try again."
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handlePurchase = async (courseId: string) => {
    try {
      setProcessingPayment(courseId)
      
      // For free courses, enroll directly
      const course = courses.find(c => c._id === courseId)
      if (course && (!course.price || course.price === 0)) {
        console.log("Enrolling in free course:", courseId)
        await studentService.enrollCourse(courseId)
        toast.success("Successfully enrolled in the course!")
        // Update enrolled courses manually since no endpoint exists yet
        setEnrolledCourses(prev => new Set([...prev, courseId]))
        return
      }

      // For paid courses, initialize payment
      console.log("Initializing payment for course:", courseId)
      const response = await studentService.initializeCoursePayment(courseId)
      console.log("Payment response:", response)
      
      const checkoutUrl = response.data?.checkout_url || response.data?.paymentUrl || response.data?.data?.checkout_url

      if (checkoutUrl) {
        toast.success("Redirecting to payment gateway...")
        window.location.href = checkoutUrl
      } else {
        throw new Error("No checkout URL received from payment service")
      }
    } catch (error: any) {
      console.error("Payment/Enrollment error:", error)
      const errorMessage = error.response?.data?.message || "Failed to process request. Please try again."
      toast.error(errorMessage)
    } finally {
      setProcessingPayment(null)
    }
  }

  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesLevel = selectedLevel === "all" || course.level === selectedLevel
    const matchesSemester = selectedSemester === "all" || course.semester?.toString() === selectedSemester
    
    return matchesSearch && matchesLevel && matchesSemester
  })

  const levels = Array.from(new Set(courses.map((c) => c.level).filter(Boolean))).sort()
  const semesters = Array.from(new Set(courses.map((c) => c.semester).filter(Boolean))).sort((a, b) => (a || 0) - (b || 0))

  const clearFilters = () => {
    setSearchTerm("")
    setSelectedLevel("all")
    setSelectedSemester("all")
  }

  // Loading skeleton component
  const CourseCardSkeleton = () => (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-md overflow-hidden animate-pulse">
      <div className="bg-gray-300 p-6 h-32"></div>
      <div className="p-6 space-y-4">
        <div className="h-6 bg-gray-200 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        <div className="h-3 bg-gray-200 rounded w-full"></div>
        <div className="grid grid-cols-3 gap-4 py-3">
          <div className="h-8 bg-gray-200 rounded"></div>
          <div className="h-8 bg-gray-200 rounded"></div>
          <div className="h-8 bg-gray-200 rounded"></div>
        </div>
        <div className="h-10 bg-gray-200 rounded"></div>
      </div>
    </div>
  )

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
              <button
                onClick={fetchData}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors disabled:opacity-50 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
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

          {/* Error Display */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 border border-red-200 rounded-xl p-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-red-100 p-2 rounded-full">
                    <AlertCircle className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <p className="text-red-800 font-medium">Failed to load courses</p>
                    <p className="text-red-600 text-sm">{error}</p>
                    <p className="text-red-500 text-xs mt-1">
                      Check browser console for detailed error information
                    </p>
                  </div>
                </div>
                <button
                  onClick={fetchData}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
                >
                  Retry
                </button>
              </div>
            </motion.div>
          )}

          {/* Search + Filters */}
          <div className="bg-white/70 backdrop-blur-md border border-gray-200 rounded-2xl p-5 shadow-sm">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="🔍 Search courses by name, code, or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-all"
                />
              </div>

              <div className="flex gap-3 flex-wrap">
                <select
                  value={selectedLevel}
                  onChange={(e) => setSelectedLevel(e.target.value)}
                  className="px-4 py-3 rounded-xl border border-gray-300 bg-white focus:ring-2 focus:ring-blue-200 focus:border-blue-500 text-gray-700 cursor-pointer min-w-[140px]"
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
                  className="px-4 py-3 rounded-xl border border-gray-300 bg-white focus:ring-2 focus:ring-blue-200 focus:border-blue-500 text-gray-700 cursor-pointer min-w-[160px]"
                >
                  <option value="all">All Semesters</option>
                  {semesters.map((sem) => (
                    <option key={sem} value={sem?.toString()}>
                      Semester {sem}
                    </option>
                  ))}
                </select>

                {(searchTerm || selectedLevel !== "all" || selectedSemester !== "all") && (
                  <button
                    onClick={clearFilters}
                    className="px-4 py-3 text-gray-600 hover:text-gray-800 transition-colors border border-gray-300 rounded-xl hover:bg-gray-50 whitespace-nowrap"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            </div>

            {/* Active filters indicator */}
            {(searchTerm || selectedLevel !== "all" || selectedSemester !== "all") && (
              <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
                <span>Showing {filteredCourses.length} of {courses.length} courses</span>
                <span className="text-gray-300">•</span>
                <span className="text-blue-600 font-medium">
                  {searchTerm && `Search: "${searchTerm}"`}
                  {selectedLevel !== "all" && ` Level: ${selectedLevel}`}
                  {selectedSemester !== "all" && ` Semester: ${selectedSemester}`}
                </span>
              </div>
            )}
          </div>

          {/* Loading Skeletons */}
          {loading && courses.length === 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {[...Array(6)].map((_, index) => (
                <CourseCardSkeleton key={index} />
              ))}
            </div>
          ) : (
            /* Courses Grid */
            <motion.div
              layout
              className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6"
            >
              {filteredCourses.map((course, index) => {
                const isEnrolled = enrolledCourses.has(course._id)
                const isProcessing = processingPayment === course._id
                const programName = course.programId?.name || "General Program"
                const examCount = course.exams?.length || 0
                const studentCount = course.subscribedStudents?.length || 0
                const isFree = !course.price || course.price === 0

                return (
                  <motion.div
                    key={course._id}
                    initial={{ opacity: 0, y: 25 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.4 }}
                    whileHover={{ scale: 1.02 }}
                    className="bg-white rounded-2xl border border-gray-100 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group"
                  >
                    <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-6 text-white relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-10 translate-x-10"></div>
                      <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/10 rounded-full translate-y-8 -translate-x-8"></div>
                      
                      <div className="flex justify-between items-center mb-4 relative z-10">
                        <div className="bg-white/20 rounded-lg p-3 group-hover:scale-110 transition-transform">
                          <BookOpen className="w-6 h-6" />
                        </div>
                        {isEnrolled && (
                          <span className="bg-green-500 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> Enrolled
                          </span>
                        )}
                      </div>
                      <h3 className="text-xl font-bold leading-tight mb-1 relative z-10 line-clamp-2">
                        {course.name}
                      </h3>
                      <p className="text-blue-100 text-sm relative z-10">{course.code}</p>
                    </div>

                    <div className="p-6 space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Award className="w-4 h-4 text-indigo-500" />
                          <span className="line-clamp-1">{programName}</span>
                        </div>
                        {course.level && (
                          <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-medium">
                            {course.level}
                          </span>
                        )}
                      </div>

                      {course.description && (
                        <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed">
                          {course.description}
                        </p>
                      )}

                      <div className="grid grid-cols-3 border-t border-b border-gray-100 py-3 text-center gap-4">
                        <div>
                          <BookMarked className="w-4 h-4 mx-auto text-gray-400 mb-1" />
                          <p className="text-xs text-gray-500">Credits</p>
                          <p className="font-semibold text-gray-800">{course.creditHours || 0}</p>
                        </div>
                        <div>
                          <Star className="w-4 h-4 mx-auto text-gray-400 mb-1" />
                          <p className="text-xs text-gray-500">Exams</p>
                          <p className="font-semibold text-gray-800">{examCount}</p>
                        </div>
                        <div>
                          <Users className="w-4 h-4 mx-auto text-gray-400 mb-1" />
                          <p className="text-xs text-gray-500">Students</p>
                          <p className="font-semibold text-gray-800">{studentCount}</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        {!isFree ? (
                          <div>
                            <span className="text-2xl font-bold text-gray-900">ETB {course.price}</span>
                            <span className="text-sm text-gray-500 block">One-time payment</span>
                          </div>
                        ) : (
                          <div>
                            <span className="text-2xl font-bold text-green-600">Free</span>
                            <span className="text-sm text-gray-500 block">Lifetime access</span>
                          </div>
                        )}

                        {!isEnrolled ? (
                          <motion.button
                            onClick={() => handlePurchase(course._id)}
                            disabled={isProcessing}
                            whileTap={{ scale: 0.95 }}
                            className={`px-6 py-2.5 rounded-lg font-medium shadow-sm hover:shadow-lg transition-all flex items-center gap-2 text-sm disabled:opacity-50 ${
                              isFree 
                                ? "bg-green-600 hover:bg-green-700 text-white" 
                                : "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700"
                            }`}
                          >
                            {isProcessing ? (
                              <>
                                <Loader2 className="w-4 h-4 animate-spin" /> Processing...
                              </>
                            ) : (
                              <>
                                <ShoppingCart className="w-4 h-4" />
                                {isFree ? "Enroll Free" : "Subscribe"}
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
          )}

          {/* Empty State */}
          {filteredCourses.length === 0 && !loading && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white p-12 rounded-2xl text-center border border-gray-100 shadow-sm"
            >
              <BookOpen className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {searchTerm || selectedLevel !== "all" || selectedSemester !== "all" 
                  ? "No courses match your filters" 
                  : "No courses available"
                }
              </h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                {searchTerm || selectedLevel !== "all" || selectedSemester !== "all"
                  ? "Try adjusting your search terms or filters to see more results."
                  : "There are no courses available at the moment. Please check back later for new course offerings."
                }
              </p>
              {(searchTerm || selectedLevel !== "all" || selectedSemester !== "all") && (
                <button
                  onClick={clearFilters}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  Clear all filters
                </button>
              )}
            </motion.div>
          )}
        </motion.div>
      </StudentLayout>
    </ProtectedRoute>
  )
}