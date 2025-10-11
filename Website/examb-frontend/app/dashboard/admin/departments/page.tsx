"use client"
import AdminLayout from "@/components/AdminLayout"
import ProtectedRoute from "@/components/ProtectedRoute"
import DataTable from "@/components/DataTable"
import { adminService } from "@/services/adminService"
import DepartmentForm from "@/components/DepartmentForm"
import { Building2, CheckCircle2, XCircle } from "lucide-react"

export default function DepartmentsPage() {
  const departmentColumns = [
    { key: "name", label: "Department Name" },
    { key: "code", label: "Code" },
    {
      key: "description",
      label: "Description",
      render: (value: string) => (
        <span className="text-sm text-muted-foreground line-clamp-2">{value || "No description"}</span>
      ),
    },
    {
      key: "createdAt",
      label: "Created At",
      render: (value: string) => new Date(value).toLocaleDateString(),
    },
    {
      key: "isDeleted",
      label: "Status",
      render: (value: boolean) => (
        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold ${
            value ? "bg-destructive/20 text-destructive" : "bg-emerald-500/20 text-emerald-500"
          }`}
        >
          {value ? <XCircle className="w-3 h-3" /> : <CheckCircle2 className="w-3 h-3" />}
          {value ? "Deleted" : "Active"}
        </span>
      ),
    },
  ]

  return (
    <ProtectedRoute allowedRole="admin">
      <AdminLayout>
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Building2 className="w-8 h-8 text-primary" />
            <h1 className="text-4xl font-bold text-foreground">Departments Management</h1>
          </div>
          <p className="text-muted-foreground text-lg">Manage departments within universities</p>
        </div>

        <DataTable
          endpoint="getDepartments"
          title="All Departments"
          columns={departmentColumns}
          service={adminService}
          createForm={DepartmentForm}
        />
      </AdminLayout>
    </ProtectedRoute>
  )
}
