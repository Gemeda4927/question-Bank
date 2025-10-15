"use client"
import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import {
  CheckCircle2,
  Loader2,
  XCircle,
  Sparkles,
  Lock,
  Unlock,
  BookOpen,
  FileText,
  Trophy,
  Star,
  Zap,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import confetti from "canvas-confetti"

export default function PaymentSuccessPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const [message, setMessage] = useState("Processing your payment...")
  const [purchaseType, setPurchaseType] = useState<"course" | "exam" | null>(null)
  const [itemName, setItemName] = useState<string>("")

  useEffect(() => {
    const txRef = searchParams.get("tx_ref")
    const paymentStatus = searchParams.get("status")
    const type = searchParams.get("type")
    const name = searchParams.get("name")

    if (type) setPurchaseType(type as "course" | "exam")
    if (name) setItemName(decodeURIComponent(name))

    if (paymentStatus === "success") {
      setStatus("success")

      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      })

      if (type === "course") {
        setMessage(`Successfully paid for the course! You now have full access to all exams in this course.`)
      } else if (type === "exam") {
        setMessage(`Successfully paid for the exam! You can now take this exam.`)
      } else {
        setMessage("Payment completed successfully! Your purchase has been unlocked.")
      }

      setTimeout(() => {
        router.push("/dashboard/student")
      }, 5000)
    } else if (paymentStatus === "failed" || paymentStatus === "cancelled") {
      setStatus("error")
      setMessage("Payment failed or was cancelled. Please try again.")
      setTimeout(() => {
        router.push("/dashboard/student/marketplace")
      }, 3000)
    } else {
      setTimeout(() => {
        setStatus("success")
        setMessage("Payment is being verified. Please check your courses in a moment.")
        setTimeout(() => {
          router.push("/dashboard/student")
        }, 2000)
      }, 2000)
    }
  }, [searchParams, router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-cyan-50 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-10 left-5 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-5 w-96 h-96 bg-cyan-400/20 rounded-full blur-3xl animate-pulse delay-700"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-pink-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <AnimatePresence mode="wait">
        {status === "loading" && (
          <motion.div
            key="loading"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white/90 backdrop-blur-sm rounded-3xl border-2 border-purple-100/50 shadow-2xl p-12 max-w-lg w-full text-center relative z-10"
          >
            <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-cyan-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
              <Loader2 className="w-12 h-12 text-purple-600 animate-spin" />
            </div>
            <h1 className="text-3xl font-black text-gray-900 mb-3">Processing Payment</h1>
            <p className="text-gray-600 text-lg">{message}</p>
            <div className="mt-6 flex items-center justify-center gap-2">
              <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce delay-100"></div>
              <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce delay-200"></div>
            </div>
          </motion.div>
        )}

        {status === "success" && (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white/90 backdrop-blur-sm rounded-3xl border-2 border-green-100/50 shadow-2xl p-12 max-w-2xl w-full text-center relative z-10"
          >
            {/* Success Animation */}
            <div className="relative mb-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", damping: 10, stiffness: 100 }}
                className="w-32 h-32 bg-gradient-to-br from-emerald-100 to-green-100 rounded-full flex items-center justify-center mx-auto relative"
              >
                <CheckCircle2 className="w-16 h-16 text-emerald-600" />
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.3, type: "spring" }}
                  className="absolute -top-2 -right-2 w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center"
                >
                  <Sparkles className="w-6 h-6 text-white" />
                </motion.div>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5 }}
                  className="absolute -bottom-2 -left-2 w-10 h-10 bg-purple-400 rounded-full flex items-center justify-center"
                >
                  <Star className="w-5 h-5 text-white fill-white" />
                </motion.div>
              </motion.div>
            </div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-4xl font-black text-gray-900 mb-3 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent"
            >
              Payment Successful! 🎉
            </motion.h1>

            {/* Unlock Animation */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="my-8 flex items-center justify-center gap-6"
            >
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center"
              >
                <Lock className="w-8 h-8 text-red-600" />
              </motion.div>
              <div className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0 }}
                    animate={{ scale: [0, 1, 0] }}
                    transition={{
                      delay: 0.6 + i * 0.1,
                      repeat: 2,
                      duration: 0.5,
                    }}
                    className="w-2 h-2 bg-purple-600 rounded-full"
                  />
                ))}
              </div>
              <motion.div
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.9 }}
                className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center"
              >
                <Unlock className="w-8 h-8 text-green-600" />
              </motion.div>
            </motion.div>

            {/* Purchase Details */}
            {itemName && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                className="bg-gradient-to-r from-purple-50 via-pink-50 to-cyan-50 rounded-2xl p-8 mb-6 border-2 border-purple-100"
              >
                <div className="flex items-center justify-center gap-4 mb-4">
                  {purchaseType === "course" ? (
                    <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
                      <BookOpen className="w-7 h-7 text-white" />
                    </div>
                  ) : (
                    <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-2xl flex items-center justify-center">
                      <FileText className="w-7 h-7 text-white" />
                    </div>
                  )}
                  <h3 className="text-2xl font-black text-gray-900">{itemName}</h3>
                </div>
                <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full font-bold shadow-lg">
                  <Unlock className="w-5 h-5" />
                  {purchaseType === "course" ? "Full Course Unlocked" : "Exam Unlocked"}
                  <Zap className="w-5 h-5" />
                </div>
              </motion.div>
            )}

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="text-gray-600 mb-8 text-lg leading-relaxed"
            >
              {message}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                <Loader2 className="w-4 h-4 animate-spin" />
                Redirecting to your dashboard...
              </div>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => router.push("/dashboard/student")}
                  className="px-8 py-4 bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-bold rounded-xl hover:shadow-lg transition-all flex items-center gap-2"
                >
                  <Trophy className="w-5 h-5" />
                  Go to Dashboard Now
                </button>
                <button
                  onClick={() => router.push("/dashboard/student/marketplace")}
                  className="px-8 py-4 border-2 border-purple-300 text-purple-700 font-bold rounded-xl hover:bg-purple-50 transition-all"
                >
                  Browse More Courses
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {status === "error" && (
          <motion.div
            key="error"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white/90 backdrop-blur-sm rounded-3xl border-2 border-red-100/50 shadow-2xl p-12 max-w-lg w-full text-center relative z-10"
          >
            <div className="w-24 h-24 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <XCircle className="w-12 h-12 text-red-600" />
            </div>
            <h1 className="text-3xl font-black text-gray-900 mb-3">Payment Failed</h1>
            <p className="text-gray-600 mb-6 text-lg">{message}</p>
            <div className="space-y-3">
              <div className="text-sm text-gray-500">Redirecting to marketplace...</div>
              <button
                onClick={() => router.push("/dashboard/student/marketplace")}
                className="w-full py-3 bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-bold rounded-xl hover:shadow-lg transition-all"
              >
                Try Again
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
