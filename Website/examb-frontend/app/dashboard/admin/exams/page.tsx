"use client"
import AdminLayout from "@/components/AdminLayout"
import ProtectedRoute from "@/components/ProtectedRoute"
import DataTable from "@/components/DataTable"
import { adminService } from "@/services/adminService"
import ExamForm from "@/components/forms/ExamForm"
import { FileText, Clock, Award, Calendar } from "lucide-react"

export default function ExamsPage() {
  const examColumns = [
    { key: "title", label: "Exam Title" },
    { key: "courseId", label: "Course ID" },
    {
      key: "duration",
      label: "Duration",
      render: (value: number) => (
        <span className="inline-flex items-center gap-2 text-sm font-semibold px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full">
          <Clock className="w-4 h-4" />
          {value} min
        </span>
      ),
    },
    {
      key: "totalMarks",
      label: "Total Marks",
      render: (value: number) => (
        <span className="inline-flex items-center gap-2 text-sm font-bold px-3 py-1.5 bg-purple-50 text-purple-700 rounded-full">
          <Award className="w-4 h-4" />
          {value}
        </span>
      ),
    },
    {
      key: "scheduledAt",
      label: "Scheduled At",
      render: (value: string) =>
        value ? (
          <span className="inline-flex items-center gap-2 text-sm font-medium px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-full">
            <Calendar className="w-4 h-4" />
            {new Date(value).toLocaleString()}
          </span>
        ) : (
          <span className="text-muted-foreground italic text-sm">Not scheduled</span>
        ),
    },
    {
      key: "createdAt",
      label: "Created At",
      render: (value: string) => (
        <span className="text-sm font-medium text-gray-600">{new Date(value).toLocaleDateString()}</span>
      ),
    },
  ]

  return (
    <ProtectedRoute allowedRole="admin">
      <AdminLayout>
        <div className="mb-10">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl shadow-lg">
              <FileText className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-5xl font-black bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
                Exams Management
              </h1>
              <p className="text-gray-600 text-lg font-medium mt-2">Create, manage, and schedule exams</p>
            </div>
          </div>
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
