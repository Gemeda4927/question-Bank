"use client"
import { useState, useEffect } from "react"
import ProtectedRoute from "@/components/ProtectedRoute"
import StudentLayout from "@/components/StudentLayout"
import { studentService } from "@/services/studentService"
import CourseCard from "@/components/CourseCard"
import SubscriptionModal from "@/components/SubscriptionModal"
import { BookOpen, Search, AlertCircle, RefreshCw, Flame, TrendingUp } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"

// Type definitions
interface Program {
  _id: string
  name: string
  code?: string
}

interface Instructor {
  _id: string
  name: string
  email?: string
}

interface Exam {
  _id: string
  name: string
  description?: string
  price?: number
}

interface SubscribedStudent {
  studentId: {
    _id: string
    name: string
    email: string
  }
  coursePaymentStatus: "paid" | "unpaid" | "pending" | "failed"
  examsPaid: Array<{
    examId: string
    paymentStatus: "paid" | "unpaid" | "pending" | "failed"
    paidAt: string | null
    _id: string
  }>
  _id: string
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
  programId?: Program | string
  exams?: Exam[] | string[]
  subscribedStudents?: SubscribedStudent[]
  prerequisites?: string[]
  instructors?: Instructor[] | string[]
  createdAt?: string
  updatedAt?: string
  isDeleted?: boolean
}

interface EnrollmentStatus {
  isEnrolled: boolean
  hasPaid: boolean
  enrolledExams: string[]
  paymentStatus: "paid" | "unpaid" | "pending" | "failed"
}

interface SubscriptionModalData {
  course: Course | null
  showModal: boolean
}

