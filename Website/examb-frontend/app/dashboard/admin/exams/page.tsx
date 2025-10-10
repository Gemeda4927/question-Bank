"use client"
import AdminLayout from "@/components/AdminLayout"
import ProtectedRoute from "@/components/ProtectedRoute"
import DataTable from "@/components/DataTable"
import { adminService } from "@/services/adminService"
import ExamForm from "@/components/forms/ExamForm"
import { FileText, Clock, Award } from "lucide-react"

export default function ExamsPage() {
  const examColumns = [
    { key: "title", label: "Exam Title" },
    { key: "courseId", label: "Course ID" },
    {
      key: "duration",
      label: "Duration",
      render: (value: number) => (
        <span className="inline-flex items-center gap-1.5 text-sm">
          <Clock className="w-4 h-4 text-muted-foreground" />
          {value} min
        </span>
      ),
    },
    {
      key: "totalMarks",
      label: "Total Marks",
      render: (value: number) => (
        <span className="inline-flex items-center gap-1.5 text-sm font-semibold">
          <Award className="w-4 h-4 text-primary" />
          {value}
        </span>
      ),
    },
    {
      key: "scheduledAt",
      label: "Scheduled At",
      render: (value: string) =>
        value ? new Date(value).toLocaleString() : <span className="text-muted-foreground italic">Not scheduled</span>,
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
            <FileText className="w-8 h-8 text-primary" />
            <h1 className="text-4xl font-bold text-foreground">Exams Management</h1>
          </div>
          <p className="text-muted-foreground text-lg">Manage exams and schedules</p>
        </div>

        <DataTable
          endpoint="getExams"
          title="All Exams"
          columns={examColumns}
          service={adminService}
          createForm={ExamForm}
        />
      </AdminLayout>
    </ProtectedRoute>
  )
}
