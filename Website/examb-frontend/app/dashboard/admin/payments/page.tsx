"use client"
import AdminLayout from "@/components/AdminLayout"
import ProtectedRoute from "@/components/ProtectedRoute"
import DataTable from "@/components/DataTable"
import { adminService } from "@/services/adminService"
import { CreditCard, DollarSign, CheckCircle2, Clock, XCircle, Calendar, Hash } from "lucide-react"

export default function PaymentsPage() {
  const paymentColumns = [
    {
      key: "userId",
      label: "Student",
      render: (value: any) => (
        <div className="flex flex-col">
          <span className="font-semibold text-sm">{value?.name || "N/A"}</span>
          <span className="text-xs text-gray-500">{value?.email || ""}</span>
        </div>
      ),
    },
    {
      key: "courseId",
      label: "Course",
      render: (value: any) => (
        <div className="flex flex-col">
          <span className="font-semibold text-sm">{value?.name || "N/A"}</span>
          <span className="text-xs text-gray-500">{value?.code || ""}</span>
        </div>
      ),
    },
    {
      key: "amount",
      label: "Amount",
      render: (value: number) => (
        <span className="inline-flex items-center gap-1.5 text-sm font-semibold">
          <DollarSign className="w-4 h-4 text-emerald-500" />
          {value} ETB
        </span>
      ),
    },
    {
      key: "transactionRef",
      label: "Transaction Ref",
      render: (value: string) => (
        <span className="inline-flex items-center gap-1.5 text-xs font-mono text-gray-600">
          <Hash className="w-3 h-3" />
          {value ? value.substring(0, 20) + "..." : "N/A"}
        </span>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (value: string) => {
        const statusConfig = {
          success: {
            icon: CheckCircle2,
            className: "bg-emerald-500/20 text-emerald-500",
          },
          pending: {
            icon: Clock,
            className: "bg-yellow-500/20 text-yellow-500",
          },
          failed: {
            icon: XCircle,
            className: "bg-destructive/20 text-destructive",
          },
        }
        const config = statusConfig[value as keyof typeof statusConfig] || {
          icon: Clock,
          className: "bg-muted text-muted-foreground",
        }
        const Icon = config.icon
        return (
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold ${config.className}`}
          >
            <Icon className="w-3 h-3" />
            {value.charAt(0).toUpperCase() + value.slice(1)}
          </span>
        )
      },
    },
    {
      key: "createdAt",
      label: "Date",
      render: (value: string) => (
        <span className="inline-flex items-center gap-1.5 text-sm text-gray-600">
          <Calendar className="w-4 h-4" />
          {new Date(value).toLocaleDateString()}
        </span>
      ),
    },
  ]

  return (
    <ProtectedRoute allowedRole="admin">
      <AdminLayout>
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <CreditCard className="w-8 h-8 text-primary" />
            <h1 className="text-4xl font-bold text-foreground">Payments Management</h1>
          </div>
          <p className="text-muted-foreground text-lg">View and manage payment transactions via Chapa</p>
        </div>

        <DataTable
          endpoint="getPayments"
          title="All Payments"
          columns={paymentColumns}
          service={adminService}
          hideCreate={true}
        />
      </AdminLayout>
    </ProtectedRoute>
  )
}
