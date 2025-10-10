"use client"
import AdminLayout from "@/components/AdminLayout"
import ProtectedRoute from "@/components/ProtectedRoute"
import DataTable from "@/components/DataTable"
import { adminService } from "@/services/adminService"
import ProgramForm from "@/components/forms/ProgramForm"
import { BookOpen, GraduationCap, Calendar } from "lucide-react"

export default function ProgramsPage() {
  const programColumns = [
    { key: "name", label: "Program Name" },
    { key: "code", label: "Code" },
    { key: "departmentId", label: "Department ID" },
    {
      key: "degreeType",
      label: "Degree Type",
      render: (value: string) => (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/20 text-primary text-sm font-semibold">
          <GraduationCap className="w-3 h-3" />
          {value}
        </span>
      ),
    },
    {
      key: "duration",
      label: "Duration",
      render: (value: number) => (
        <span className="inline-flex items-center gap-1.5 text-sm">
          <Calendar className="w-4 h-4 text-muted-foreground" />
          {value} years
        </span>
      ),
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
            <BookOpen className="w-8 h-8 text-primary" />
            <h1 className="text-4xl font-bold text-foreground">Programs Management</h1>
          </div>
          <p className="text-muted-foreground text-lg">Manage academic programs</p>
        </div>

        <DataTable
          endpoint="getPrograms"
          title="All Programs"
          columns={programColumns}
          service={adminService}
          createForm={ProgramForm}
        />
      </AdminLayout>
    </ProtectedRoute>
  )
}
