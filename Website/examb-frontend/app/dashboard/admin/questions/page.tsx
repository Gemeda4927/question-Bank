"use client"
import AdminLayout from "@/components/AdminLayout"
import ProtectedRoute from "@/components/ProtectedRoute"
import DataTable from "@/components/DataTable"
import { adminService } from "@/services/adminService"
import QuestionForm from "@/components/forms/QuestionForm"
import { HelpCircle, Award, Tag } from "lucide-react"

export default function QuestionsPage() {
  const questionColumns = [
    {
      key: "questionText",
      label: "Question",
      render: (value: string) => (
        <div className="max-w-md">
          <span className="text-sm">{value.length > 50 ? `${value.substring(0, 50)}...` : value}</span>
        </div>
      ),
    },
    { key: "examId", label: "Exam ID" },
    {
      key: "questionType",
      label: "Type",
      render: (value: string) => (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/20 text-accent text-sm font-semibold">
          <Tag className="w-3 h-3" />
          {value}
        </span>
      ),
    },
    {
      key: "marks",
      label: "Marks",
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
            <HelpCircle className="w-8 h-8 text-primary" />
            <h1 className="text-4xl font-bold text-foreground">Questions Management</h1>
          </div>
          <p className="text-muted-foreground text-lg">Manage exam questions</p>
        </div>

        <DataTable
          endpoint="getQuestions"
          title="All Questions"
          columns={questionColumns}
          service={adminService}
          createForm={QuestionForm}
        />
      </AdminLayout>
    </ProtectedRoute>
  )
}
