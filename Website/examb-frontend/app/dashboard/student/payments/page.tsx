"use client"
import { useState, useEffect } from "react"
import ProtectedRoute from "@/components/ProtectedRoute"
import StudentLayout from "@/components/StudentLayout"
import { studentService } from "@/services/studentService"
import { CreditCard, CheckCircle2, Clock, XCircle, DollarSign, Calendar } from "lucide-react"

export default function PaymentHistoryPage() {
  const [payments, setPayments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPayments()
  }, [])

  const fetchPayments = async () => {
    try {
      setLoading(true)
      const response = await studentService.getPaymentHistory()
      const data = response.data?.data || response.data || []
      setPayments(data)
    } catch (error) {
      console.error("Error fetching payments:", error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusConfig = (status: string) => {
    const configs = {
      success: {
        icon: CheckCircle2,
        className: "bg-emerald-100 text-emerald-700 border-emerald-200",
        label: "Completed",
      },
      pending: {
        icon: Clock,
        className: "bg-yellow-100 text-yellow-700 border-yellow-200",
        label: "Pending",
      },
      failed: {
        icon: XCircle,
        className: "bg-red-100 text-red-700 border-red-200",
        label: "Failed",
      },
    }
    return (
      configs[status as keyof typeof configs] || {
        icon: Clock,
        className: "bg-gray-100 text-gray-700 border-gray-200",
        label: status,
      }
    )
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

  return (
    <ProtectedRoute allowedRole="student">
      <StudentLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <CreditCard className="w-8 h-8 text-purple-600" />
            <div>
              <h1 className="text-4xl font-black text-gray-900">Payment History</h1>
              <p className="text-gray-600 font-medium">View your transaction history</p>
            </div>
          </div>

          {/* Payments List */}
          <div className="space-y-4">
            {payments.map((payment) => {
              const statusConfig = getStatusConfig(payment.status)
              const StatusIcon = statusConfig.icon

              return (
                <div
                  key={payment._id}
                  className="bg-white/90 backdrop-blur-sm rounded-2xl border-2 border-purple-100/50 shadow-lg p-6 hover:shadow-xl transition-all"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-r from-cyan-600 to-purple-600 rounded-xl flex items-center justify-center">
                          <CreditCard className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">
                            {payment.courseId?.name || "Course Payment"}
                          </h3>
                          <p className="text-sm text-gray-600">{payment.courseId?.code || "N/A"}</p>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4 text-emerald-600" />
                          <span className="font-bold text-gray-900">{payment.amount} ETB</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600">{new Date(payment.createdAt).toLocaleDateString()}</span>
                        </div>

                        {payment.transactionRef && (
                          <div className="text-xs text-gray-500 font-mono">Ref: {payment.transactionRef}</div>
                        )}
                      </div>
                    </div>

                    <div
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 font-bold text-sm ${statusConfig.className}`}
                    >
                      <StatusIcon className="w-4 h-4" />
                      {statusConfig.label}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {payments.length === 0 && (
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-12 border-2 border-purple-100/50 shadow-lg text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CreditCard className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No payment history</h3>
              <p className="text-gray-600">You haven't made any payments yet.</p>
            </div>
          )}
        </div>
      </StudentLayout>
    </ProtectedRoute>
  )
}
