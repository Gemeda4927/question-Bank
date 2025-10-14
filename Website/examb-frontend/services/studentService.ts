import api from "@/lib/api"

export const studentService = {
  getCurrentStudentId: async (): Promise<string | null> => {
    try {
      const storedUser = localStorage.getItem("student")
      console.log("🔍 Stored user data from localStorage:", storedUser)

      if (!storedUser) {
        console.warn("❌ No student data found in localStorage under 'student' key.")
        return null
      }

      let parsedUser
      try {
        parsedUser = JSON.parse(storedUser)
        console.log("🧪 Parsed user data:", parsedUser)
      } catch (parseError) {
        console.error("❌ Error parsing stored user data:", parseError)
        return null
      }

      const studentId = parsedUser?._id || parsedUser?.id
      console.log("🔑 Extracted student ID:", studentId)

      if (!studentId || typeof studentId !== "string") {
        console.warn("❌ Invalid or missing student ID in parsed data:", parsedUser)
        return null
      }

      return studentId
    } catch (error) {
      console.error("Error getting current student ID:", error)
      return null
    }
  },

  getAllCourses: (params?: any) => api.get("/v1/courses", { params }),
  getAvailableExams: (params?: any) =>
    api.get("/v1/exams", {
      params: { ...params, status: "published" },
    }),
  getExamById: (id: string) => api.get(`/v1/exams/${id}`),
  submitExam: (examId: string, data: any) => api.post(`/v1/exams/${examId}/submit`, data),
  enrollCourse: (courseId: string) => api.post(`/v1/courses/${courseId}/enroll`),
  initializeCoursePayment: (courseId: string) =>
    api.post("/v1/payments/initiate", {
      courseId,
      type: "course",
    }),
  initializeExamPayment: (examId: string, courseId?: string) =>
    api.post("/v1/payments/initiate", {
      examId,
      courseId,
      type: "exam",
    }),
  initializePayment: (payload: { courseId?: string; examId?: string; type?: string }) =>
    api.post("/v1/payments/initiate", payload),

  // ✅ Dashboard stats shared from exam controller
  getDashboardStats: () => api.get("/v1/exams/dashboard/stats"),

  getPaymentHistory: () => api.get("/v1/students/payments"),
  setTestStudentId: (id: string) => {
    const testUser = {
      _id: id,
      name: "Test User",
    }
    localStorage.setItem("student", JSON.stringify(testUser))
    console.log("🧪 Set test student ID to:", id)
  },
}
