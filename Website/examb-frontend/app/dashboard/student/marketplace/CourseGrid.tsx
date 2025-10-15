"use client"
import { motion, AnimatePresence } from "framer-motion"
import CourseCard from "@/components/CourseCard"

interface Course {
  _id: string
  name: string
  code: string
  description?: string
  level?: string
  semester?: number
  price?: number
  creditHours?: number
  programId?: any
  exams?: any[]
  subscribedStudents?: any[]
  prerequisites?: string[]
  instructors?: any[]
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

interface CourseGridProps {
  courses: Course[]
  enrollmentStatus: Map<string, EnrollmentStatus>
  processingPayment: string | null
  onSubscribeClick: (course: Course) => void
  onViewContent: (courseId: string) => void
  loading: boolean
}

function CourseCardSkeleton() {
  return (
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
}

export default function CourseGrid({
  courses,
  enrollmentStatus,
  processingPayment,
  onSubscribeClick,
  onViewContent,
  loading,
}: CourseGridProps) {
  return (
    <>
      {loading && courses.length === 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <CourseCardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {courses.map((course, index) => {
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
                  onSubscribeClick={onSubscribeClick}
                  onViewContent={onViewContent}
                />
              )
            })}
          </AnimatePresence>
        </motion.div>
      )}
    </>
  )
}