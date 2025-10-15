"use client"
import { useState, useEffect } from "react"
import ProtectedRoute from "@/components/ProtectedRoute"
import StudentLayout from "@/components/StudentLayout"
import { studentService } from "@/services/studentService"
import SubscriptionModal from "@/components/SubscriptionModal"
import { toast } from "sonner"
import HeaderSection from "./HeaderSection"
import ErrorDisplay from "./ErrorDisplay"
import SearchAndFilters from "./SearchAndFilters"
import CourseGrid from "./CourseGrid"
import EmptyState from "./EmptyState"

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
      console.log("Current Student ID:", currentStudentId)
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
        console.log(`Checking subscription for student: ${studentId}`)
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
        toast.info("No courses available at the moment", { icon: "📚" })
      } else {
        toast.success(`Loaded ${allCourses.length} amazing course${allCourses.length > 1 ? "s" : ""}!`, { icon: "🎉" })
      }
    } catch (error: any) {
      console.error("logError fetching courses:", error)
      const errorMessage = error.response?.data?.message || error.message || "Failed to load courses."
      setError(errorMessage)
      toast.error(errorMessage, { icon: "😞" })
    } finally {
      setLoading(false)
    }
  }

  const handleSubscribeClick = (course: Course) => {
    setSubscriptionModal({ course, showModal: true })
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
        toast.error("Course not found", { icon: "❌" })
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
  }

  return (
    <ProtectedRoute allowedRole="student">
      <StudentLayout>
        <div className="space-y-8">
          <HeaderSection
            coursesLength={courses.length}
            enrollmentsLength={Array.from(enrollmentStatus.values()).filter((status) => status.isEnrolled).length}
            loading={loading}
            onRefresh={fetchData}
          />
          <ErrorDisplay error={error} onRetry={fetchData} />
          <SearchAndFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedLevel={selectedLevel}
            setSelectedLevel={setSelectedLevel}
            selectedSemester={selectedSemester}
            setSelectedSemester={setSelectedSemester}
            levels={levels}
            semesters={semesters}
            clearFilters={clearFilters}
            filteredCoursesLength={filteredCourses.length}
            totalCoursesLength={courses.length}
          />
          <CourseGrid
            courses={filteredCourses}
            enrollmentStatus={enrollmentStatus}
            processingPayment={processingPayment}
            onSubscribeClick={handleSubscribeClick}
            onViewContent={handleViewContent}
            loading={loading}
          />
          <EmptyState
            filteredCoursesLength={filteredCourses.length}
            loading={loading}
            searchTerm={searchTerm}
            selectedLevel={selectedLevel}
            selectedSemester={selectedSemester}
            clearFilters={clearFilters}
          />
          <SubscriptionModal
            course={subscriptionModal.course}
            showModal={subscriptionModal.showModal}
            onClose={() => setSubscriptionModal({ course: null, showModal: false })}
            onPurchase={handlePurchase}
            processingPayment={processingPayment}
          />
          <CustomScrollbarStyles />
        </div>
      </StudentLayout>
    </ProtectedRoute>
  )
}

function CustomScrollbarStyles() {
  return (
    <style jsx global>{`
      .custom-scrollbar::-webkit-scrollbar {
        width: 8px;
      }
      .custom-scrollbar::-webkit-scrollbar-track {
        background: #f1f1f1;
        border-radius: 10px;
      }
      .custom-scrollbar::-webkit-scrollbar-thumb {
        background: linear-gradient(to bottom, #a855f7, #ec4899);
        border-radius: 10px;
      }
      .custom-scrollbar::-webkit-scrollbar-thumb:hover {
        background: linear-gradient(to bottom, #9333ea, #db2777);
      }
    `}</style>
  )
}