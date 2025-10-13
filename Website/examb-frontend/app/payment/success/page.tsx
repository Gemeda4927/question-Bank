"use client"
import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { CheckCircle2, Loader2, XCircle, Sparkles, Lock, Unlock, BookOpen, FileText } from "lucide-react"

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
    const type = searchParams.get("type") // 'course' or 'exam'
    const name = searchParams.get("name") // course/exam name

    if (type) setPurchaseType(type as "course" | "exam")
    if (name) setItemName(decodeURIComponent(name))

    if (paymentStatus === "success") {
      setStatus("success")
      if (type === "course") {
        setMessage(`🎉 Successfully paid for the course! You now have full access to all exams in this course.`)
      } else if (type === "exam") {
        setMessage(`🎉 Successfully paid for the exam! You can now take this exam.`)
      } else {
        setMessage("Payment completed successfully! Your purchase has been unlocked.")
      }

      setTimeout(() => {
        router.push("/dashboard/student/courses")
      }, 4000)
    } else if (paymentStatus === "failed" || paymentStatus === "cancelled") {
      setStatus("error")
      setMessage("Payment failed or was cancelled. Please try again.")
      setTimeout(() => {
        router.push("/dashboard/student/marketplace")
      }, 3000)
    } else {
      // Still processing
      setTimeout(() => {
        setStatus("success")
        setMessage("Payment is being verified. Please check your courses in a moment.")
        setTimeout(() => {
          router.push("/dashboard/student/courses")
        }, 2000)
      }, 2000)
    }
  }, [searchParams, router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-cyan-50 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-10 left-5 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-pulse-glow"></div>
        <div className="absolute bottom-10 right-5 w-96 h-96 bg-cyan-400/20 rounded-full blur-3xl animate-pulse-glow delay-700"></div>
      </div>

      <div className="bg-white/90 backdrop-blur-sm rounded-3xl border-2 border-purple-100/50 shadow-2xl p-12 max-w-lg w-full text-center relative z-10 animate-fadeInScale">
        {status === "loading" && (
          <>
            <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-cyan-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse-glow">
              <Loader2 className="w-12 h-12 text-purple-600 animate-spin" />
            </div>
            <h1 className="text-3xl font-black text-gray-900 mb-3">Processing Payment</h1>
            <p className="text-gray-600 text-lg">{message}</p>
            <div className="mt-6 flex items-center justify-center gap-2">
              <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce delay-100"></div>
              <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce delay-200"></div>
            </div>
          </>
        )}

        {status === "success" && (
          <>
            {/* Success Animation */}
            <div className="relative mb-6">
              <div className="w-24 h-24 bg-gradient-to-br from-emerald-100 to-green-100 rounded-full flex items-center justify-center mx-auto animate-scale-pulse">
                <CheckCircle2 className="w-12 h-12 text-emerald-600" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center animate-bounce">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
            </div>

            <h1 className="text-3xl font-black text-gray-900 mb-3">Payment Successful!</h1>

            {/* Unlock Animation */}
            <div className="my-6 flex items-center justify-center gap-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center animate-fadeIn">
                <Lock className="w-6 h-6 text-red-600" />
              </div>
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce delay-100"></div>
                <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce delay-200"></div>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center animate-fadeIn delay-500">
                <Unlock className="w-6 h-6 text-green-600" />
              </div>
            </div>

            {/* Purchase Details */}
            {itemName && (
              <div className="bg-gradient-to-r from-purple-50 to-cyan-50 rounded-2xl p-6 mb-6 border-2 border-purple-100">
                <div className="flex items-center justify-center gap-3 mb-3">
                  {purchaseType === "course" ? (
                    <BookOpen className="w-6 h-6 text-purple-600" />
                  ) : (
                    <FileText className="w-6 h-6 text-cyan-600" />
                  )}
                  <h3 className="text-xl font-black text-gray-900">{itemName}</h3>
                </div>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-bold">
                  <Unlock className="w-4 h-4" />
                  {purchaseType === "course" ? "Full Course Unlocked" : "Exam Unlocked"}
                </div>
              </div>
            )}

            <p className="text-gray-600 mb-6 text-lg leading-relaxed">{message}</p>

            <div className="space-y-3">
              <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                <Loader2 className="w-4 h-4 animate-spin" />
                Redirecting to your courses...
              </div>
              <button
                onClick={() => router.push("/dashboard/student/courses")}
                className="w-full py-3 bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-bold rounded-xl hover:shadow-lg transition-all"
              >
                Go to My Courses Now
              </button>
            </div>
          </>
        )}

        {status === "error" && (
          <>
            <div className="w-24 h-24 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center mx-auto mb-6 animate-scale-pulse">
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
          </>
        )}
      </div>
    </div>
  )
}
