"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  BookOpen,
  Users,
  Lock,
  Unlock,
  Search,
  Filter,
  ChevronRight,
  GraduationCap,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Loader2,
} from "lucide-react"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"

interface Student {
  _id: string
  name: string
  email: string
}

interface Program {
  _id: string
  name: string
  code: string
}

interface Instructor {
  _id: string
  name: string
  email: string
}

interface Exam {
  _id: string
  name: string
  description: string
}

interface ExamPayment {
  examId: string
  paymentStatus: "paid" | "pending" | "failed" | "unpaid"
  paidAt: string | null
  _id: string
}

interface SubscribedStudent {
  studentId: Student | string // Can be populated object or just ID
  coursePaymentStatus: "paid" | "pending" | "failed" | "unpaid"
  examsPaid: ExamPayment[]
  _id: string
}

interface Course {
  _id: string
  name: string // Backend uses 'name' not 'title'
  code: string
  description: string
  price: number
  programId: Program
  creditHours: number
  semester: number
  level: string
  prerequisites: string[]
  instructors: Instructor[]
  exams: Exam[]
  isDeleted: boolean
  subscribedStudents: SubscribedStudent[]
  createdAt: string
  updatedAt: string
  __v: number
}

interface EnrollmentStatus {
  isEnrolled: boolean
  hasPaid: boolean
  paymentStatus: "paid" | "pending" | "failed" | "unpaid" | null
  canAccessContent: boolean
}