export default function MarketplacePage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [enrollmentStatus, setEnrollmentStatus] = useState<Map<string, EnrollmentStatus>>(new Map())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [processingPayment, setProcessingPayment] = useState<string | null>(null)
  const [selectedLevel, setSelectedLevel] = useState<string>("all")
  const [selectedSemester, setSelectedSemester] = useState<string>("all")
  const [subscriptionModal, setSubscriptionModal] = useState<SubscriptionModalData>({
    course: null,
    showModal: false,
  })
  const [selectedExamId, setSelectedExamId] = useState<string>("")

  useEffect(() => {
    fetchData()
  }, [])

  const extractCoursesData = (response: any): Course[] => {
    console.log("logAPI Response:", response)

    if (response?.status === "success" && Array.isArray(response?.data)) {
      return response.data
    }

    if (response?.data?.status === "success" && Array.isArray(response?.data?.data)) {
      return response.data.data
    }

    if (Array.isArray(response?.data)) {
      return response.data
    }

    if (response?.data && typeof response.data === "object" && response.data._id) {
      return [response.data]
    }

    console.warn("logUnexpected API response structure:", response)
    return []
  }

  const checkEnrollmentStatus = async (course: Course): Promise<EnrollmentStatus> => {
    try {
      const currentStudentId = await studentService.getCurrentStudentId()
      console.log("Current Student ID:", currentStudentId) // Debug current student
      if (!currentStudentId) {
        console.warn("No current student ID found.")
        return {
          isEnrolled: false,
          hasPaid: false,
          enrolledExams: [],
          paymentStatus: "unpaid",
        }
      }

      console.log(`[Enrollment Check] Student ID: ${currentStudentId} | Course: ${course.name}`)

      const subscriptions = Array.isArray(course.subscribedStudents) ? course.subscribedStudents : []

      const studentSubscription = subscriptions.find((sub) => {
        if (!sub || !sub.studentId) return false
        const studentId = typeof sub.studentId === "object" ? sub.studentId._id : sub.studentId
        console.log(`Checking subscription for student: ${studentId}`) // Debug subscription check
        return studentId === currentStudentId
      })

      if (studentSubscription) {
        const exams = (studentSubscription.examsPaid || []).map((exam) => ({
          examId: exam.examId,
          paid: exam.paymentStatus === "paid",
        }))

        const hasPaid = studentSubscription.coursePaymentStatus === "paid"
        console.log("[Enrollment Found]", {
          course: course.name,
          studentId: currentStudentId,
          coursePaymentStatus: studentSubscription.coursePaymentStatus,
          exams,
        })

        return {
          isEnrolled: true,
          hasPaid,
          enrolledExams: exams.filter((e) => e.paid).map((e) => e.examId),
          paymentStatus: studentSubscription.coursePaymentStatus,
        }
      }

      console.log(`[Not Enrolled] Student ID: ${currentStudentId} | Course: ${course.name}`)
      return {
        isEnrolled: false,
        hasPaid: false,
        enrolledExams: [],
        paymentStatus: "unpaid",
      }
    } catch (error) {
      console.error("[Enrollment Check Error]:", error)
      return {
        isEnrolled: false,
        hasPaid: false,
        enrolledExams: [],
        paymentStatus: "unpaid",
      }
    }
  }

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)
      console.log("logFetching courses...")

      const res = await studentService.getAllCourses()
      console.log("logRaw response:", res)
      const allCourses = extractCoursesData(res)
      setCourses(allCourses)

      const statusMap = new Map<string, EnrollmentStatus>()
      for (const course of allCourses) {
        const status = await checkEnrollmentStatus(course)
        statusMap.set(course._id, status)
        console.log("logCourse enrollment status:", {
          course: course.name,
          isEnrolled: status.isEnrolled,
          hasPaid: status.hasPaid,
          paymentStatus: status.paymentStatus,
        })
      }
      setEnrollmentStatus(statusMap)

      if (allCourses.length === 0) {
        toast.info("No courses available at the moment", {
          icon: "📚",
        })
      } else {
        toast.success(`Loaded ${allCourses.length} amazing course${allCourses.length > 1 ? "s" : ""}!`, {
          icon: "🎉",
        })
      }
    } catch (error: any) {
      console.error("logError fetching courses:", error)
      const errorMessage = error.response?.data?.message || error.message || "Failed to load courses."
      setError(errorMessage)
      toast.error(errorMessage, {
        icon: "😞",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSubscribeClick = (course: Course) => {
    setSubscriptionModal({
      course,
      showModal: true,
    })
  }

  const handlePurchase = async (
    courseId: string,
    purchaseType: "full-course" | "exam" = "full-course",
    examId?: string,
  ) => {
    try {
      setProcessingPayment(courseId)
      const course = courses.find((c) => c._id === courseId)

      if (!course) {
        toast.error("Course not found", {
          icon: "❌",
        })
        return
      }

      let response
      if (purchaseType === "exam" && examId) {
        response = await studentService.initializeExamPayment(examId)
        toast.loading("Preparing exam payment...", { icon: "💳" })
      } else {
        response = await studentService.initializeCoursePayment(courseId)
        toast.loading("Preparing course payment...", { icon: "💳" })
      }

      const checkoutUrl = response.data?.checkout_url || response.data?.paymentUrl || response.data?.data?.checkout_url
      if (checkoutUrl) {
        toast.success("Redirecting to secure payment...", { icon: "🔒" })
        window.location.href = checkoutUrl
      } else {
        throw new Error("No checkout URL received")
      }
    } catch (error: any) {
      console.error("logPayment/Enrollment error:", error)
      const errorMessage = error.response?.data?.message || "Failed to process request."
      toast.error(errorMessage, { icon: "⚠️" })
    } finally {
      setProcessingPayment(null)
    }
  }

  const handleViewContent = (courseId: string) => {
    window.location.href = `/dashboard/student/courses/${courseId}`
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
  const semesters = Array.from(new Set(courses.map((c) => c.semester).filter(Boolean))).sort(
    (a, b) => (a || 0) - (b || 0),
  )

  const clearFilters = () => {
    setSearchTerm("")
    setSelectedLevel("all")
    setSelectedSemester("all")
    setSelectedExamId("") // Cleared selected exam
  }

  const CourseCardSkeleton = () => (
    <div className="bg-white rounded-3xl border-2 border-gray-100 shadow-lg overflow-hidden">
      <div className="bg-gradient-to-br from-purple-200 via-pink-200 to-orange-200 p-6 h-36 animate-pulse"></div>
      <div className="p-6 space-y-4">
        <div className="h-7 bg-gray-200 rounded-lg w-3/4 animate-pulse"></div>
        <div className="h-5 bg-gray-200 rounded-lg w-1/2 animate-pulse"></div>
        <div className="h-4 bg-gray-200 rounded-lg w-full animate-pulse"></div>
        <div className="grid grid-cols-4 gap-3 py-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-10 bg-gray-200 rounded-xl animate-pulse"></div>
          ))}
        </div>
        <div className="h-12 bg-gray-200 rounded-xl animate-pulse"></div>
      </div>
    </div>
  )

  return (
    <ProtectedRoute allowedRole="student">
      <StudentLayout>
        <motion.div
          className="space-y-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header Section */}
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <motion.h1
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-5xl font-black bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 text-transparent bg-clip-text tracking-tight mb-2"
              >
                Course Marketplace
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="text-gray-600 text-lg flex items-center gap-2"
              >
                <Flame className="w-5 h-5 text-orange-500 animate-pulse" />
                Discover amazing courses and level up your skills! 🚀
              </motion.p>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={fetchData}
                disabled={loading}
                className="flex items-center gap-2 px-5 py-3 text-sm font-medium text-gray-700 hover:text-gray-900 transition-all disabled:opacity-50 border-2 border-gray-300 rounded-xl hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 shadow-sm hover:shadow-md"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
                Refresh
              </motion.button>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl px-5 py-3 border-2 border-purple-300 shadow-lg"
              >
                <p className="text-xs text-purple-100 font-medium">Available Courses</p>
                <p className="text-2xl font-black text-white">{courses.length}</p>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl px-5 py-3 border-2 border-green-300 shadow-lg"
              >
                <p className="text-xs text-green-100 font-medium">Your Enrollments</p>
                <p className="text-2xl font-black text-white">
                  {Array.from(enrollmentStatus.values()).filter((status) => status.isEnrolled).length}
                </p>
              </motion.div>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-300 rounded-2xl p-5 shadow-lg"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="bg-red-500 p-3 rounded-2xl shadow-md">
                    <AlertCircle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-red-900 font-bold text-lg">Oops! Something went wrong</p>
                    <p className="text-red-700 text-sm">{error}</p>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={fetchData}
                  className="px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl text-sm font-bold hover:shadow-lg transition-all"
                >
                  Try Again
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* Search and Filters */}
          <div className="bg-white border-2 border-gray-200 rounded-3xl p-6 shadow-xl">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative group">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-purple-500 transition-colors" />
                <input
                  type="text"
                  placeholder="🔍 Search for your next adventure..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-14 pr-5 py-4 border-2 border-gray-300 rounded-2xl text-gray-800 placeholder-gray-400 focus:ring-4 focus:ring-purple-200 focus:border-purple-500 transition-all font-medium shadow-sm"
                />
              </div>

              <div className="flex gap-3 flex-wrap">
                <select
                  value={selectedLevel}
                  onChange={(e) => setSelectedLevel(e.target.value)}
                  className="px-5 py-4 rounded-2xl border-2 border-gray-300 bg-white focus:ring-4 focus:ring-blue-200 focus:border-blue-500 text-gray-700 font-medium cursor-pointer min-w-[150px] shadow-sm hover:shadow-md transition-all"
                >
                  <option value="all">🎓 All Levels</option>
                  {levels.map((level) => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
                </select>

                <select
                  value={selectedSemester}
                  onChange={(e) => setSelectedSemester(e.target.value)}
                  className="px-5 py-4 rounded-2xl border-2 border-gray-300 bg-white focus:ring-4 focus:ring-blue-200 focus:border-blue-500 text-gray-700 font-medium cursor-pointer min-w-[170px] shadow-sm hover:shadow-md transition-all"
                >
                  <option value="all">📅 All Semesters</option>
                  {semesters.map((sem) => (
                    <option key={sem} value={sem?.toString()}>
                      Semester {sem}
                    </option>
                  ))}
                </select>

                {(searchTerm || selectedLevel !== "all" || selectedSemester !== "all") && (
                  <motion.button
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={clearFilters}
                    className="px-5 py-4 text-gray-700 hover:text-gray-900 transition-all border-2 border-gray-300 rounded-2xl hover:bg-gradient-to-r hover:from-gray-100 hover:to-gray-200 font-medium whitespace-nowrap shadow-sm hover:shadow-md"
                  >
                    ✨ Clear Filters
                  </motion.button>
                )}
              </div>
            </div>

            {/* Filter Summary */}
            {(searchTerm || selectedLevel !== "all" || selectedSemester !== "all") && (
              <motion.div
                initial={{
                  opacity: 0,
                  height: 0,
                }}
                animate={{
                  opacity: 1,
                  height: "auto",
                }}
                className="mt-5 flex items-center gap-3 text-sm flex-wrap"
              >
                <TrendingUp className="w-5 h-5 text-purple-500" />
                <span className="text-gray-600 font-medium">
                  Showing <span className="text-purple-600 font-bold">{filteredCourses.length}</span> of{" "}
                  <span className="font-bold">{courses.length}</span> courses
                </span>
                {searchTerm && (
                  <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-semibold">
                    "{searchTerm}"
                  </span>
                )}
                {selectedLevel !== "all" && (
                  <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold">
                    {selectedLevel}
                  </span>
                )}
                {selectedSemester !== "all" && (
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
                    Semester {selectedSemester}
                  </span>
                )}
              </motion.div>
            )}
          </div>

          {/* Course Grid */}
          {loading && courses.length === 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <CourseCardSkeleton key={i} />
              ))}
            </div>
          ) : (
            <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              <AnimatePresence mode="popLayout">
                {filteredCourses.map((course, index) => {
                  const status = enrollmentStatus.get(course._id) || {
                    isEnrolled: false,
                    hasPaid: false,
                    enrolledExams: [],
                    paymentStatus: "unpaid",
                  }

                  return (
                    <CourseCard
                      key={course._id}
                      course={course}
                      index={index}
                      status={status}
                      processingPayment={processingPayment}
                      onSubscribeClick={handleSubscribeClick}
                      onViewContent={handleViewContent}
                    />
                  )
                })}
              </AnimatePresence>
            </motion.div>
          )}

          {/* Empty State */}
          {filteredCourses.length === 0 && !loading && (
            <motion.div
              initial={{
                opacity: 0,
                scale: 0.95,
              }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white p-16 rounded-3xl text-center border-2 border-gray-200 shadow-xl"
            >
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{
                  repeat: Number.POSITIVE_INFINITY,
                  duration: 2,
                }}
              >
                <div className="bg-gradient-to-br from-purple-100 to-pink-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto">
                  <BookOpen className="w-12 h-12 text-purple-600" />
                </div>
              </motion.div>
              <h3 className="text-3xl font-black text-gray-900 mb-3 mt-6">
                {searchTerm || selectedLevel !== "all" || selectedSemester !== "all"
                  ? "No courses found 🔍"
                  : "No courses available yet 📚"}
              </h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto text-lg">
                {searchTerm || selectedLevel !== "all" || selectedSemester !== "all"
                  ? "Try adjusting your filters or search terms to discover more courses."
                  : "New courses are coming soon! Check back later for exciting learning opportunities."}
              </p>
              {(searchTerm || selectedLevel !== "all" || selectedSemester !== "all") && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={clearFilters}
                  className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl font-bold hover:shadow-xl transition-all inline-flex items-center gap-3 text-lg"
                >
                  <RefreshCw className="w-5 h-5" /> Clear All Filters
                </motion.button>
              )}
            </motion.div>
          )}

          {/* Subscription Modal */}
          <SubscriptionModal
            course={subscriptionModal.course}
            showModal={subscriptionModal.showModal}
            onClose={() => setSubscriptionModal({ course: null, showModal: false })}
            onPurchase={handlePurchase}
            processingPayment={processingPayment}
          />
        </motion.div>

        {/* Custom Scrollbar Styles */}
        <style jsx global>{`
          .custom-scrollbar::-webkit-scrollbar {
            width: 8px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: #f1f1f1;
            border-radius: 10px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: linear-gradient(
              to bottom,
              #a855f7,
              #ec4899
            );
            border-radius: 10px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: linear-gradient(
              to bottom,
              #9333ea,
              #db2777
            );
          }
        `}</style>
      </StudentLayout>
    </ProtectedRoute>
  )
}
