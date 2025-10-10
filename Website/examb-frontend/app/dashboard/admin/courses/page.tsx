"use client"
import AdminLayout from "@/components/AdminLayout"
import ProtectedRoute from "@/components/ProtectedRoute"
import DataTable from "@/components/DataTable"
import { adminService } from "@/services/adminService"
import CourseForm from "@/components/forms/CourseForm"
import { School, Award } from "lucide-react"

export default function CoursesPage() {
  const courseColumns = [
    { key: "name", label: "Course Name" },
    { key: "code", label: "Course Code" },
    { key: "programId", label: "Program ID" },
    {
      key: "credits",
      label: "Credits",
      render: (value: number) => (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/20 text-primary text-sm font-semibold">
          <Award className="w-3 h-3" />
          {value}
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
            <School className="w-8 h-8 text-primary" />
            <h1 className="text-4xl font-bold text-foreground">Courses Management</h1>
          </div>
          <p className="text-muted-foreground text-lg">Manage academic courses</p>
        </div>

        <DataTable
          endpoint="getCourses"
          title="All Courses"
          columns={courseColumns}
          service={adminService}
          createForm={CourseForm}
        />
      </AdminLayout>
    </ProtectedRoute>
  )
}
