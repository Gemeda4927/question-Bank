"use client"
import { motion } from "framer-motion"
import {
  GraduationCap,
  Award,
  BookMarked,
  Star,
  Users,
  Target,
  Unlock,
  Lock,
  Loader2,
  AlertCircle,
  ShoppingCart,
  CreditCard,
} from "lucide-react"

interface CourseCardProps {
  course: any
  index: number
  status: any
  processingPayment: string | null
  onSubscribeClick: (course: any) => void
  onViewContent: (courseId: string) => void
}

export default function CourseCard({
  course,
  index,
  status,
  processingPayment,
  onSubscribeClick,
  onViewContent,
}: CourseCardProps) {
  const isEnrolled = status.isEnrolled
  const hasPaid = status.hasPaid
  const isProcessing = processingPayment === course._id
  const programName = typeof course.programId === "object" ? course.programId?.name : "General Program"
  const examCount = Array.isArray(course.exams) ? course.exams.length : 0
  const studentCount = Array.isArray(course.subscribedStudents) ? course.subscribedStudents.length : 0
  const isFree = !course.price || course.price === 0
  const prerequisitesCount = course.prerequisites?.length || 0

  const canAccessContent = isEnrolled && hasPaid && status.paymentStatus === "paid"

  const gradients = [
    "from-purple-500 via-pink-500 to-red-500",
    "from-blue-500 via-cyan-500 to-teal-500",
    "from-orange-500 via-red-500 to-pink-500",
    "from-green-500 via-emerald-500 to-teal-500",
    "from-indigo-500 via-purple-500 to-pink-500",
    "from-yellow-500 via-orange-500 to-red-500",
  ]
  const gradient = gradients[index % gradients.length]

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      whileHover={{ scale: 1.03, y: -5 }}
      className="bg-white rounded-3xl border-2 border-gray-200 shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden group"
    >
      {/* Course Header */}
      <div className={`bg-gradient-to-br ${gradient} p-6 text-white relative overflow-hidden`}>
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-500"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12 group-hover:scale-150 transition-transform duration-500"></div>
        <div className="flex justify-between items-center mb-4 relative z-10">
          <motion.div
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.5 }}
            className="bg-white/20 backdrop-blur-sm rounded-2xl p-3 group-hover:bg-white/30 transition-all shadow-lg"
          >
            <GraduationCap className="w-7 h-7" />
          </motion.div>
          {isEnrolled && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className={`px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-lg ${
                status.paymentStatus === "paid"
                  ? "bg-green-400"
                  : status.paymentStatus === "pending"
                    ? "bg-yellow-400"
                    : status.paymentStatus === "failed"
                      ? "bg-red-400"
                      : "bg-gray-400"
              }`}
            >
              {status.paymentStatus === "paid" ? (
                <>
                  <Unlock className="w-4 h-4" /> Paid
                </>
              ) : status.paymentStatus === "pending" ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Pending
                </>
              ) : status.paymentStatus === "failed" ? (
                <>
                  <AlertCircle className="w-4 h-4" /> Failed
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" /> Unpaid
                </>
              )}
            </motion.span>
          )}
        </div>
        <h3 className="text-2xl font-black leading-tight mb-2 relative z-10 line-clamp-2 drop-shadow-md">
          {course.name}
        </h3>
        <p className="text-white/90 text-sm font-semibold relative z-10 flex items-center gap-2">
          <span className="bg-white/20 px-2 py-0.5 rounded-lg">{course.code}</span>
        </p>
      </div>

      {/* Course Body */}
      <div className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Award className="w-5 h-5 text-indigo-500" />
            <span className="line-clamp-1 font-medium">{programName}</span>
          </div>
          {course.level && (
            <span className="bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700 px-3 py-1 rounded-xl text-xs font-bold border border-blue-200">
              {course.level}
            </span>
          )}
        </div>

        {course.description && (
          <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed">{course.description}</p>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-4 border-t-2 border-b-2 border-gray-100 py-4 text-center gap-3">
          <div className="group hover:scale-110 transition-transform">
            <div className="bg-gradient-to-br from-purple-100 to-pink-100 p-2 rounded-xl mb-1 mx-auto w-fit">
              <BookMarked className="w-4 h-4 text-purple-600" />
            </div>
            <p className="text-xs text-gray-500 font-medium">Credits</p>
            <p className="font-black text-gray-800">{course.creditHours || 0}</p>
          </div>
          <div className="group hover:scale-110 transition-transform">
            <div className="bg-gradient-to-br from-yellow-100 to-orange-100 p-2 rounded-xl mb-1 mx-auto w-fit">
              <Star className="w-4 h-4 text-yellow-600" />
            </div>
            <p className="text-xs text-gray-500 font-medium">Exams</p>
            <p className="font-black text-gray-800">{examCount}</p>
          </div>
          <div className="group hover:scale-110 transition-transform">
            <div className="bg-gradient-to-br from-blue-100 to-cyan-100 p-2 rounded-xl mb-1 mx-auto w-fit">
              <Users className="w-4 h-4 text-blue-600" />
            </div>
            <p className="text-xs text-gray-500 font-medium">Students</p>
            <p className="font-black text-gray-800">{studentCount}</p>
          </div>
          <div className="group hover:scale-110 transition-transform">
            <div className="bg-gradient-to-br from-green-100 to-emerald-100 p-2 rounded-xl mb-1 mx-auto w-fit">
              <Target className="w-4 h-4 text-green-600" />
            </div>
            <p className="text-xs text-gray-500 font-medium">Prereqs</p>
            <p className="font-black text-gray-800">{prerequisitesCount}</p>
          </div>
        </div>

        {/* Payment Required Notice */}
        {isEnrolled && !hasPaid && (
          <div className="bg-gradient-to-br from-orange-50 to-yellow-50 border-2 border-orange-200 rounded-2xl p-4">
            <div className="flex items-center gap-3">
              <Lock className="w-5 h-5 text-orange-600" />
              <div>
                <p className="text-sm font-bold text-orange-900">Payment Required</p>
                <p className="text-xs text-orange-700">Complete payment to unlock course content and materials</p>
              </div>
            </div>
          </div>
        )}

        {/* Price and Action Button */}
        <div className="flex items-center justify-between pt-2">
          {!isFree ? (
            <div>
              <span className="text-3xl font-black bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text">
                ETB {course.price}
              </span>
              <span className="text-xs text-gray-500 block font-medium">One-time payment</span>
            </div>
          ) : (
            <div>
              <span className="text-3xl font-black bg-gradient-to-r from-green-600 to-emerald-600 text-transparent bg-clip-text">
                FREE
              </span>
              <span className="text-xs text-gray-500 block font-medium">Lifetime access</span>
            </div>
          )}

          {canAccessContent ? (
            <motion.button
              onClick={() => onViewContent(course._id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all flex items-center gap-2 text-sm"
            >
              <Unlock className="w-5 h-5" /> View Content
            </motion.button>
          ) : isEnrolled && !hasPaid ? (
            <motion.button
              onClick={() => onSubscribeClick(course)}
              disabled={isProcessing}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all flex items-center gap-2 text-sm disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" /> Processing...
                </>
              ) : (
                <>
                  <CreditCard className="w-5 h-5" /> Complete Payment
                </>
              )}
            </motion.button>
          ) : (
            <motion.button
              onClick={() => onSubscribeClick(course)}
              disabled={isProcessing}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-6 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all flex items-center gap-2 text-sm disabled:opacity-50 ${
                isFree
                  ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white"
                  : "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
              }`}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" /> Processing...
                </>
              ) : isFree ? (
                <>
                  <ShoppingCart className="w-5 h-5" /> Enroll Free
                </>
              ) : (
                <>
                  <ShoppingCart className="w-5 h-5" /> Get Started
                </>
              )}
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  )
}
