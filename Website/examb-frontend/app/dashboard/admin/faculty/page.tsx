"use client"
import AdminLayout from "@/components/AdminLayout"
import ProtectedRoute from "@/components/ProtectedRoute"
import DataTable from "@/components/DataTable"
import { adminService } from "@/services/adminService"
import FacultyForm from "@/components/forms/FacultyForm"
import { UserCog, Mail, Briefcase } from "lucide-react"

export default function FacultyPage() {
  const facultyColumns = [
    { key: "name", label: "Faculty Name" },
    {
      key: "email",
      label: "Email",
      render: (value: string) => (
        <span className="inline-flex items-center gap-2 text-sm">
          <Mail className="w-4 h-4 text-muted-foreground" />
          {value}
        </span>
      ),
    },
    {
      key: "department",
      label: "Department",
      render: (value: string) => (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/20 text-accent text-sm font-semibold">
          <Briefcase className="w-3 h-3" />
          {value}
        </span>
      ),
    },
    { key: "universityId", label: "University ID" },
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
            <UserCog className="w-8 h-8 text-primary" />
            <h1 className="text-4xl font-bold text-foreground">Faculty Management</h1>
          </div>
          <p className="text-muted-foreground text-lg">Manage faculty members</p>
        </div>

        <DataTable
          endpoint="getFaculties"
          title="All Faculty"
          columns={facultyColumns}
          service={adminService}
          createForm={FacultyForm}
        />
      </AdminLayout>
    </ProtectedRoute>
  )
}
