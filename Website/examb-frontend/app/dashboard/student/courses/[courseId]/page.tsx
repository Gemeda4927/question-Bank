"use client"
import { useEffect, useState } from "react"
import { studentService } from "@/services/studentService"
import { useRouter } from "next/navigation"
import ProtectedRoute from "@/components/ProtectedRoute"
import StudentLayout from "@/components/StudentLayout"
import {
  CheckCircle,
  XCircle,
  Lock,
  Unlock,
  ArrowLeft,
  BookOpen,
  FileText,
  Clock,
  DollarSign,
  Sparkles,
  CreditCard,
  Loader2,
  Award,
  Users,
} from "lucide-react"

export default function CoursePage({ params }: { params: { courseId: string } }) {
  const [course, setCourse] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [paymentLoading, setPaymentLoading] = useState<string | null>(null)

  const router = useRouter()
  const studentId = localStorage.getItem("student") ? JSON.parse(localStorage.getItem("student") || "{}")._id : null

  useEffect(() => {
    fetchCourse()
  }, [params.courseId])

  const fetchCourse = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem("token")
      if (!token) {
        setError("Authentication required")
        return
      }

      const response = await studentService.getAllCourses()
      const allCourses = response.data.data || response.data
      if (!allCourses || !Array.isArray(allCourses)) {
        throw new Error("Invalid API response format")
      }

      const foundCourse = allCourses.find((c: any) => c._id === params.courseId)
      if (!foundCourse) {
        setError("Course not found")
      } else {
        console.log("[v0] Course data:", foundCourse)
        setCourse(foundCourse)
      }
    } catch (err: any) {
      console.error("Error fetching courses:", err.message, err.response?.data || err)
      setError(err.response?.data?.message || "Failed to load courses")
    } finally {
      setLoading(false)
    }
  }

  const handleCoursePayment = async () => {
    try {
      setPaymentLoading("course")
      const response = await studentService.initializeCoursePayment(params.courseId)
      const checkoutUrl = response.data?.checkout_url || response.data?.data?.checkout_url

      if (checkoutUrl) {
        const urlWithParams = `${checkoutUrl}&type=course&name=${encodeURIComponent(course.name)}`
        window.location.href = urlWithParams
      } else {
        alert("Failed to initialize payment. Please try again.")
      }
    } catch (error: any) {
      console.error("Payment error:", error)
      alert(error.response?.data?.message || "Failed to initialize payment")
    } finally {
      setPaymentLoading(null)
    }
  }

  const handleExamPayment = async (examId: string, examName: string) => {
    try {
      setPaymentLoading(examId)
      const response = await studentService.initializeExamPayment(examId, params.courseId)
      const checkoutUrl = response.data?.checkout_url || response.data?.data?.checkout_url

      if (checkoutUrl) {
        const urlWithParams = `${checkoutUrl}&type=exam&name=${encodeURIComponent(examName)}`
        window.location.href = urlWithParams
      } else {
        alert("Failed to initialize payment. Please try again.")
      }
    } catch (error: any) {
      console.error("Payment error:", error)
      alert(error.response?.data?.message || "Failed to initialize payment")
    } finally {
      setPaymentLoading(null)
    }
  }

  const handleEnroll = async () => {
    try {
      setPaymentLoading("enroll")
      await studentService.enrollCourse(params.courseId)
      alert("Successfully enrolled! You can now purchase the course or individual exams.")
      fetchCourse()
    } catch (error: any) {
      console.error("Enrollment error:", error)
      alert(error.response?.data?.message || "Failed to enroll in course")
    } finally {
      setPaymentLoading(null)
    }
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

  if (error || !course) {
    return (
      <ProtectedRoute allowedRole="student">
        <StudentLayout>
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-12 border-2 border-red-100 shadow-lg text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <XCircle className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">{error || "Course not found"}</h3>
            <button
              onClick={() => router.back()}
              className="mt-4 flex items-center justify-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-xl shadow hover:bg-purple-700 transition-all mx-auto"
            >
              <ArrowLeft className="w-5 h-5" /> Go Back
            </button>
          </div>
        </StudentLayout>
      </ProtectedRoute>
    )
  }

  const studentSubscription = course.subscribedStudents?.find((s: any) => s.studentId?._id === studentId)
  const isEnrolled = !!studentSubscription
  const coursePaymentStatus = studentSubscription?.coursePaymentStatus || "unpaid"
  const hasFullAccess = coursePaymentStatus === "paid"

  const examsPaidMap = new Map(studentSubscription?.examsPaid?.map((e: any) => [e.examId, e.paymentStatus]) || [])

  const uniqueExams = (course.exams || []).map((exam: any) => ({
    ...exam,
    paymentStatus: hasFullAccess ? "paid" : examsPaidMap.get(exam._id) || "unpaid",
  }))

  return (
    <ProtectedRoute allowedRole="student">
      <StudentLayout>
        <div className="space-y-6">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-purple-600 font-semibold hover:text-purple-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" /> Back to Courses
          </button>

          <div className="bg-gradient-to-r from-purple-600 to-cyan-600 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-400/20 rounded-full blur-3xl"></div>

            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                  <BookOpen className="w-8 h-8" />
                </div>
                <div>
                  <h1 className="text-4xl font-black mb-1">{course.name}</h1>
                  <p className="text-purple-100 font-semibold">{course.code}</p>
                </div>
              </div>

              {course.description && (
                <p className="text-purple-100 text-lg mb-6 leading-relaxed">{course.description}</p>
              )}

              <div className="flex flex-wrap gap-3 mb-6">
                <span
                  className={`px-4 py-2 rounded-full font-bold text-sm ${
                    hasFullAccess
                      ? "bg-green-500 text-white"
                      : isEnrolled
                        ? "bg-yellow-400 text-gray-900"
                        : "bg-white/20 backdrop-blur-sm"
                  }`}
                >
                  {hasFullAccess ? (
                    <span className="flex items-center gap-2">
                      <Unlock className="w-4 h-4" /> Full Access
                    </span>
                  ) : isEnrolled ? (
                    <span className="flex items-center gap-2">
                      <Lock className="w-4 h-4" /> Enrolled - Payment Required
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Lock className="w-4 h-4" /> Not Enrolled
                    </span>
                  )}
                </span>
                <span className="px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm font-bold text-sm">
                  Level: {course.level}
                </span>
                <span className="px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm font-bold text-sm">
                  Semester: {course.semester}
                </span>
                <span className="px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm font-bold text-sm flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  {course.price} ETB
                </span>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Award className="w-5 h-5" />
                    <span className="text-sm font-medium">Credits</span>
                  </div>
                  <p className="text-2xl font-black">{course.creditHours || 0}</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="w-5 h-5" />
                    <span className="text-sm font-medium">Exams</span>
                  </div>
                  <p className="text-2xl font-black">{uniqueExams.length}</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="w-5 h-5" />
                    <span className="text-sm font-medium">Students</span>
                  </div>
                  <p className="text-2xl font-black">{course.subscribedStudents?.length || 0}</p>
                </div>
              </div>

              {!isEnrolled && (
                <button
                  onClick={handleEnroll}
                  disabled={paymentLoading === "enroll"}
                  className="px-8 py-4 bg-white text-purple-600 font-bold rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105 disabled:opacity-50 flex items-center gap-2"
                >
                  {paymentLoading === "enroll" ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Enrolling...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      Enroll in Course
                    </>
                  )}
                </button>
              )}

              {isEnrolled && !hasFullAccess && (
                <button
                  onClick={handleCoursePayment}
                  disabled={paymentLoading === "course"}
                  className="px-8 py-4 bg-white text-purple-600 font-bold rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105 disabled:opacity-50 flex items-center gap-2"
                >
                  {paymentLoading === "course" ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-5 h-5" />
                      Pay for Full Course Access - {course.price} ETB
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-sm rounded-3xl border-2 border-purple-100/50 shadow-lg overflow-hidden">
            <div className="p-6 border-b border-purple-100 bg-gradient-to-r from-purple-50 to-cyan-50">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <FileText className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-gray-900">Course Exams</h2>
                  <p className="text-sm text-gray-600">
                    {hasFullAccess
                      ? "You have full access to all exams"
                      : "Purchase individual exams or buy full course access"}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6">
              {uniqueExams.length > 0 ? (
                <div className="space-y-4">
                  {uniqueExams.map((exam: any) => {
                    const examPaid = exam.paymentStatus === "paid"
                    const canAccess = hasFullAccess || examPaid

                    return (
                      <div
                        key={exam._id}
                        className={`p-6 rounded-2xl border-2 transition-all hover:shadow-lg ${
                          canAccess
                            ? "bg-gradient-to-r from-green-50 to-emerald-50 border-green-200"
                            : "bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200"
                        }`}
                      >
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <div
                                className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                                  canAccess ? "bg-green-100" : "bg-gray-200"
                                }`}
                              >
                                {canAccess ? (
                                  <Unlock className="w-5 h-5 text-green-600" />
                                ) : (
                                  <Lock className="w-5 h-5 text-gray-500" />
                                )}
                              </div>
                              <h3 className="font-black text-gray-900 text-lg">{exam.name}</h3>
                            </div>
                            {exam.description && <p className="text-gray-600 text-sm mb-2">{exam.description}</p>}
                            {exam.duration && (
                              <div className="flex items-center gap-2 text-sm text-gray-500">
                                <Clock className="w-4 h-4" />
                                <span>{exam.duration} minutes</span>
                              </div>
                            )}
                          </div>

                          <div className="flex items-center gap-3">
                            {canAccess ? (
                              <>
                                <span className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-bold">
                                  <CheckCircle className="w-4 h-4" />
                                  Unlocked
                                </span>
                                <button
                                  onClick={() => router.push(`/dashboard/student/exams/${exam._id}`)}
                                  className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold rounded-xl hover:shadow-lg transition-all hover:scale-105"
                                >
                                  Take Exam
                                </button>
                              </>
                            ) : (
                              <>
                                <span className="inline-flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-full text-sm font-bold">
                                  <XCircle className="w-4 h-4" />
                                  Locked
                                </span>
                                {isEnrolled && (
                                  <button
                                    onClick={() => handleExamPayment(exam._id, exam.name)}
                                    disabled={paymentLoading === exam._id}
                                    className="px-6 py-3 bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-bold rounded-xl hover:shadow-lg transition-all hover:scale-105 disabled:opacity-50 flex items-center gap-2"
                                  >
                                    {paymentLoading === exam._id ? (
                                      <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Processing...
                                      </>
                                    ) : (
                                      <>
                                        <CreditCard className="w-5 h-5" />
                                        Pay {exam.price || Math.round(course.price / uniqueExams.length)} ETB
                                      </>
                                    )}
                                  </button>
                                )}
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-8 h-8 text-purple-600" />
                  </div>
                  <p className="text-gray-600 font-medium">No exams available for this course yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </StudentLayout>
    </ProtectedRoute>
  )
}