export default function MarketplacePage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedLevel, setSelectedLevel] = useState("all")
  const [currentUser, setCurrentUser] = useState<Student | null>(null)

  // Fetch current user from localStorage or API
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        // Try to get user from localStorage first
        const storedUser = localStorage.getItem("currentUser")
        if (storedUser) {
          const user = JSON.parse(storedUser)
          setCurrentUser(user)
          console.log("[v0] Current user loaded from localStorage:", user)
        } else {
          // If not in localStorage, fetch from API
          const response = await axios.get("/api/auth/me")
          setCurrentUser(response.data.user)
          localStorage.setItem("currentUser", JSON.stringify(response.data.user))
          console.log("[v0] Current user fetched from API:", response.data.user)
        }
      } catch (error) {
        console.error("[v0] Failed to fetch current user:", error)
        // User might not be logged in, that's okay
      }
    }

    fetchCurrentUser()
  }, [])

  // Fetch courses from API
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true)
        const response = await axios.get("/api/courses")
        const coursesData = response.data.data || response.data.courses || response.data
        console.log("[v0] Fetched courses:", coursesData)
        setCourses(coursesData)
        setFilteredCourses(coursesData)
      } catch (error) {
        console.error("[v0] Failed to fetch courses:", error)
        toast.error("Failed to load courses. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    fetchCourses()
  }, [])

  // Filter courses based on search and filters
  useEffect(() => {
    let filtered = courses

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (course) =>
          course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          course.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
          course.instructors.some((inst) => inst.name.toLowerCase().includes(searchQuery.toLowerCase())),
      )
    }

    // Category filter (using program name as category)
    if (selectedCategory !== "all") {
      filtered = filtered.filter((course) => course.programId.name === selectedCategory)
    }

    // Level filter
    if (selectedLevel !== "all") {
      filtered = filtered.filter((course) => course.level === selectedLevel)
    }

    setFilteredCourses(filtered)
  }, [searchQuery, selectedCategory, selectedLevel, courses])

  const checkEnrollmentStatus = (course: Course): EnrollmentStatus => {
    if (!currentUser) {
      console.log("[v0] No current user, returning not enrolled")
      return {
        isEnrolled: false,
        hasPaid: false,
        paymentStatus: null,
        canAccessContent: false,
      }
    }

    console.log("[v0] Checking enrollment for course:", course.name)
    console.log("[v0] Current user ID:", currentUser._id)
    console.log("[v0] Subscribed students:", course.subscribedStudents)

    // Find enrollment by checking both populated and non-populated studentId
    const enrollment = course.subscribedStudents?.find((sub) => {
      // Handle case where studentId is a populated object
      if (typeof sub.studentId === "object" && sub.studentId !== null) {
        const match = sub.studentId._id === currentUser._id
        console.log(
          "[v0] Comparing populated studentId:",
          sub.studentId._id,
          "with current user:",
          currentUser._id,
          "Match:",
          match,
        )
        return match
      }
      // Handle case where studentId is just a string ID
      const match = sub.studentId === currentUser._id
      console.log(
        "[v0] Comparing string studentId:",
        sub.studentId,
        "with current user:",
        currentUser._id,
        "Match:",
        match,
      )
      return match
    })

    if (!enrollment) {
      console.log("[v0] No enrollment found for this user")
      return {
        isEnrolled: false,
        hasPaid: false,
        paymentStatus: null,
        canAccessContent: false,
      }
    }

    console.log("[v0] Enrollment found:", enrollment)
    console.log("[v0] Payment status:", enrollment.coursePaymentStatus)

    const hasPaid = enrollment.coursePaymentStatus === "paid"

    return {
      isEnrolled: true,
      hasPaid,
      paymentStatus: enrollment.coursePaymentStatus,
      canAccessContent: hasPaid, // Only allow access if payment status is "paid"
    }
  }

  // Handle course enrollment
  const handleEnroll = async (courseId: string) => {
    if (!currentUser) {
      toast.error("Please login to enroll in courses")
      // Redirect to login page
      window.location.href = "/login"
      return
    }

    try {
      const response = await axios.post(`/api/courses/${courseId}/enroll`, {
        studentId: currentUser._id,
      })

      toast.success("Successfully enrolled! Please complete payment to access content.")

      // Refresh courses to update enrollment status
      const coursesResponse = await axios.get("/api/courses")
      const coursesData = coursesResponse.data.data || coursesResponse.data.courses || coursesResponse.data
      setCourses(coursesData)
    } catch (error: any) {
      console.error("Enrollment failed:", error)
      toast.error(error.response?.data?.message || "Failed to enroll. Please try again.")
    }
  }

  // Handle payment
  const handlePayment = async (courseId: string) => {
    if (!currentUser) {
      toast.error("Please login to make payment")
      return
    }

    try {
      // Redirect to payment page or open payment modal
      window.location.href = `/payment?courseId=${courseId}`
    } catch (error) {
      console.error("Payment initiation failed:", error)
      toast.error("Failed to initiate payment. Please try again.")
    }
  }

  // Handle view content
  const handleViewContent = (courseId: string) => {
    window.location.href = `/courses/${courseId}`
  }

  const categories = ["all", ...new Set(courses.map((c) => c.programId.name))]
  const levels = ["all", ...new Set(courses.map((c) => c.level))]

  // Payment status badge component
  const PaymentStatusBadge = ({ status }: { status: string }) => {
    const statusConfig = {
      paid: {
        icon: CheckCircle2,
        label: "Paid",
        className: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
      },
      pending: {
        icon: AlertCircle,
        label: "Payment Pending",
        className: "bg-amber-500/10 text-amber-600 border-amber-500/20",
      },
      failed: {
        icon: XCircle,
        label: "Payment Failed",
        className: "bg-red-500/10 text-red-600 border-red-500/20",
      },
      unpaid: {
        icon: Lock,
        label: "Payment Required",
        className: "bg-slate-500/10 text-slate-600 border-slate-500/20",
      },
    }

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.unpaid
    const Icon = config.icon

    return (
      <Badge variant="outline" className={`${config.className} flex items-center gap-1`}>
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto" />
          <p className="text-slate-600 font-medium">Loading courses...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 border-b border-slate-200/50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Course Marketplace
                </h1>
                <p className="text-sm text-slate-600">Discover and learn new skills</p>
              </div>
            </div>
            {currentUser && (
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-slate-900">{currentUser.name}</p>
                  <p className="text-xs text-slate-500">{currentUser.email}</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white font-semibold shadow-lg">
                  {currentUser.name.charAt(0).toUpperCase()}
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Search and Filters */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <Input
                placeholder="Search courses, instructors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 bg-white border-slate-200 focus:border-blue-500 focus:ring-blue-500/20"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full md:w-[200px] h-12 bg-white border-slate-200">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat === "all" ? "All Categories" : cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedLevel} onValueChange={setSelectedLevel}>
              <SelectTrigger className="w-full md:w-[200px] h-12 bg-white border-slate-200">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Level" />
              </SelectTrigger>
              <SelectContent>
                {levels.map((level) => (
                  <SelectItem key={level} value={level}>
                    {level === "all" ? "All Levels" : level}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-600">
              Showing <span className="font-semibold text-slate-900">{filteredCourses.length}</span> courses
            </p>
            {(searchQuery || selectedCategory !== "all" || selectedLevel !== "all") && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearchQuery("")
                  setSelectedCategory("all")
                  setSelectedLevel("all")
                }}
                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
              >
                Clear filters
              </Button>
            )}
          </div>
        </motion.div>

        {/* Courses Grid */}
        {filteredCourses.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
            <div className="h-24 w-24 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
              <BookOpen className="h-12 w-12 text-slate-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">No courses found</h3>
            <p className="text-slate-600 mb-6">Try adjusting your search or filters</p>
            <Button
              onClick={() => {
                setSearchQuery("")
                setSelectedCategory("all")
                setSelectedLevel("all")
              }}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            >
              Clear all filters
            </Button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredCourses.map((course, index) => {
                const enrollmentStatus = checkEnrollmentStatus(course)
                const primaryInstructor = course.instructors[0] || { name: "TBA", email: "" }

                return (
                  <motion.div
                    key={course._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: index * 0.05 }}
                    layout
                  >
                    <Card className="group h-full flex flex-col overflow-hidden border-slate-200 hover:border-blue-300 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 bg-white">
                      {/* Course Thumbnail */}
                      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-blue-500 to-indigo-600">
                        <div className="w-full h-full flex items-center justify-center">
                          <BookOpen className="h-16 w-16 text-white/50" />
                        </div>

                        {/* Access Status Badge */}
                        <div className="absolute top-3 right-3">
                          {enrollmentStatus.canAccessContent ? (
                            <Badge className="bg-emerald-500 text-white border-0 shadow-lg flex items-center gap-1">
                              <Unlock className="h-3 w-3" />
                              Full Access
                            </Badge>
                          ) : enrollmentStatus.isEnrolled ? (
                            <Badge className="bg-amber-500 text-white border-0 shadow-lg flex items-center gap-1">
                              <Lock className="h-3 w-3" />
                              Locked
                            </Badge>
                          ) : null}
                        </div>

                        {/* Category Badge */}
                        <div className="absolute top-3 left-3">
                          <Badge className="bg-white/90 backdrop-blur-sm text-slate-900 border-0 shadow-lg">
                            {course.code}
                          </Badge>
                        </div>
                      </div>

                      <CardHeader className="flex-1">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <CardTitle className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                            {course.name}
                          </CardTitle>
                        </div>

                        <CardDescription className="line-clamp-2 text-slate-600">{course.description}</CardDescription>

                        {/* Course Meta */}
                        <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-slate-600">
                          <div className="flex items-center gap-1">
                            <BookOpen className="h-4 w-4" />
                            <span>{course.creditHours} Credits</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            <span>{course.subscribedStudents.length} students</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <GraduationCap className="h-4 w-4" />
                            <span>Semester {course.semester}</span>
                          </div>
                        </div>

                        {/* Program Badge */}
                        <div className="mt-3">
                          <Badge variant="outline" className="text-xs">
                            {course.programId.name}
                          </Badge>
                        </div>

                        {/* Instructor */}
                        <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-100">
                          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white text-sm font-semibold">
                            {primaryInstructor.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-slate-900">{primaryInstructor.name}</p>
                            <p className="text-xs text-slate-500">Instructor</p>
                          </div>
                        </div>

                        {/* Payment Status for Enrolled Students */}
                        {enrollmentStatus.isEnrolled && enrollmentStatus.paymentStatus && (
                          <div className="mt-4">
                            <PaymentStatusBadge status={enrollmentStatus.paymentStatus} />
                            {!enrollmentStatus.canAccessContent && (
                              <p className="text-xs text-slate-600 mt-2">Complete payment to access course content</p>
                            )}
                          </div>
                        )}
                      </CardHeader>

                      <CardFooter className="flex items-center justify-between gap-3 pt-4 border-t border-slate-100">
                        <div className="flex flex-col">
                          <span className="text-2xl font-bold text-slate-900">ETB {course.price}</span>
                          <span className="text-xs text-slate-500">one-time payment</span>
                        </div>

                        {enrollmentStatus.canAccessContent ? (
                          <Button
                            onClick={() => handleViewContent(course._id)}
                            className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white shadow-lg shadow-emerald-500/30 flex items-center gap-2"
                          >
                            View Content
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        ) : enrollmentStatus.isEnrolled ? (
                          <Button
                            onClick={() => handlePayment(course._id)}
                            className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white shadow-lg shadow-amber-500/30 flex items-center gap-2"
                          >
                            Complete Payment
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        ) : (
                          <Button
                            onClick={() => handleEnroll(course._id)}
                            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/30 flex items-center gap-2"
                          >
                            Get Started
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        )}
                      </CardFooter>
                    </Card>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>
        )}
      </main>
    </div>
  )
}
