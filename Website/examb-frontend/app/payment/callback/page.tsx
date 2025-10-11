"use client"
import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"

export default function PaymentCallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    // Extract payment parameters from Chapa callback
    const txRef = searchParams.get("tx_ref")
    const status = searchParams.get("status")
    const trxRef = searchParams.get("trx_ref")

    // Redirect to success page with parameters
    const params = new URLSearchParams()
    if (txRef) params.set("tx_ref", txRef)
    if (status) params.set("status", status)
    if (trxRef) params.set("trx_ref", trxRef)

    router.replace(`/payment/success?${params.toString()}`)
  }, [searchParams, router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-cyan-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600 font-medium">Processing payment...</p>
      </div>
    </div>
  )
}
