"use client"

import { useEffect, useState } from "react"
import ProtectedRoute from "@/components/ProtectedRoute"
import StudentLayout from "@/components/StudentLayout"
import { studentService } from "@/services/studentService"

interface Exam {
  _id: string
  name: string
  code?: string
  description?: string
  examPaymentStatus?: string
  subscribedStudents?: {
    studentId: { _id: string; name: string }
    examPaymentStatus?: string
  }[]
}

interface Course {
  _id: string
  name: string
  exams?: Exam[]
  subscribedStudents: {
    studentId: { _id: string; name: string }
    coursePaymentStatus: string
  }[]
}

export default function PaidExamsPage() {
  const [paidExams, setPaidExams] = useState<Exam[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPaidExams = async () => {
      try {
        const studentId = await studentService.getCurrentStudentId()
        if (!studentId) {
          console.error("No logged-in student found.")
          return
        }

        const response = await studentService.getAllCourses()
        const allCourses: Course[] = response.data?.data || []

        // ✅ Collect all exams paid by this student
        const allPaidExams: Exam[] = allCourses.flatMap((course) =>
          course.exams?.filter((exam) =>
            exam.subscribedStudents?.some(
              (sub) =>
                sub.studentId?._id === studentId &&
                sub.examPaymentStatus === "paid"
            )
          ) || []
        )

        setPaidExams(allPaidExams)
      } catch (error) {
        console.error("Error fetching paid exams:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchPaidExams()
  }, [])

  if (loading) {
    return (
      <StudentLayout>
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-600 text-lg animate-pulse">
            Loading your paid exams...
          </p>
        </div>
      </StudentLayout>
    )
  }

  return (
    <ProtectedRoute allowedRole="student">
      <StudentLayout>
        <div className="p-6">
          <h1 className="text-2xl font-semibold mb-4 text-blue-700">
            🧾 My Paid Exams
          </h1>

          {paidExams.length === 0 ? (
            <p className="text-gray-600">You haven’t paid for any exams yet.</p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {paidExams.map((exam) => (
                <div
                  key={exam._id}
                  className="p-5 bg-white border rounded-xl shadow-sm hover:shadow-md transition"
                >
                  <h2 className="text-lg font-semibold text-gray-800">
                    {exam.name}
                  </h2>
                  {exam.description && (
                    <p className="text-sm text-gray-600 mt-1">
                      {exam.description}
                    </p>
                  )}
                  {exam.code && (
                    <p className="text-xs text-gray-500 mt-1">Code: {exam.code}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </StudentLayout>
    </ProtectedRoute>
  )
}
