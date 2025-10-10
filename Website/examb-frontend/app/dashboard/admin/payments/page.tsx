"use client"
import AdminLayout from "@/components/AdminLayout"
import ProtectedRoute from "@/components/ProtectedRoute"
import DataTable from "@/components/DataTable"
import { adminService } from "@/services/adminService"
import PaymentForm from "@/components/forms/PaymentForm"
import { CreditCard, DollarSign, CheckCircle2, Clock, XCircle } from "lucide-react"

export default function PaymentsPage() {
  const paymentColumns = [
    { key: "userId", label: "User ID" },
    {
      key: "amount",
      label: "Amount",
      render: (value: number) => (
        <span className="inline-flex items-center gap-1.5 text-sm font-semibold">
          <DollarSign className="w-4 h-4 text-emerald-500" />${value.toFixed(2)}
        </span>
      ),
    },
    {
      key: "paymentMethod",
      label: "Method",
      render: (value: string) => (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/20 text-accent text-sm font-semibold">
          <CreditCard className="w-3 h-3" />
          {value}
        </span>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (value: string) => {
        const statusConfig = {
          completed: {
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
      label: "Created At",
      render: (value: string) => new Date(value).toLocaleDateString(),
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
          <p className="text-muted-foreground text-lg">Manage payment records</p>
        </div>

        <DataTable
          endpoint="getPayments"
          title="All Payments"
          columns={paymentColumns}
          service={adminService}
          createForm={PaymentForm}
        />
      </AdminLayout>
    </ProtectedRoute>
  )
}
