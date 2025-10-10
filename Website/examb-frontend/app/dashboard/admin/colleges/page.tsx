"use client"
import AdminLayout from "@/components/AdminLayout"
import ProtectedRoute from "@/components/ProtectedRoute"
import DataTable from "@/components/DataTable"
import { adminService } from "@/services/adminService"
import CollegeForm from "@/components/forms/CollegeForm"
import { Building2 } from "lucide-react"

export default function CollegesPage() {
  const collegeColumns = [
    { key: "name", label: "College Name" },
    { key: "code", label: "Code" },
    {
      key: "universityId",
      label: "University ID",
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
            <Building2 className="w-8 h-8 text-primary" />
            <h1 className="text-4xl font-bold text-foreground">Colleges Management</h1>
          </div>
          <p className="text-muted-foreground text-lg">Manage colleges within universities</p>
        </div>

        <DataTable
          endpoint="getColleges"
          title="All Colleges"
          columns={collegeColumns}
          service={adminService}
          createForm={CollegeForm}
        />
      </AdminLayout>
    </ProtectedRoute>
  )
}
