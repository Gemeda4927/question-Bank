"use client"
import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { CheckCircle2, Loader2, XCircle } from "lucide-react"

export default function PaymentSuccessPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const [message, setMessage] = useState("Processing your payment...")

  useEffect(() => {
    const txRef = searchParams.get("tx_ref")
    const paymentStatus = searchParams.get("status")

    if (paymentStatus === "success") {
      setStatus("success")
      setMessage("Payment completed successfully! You now have access to the course.")
      setTimeout(() => {
        router.push("/dashboard/student/courses")
      }, 3000)
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-cyan-50 flex items-center justify-center p-6">
      <div className="bg-white/90 backdrop-blur-sm rounded-3xl border-2 border-purple-100/50 shadow-2xl p-12 max-w-md w-full text-center">
        {status === "loading" && (
          <>
            <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Loader2 className="w-10 h-10 text-purple-600 animate-spin" />
            </div>
            <h1 className="text-2xl font-black text-gray-900 mb-3">Processing Payment</h1>
            <p className="text-gray-600">{message}</p>
          </>
        )}

        {status === "success" && (
          <>
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10 text-emerald-600" />
            </div>
            <h1 className="text-2xl font-black text-gray-900 mb-3">Payment Successful!</h1>
            <p className="text-gray-600 mb-6">{message}</p>
            <div className="text-sm text-gray-500">Redirecting to your courses...</div>
          </>
        )}

        {status === "error" && (
          <>
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <XCircle className="w-10 h-10 text-red-600" />
            </div>
            <h1 className="text-2xl font-black text-gray-900 mb-3">Payment Failed</h1>
            <p className="text-gray-600 mb-6">{message}</p>
            <div className="text-sm text-gray-500">Redirecting to marketplace...</div>
          </>
        )}
      </div>
    </div>
  )
}
