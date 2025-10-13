import api from "@/lib/api"

export const studentService = {
  // ✅ Get current logged-in student ID
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

  // ✅ Get all courses
  getAllCourses: (params?: any) => api.get("/v1/courses", { params }),

  // ✅ Get published exams
  getAvailableExams: (params?: any) =>
    api.get("/v1/exams", {
      params: { ...params, status: "published" },
    }),

  // ✅ Get single exam
  getExamById: (id: string) => api.get(`/v1/exams/${id}`),

  // ✅ Submit exam
  submitExam: (examId: string, data: any) => api.post(`/v1/exams/${examId}/submit`, data),

  // ✅ Enroll in course
  enrollCourse: (courseId: string) => api.post(`/v1/courses/${courseId}/enroll`),

  // ✅ Initialize course payment - Pay for full course access
  initializeCoursePayment: (courseId: string) => api.post("/v1/payments/initiate", { courseId, type: "course" }),

  // ✅ Initialize exam payment - Pay for individual exam access
  initializeExamPayment: (examId: string, courseId?: string) =>
    api.post("/v1/payments/initiate", { examId, courseId, type: "exam" }),

  // ✅ Initialize payment (generic)
  initializePayment: (payload: { courseId?: string; examId?: string; type?: string }) =>
    api.post("/v1/payments/initiate", payload),

  // ✅ Get dashboard statistics
  getDashboardStats: () => api.get("/v1/students/dashboard-stats"),

  // ✅ Get student's enrolled courses
  getEnrolledCourses: () => api.get("/v1/students/courses"),

  // ✅ Get student's payment history
  getPaymentHistory: () => api.get("/v1/students/payments"),

  // TEMPORARY: Add a method to set test student ID for debugging
  setTestStudentId: (id: string) => {
    const testUser = {
      _id: id,
      name: "Test User",
    }
    localStorage.setItem("student", JSON.stringify(testUser))
    console.log("🧪 Set test student ID to:", id)
  },
}
