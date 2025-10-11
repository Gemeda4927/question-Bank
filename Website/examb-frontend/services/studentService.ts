import api from "@/lib/api"

export const studentService = {
  // Get available exams for students
  getAvailableExams: (params?: any) => api.get("/exams", { params: { ...params, status: "published" } }),

  // Get exam by ID
  getExamById: (id: string) => api.get(`/exams/${id}`),

  // Submit exam answers
  submitExam: (examId: string, data: any) => api.post(`/exams/${examId}/submit`, data),

  // Get student's exam results
  getMyResults: (params?: any) => api.get("/results/my-results", { params }),

  // Get specific result
  getResultById: (id: string) => api.get(`/results/${id}`),

  // Get enrolled courses
  getMyCourses: (params?: any) => api.get("/courses/my-courses", { params }),

  // Get course by ID
  getCourseById: (id: string) => api.get(`/courses/${id}`),

  // Enroll in a course
  enrollCourse: (courseId: string) => api.post(`/courses/${courseId}/enroll`),

  // Get student dashboard stats
  getDashboardStats: () => api.get("/students/dashboard-stats"),

  // Get student profile
  getProfile: () => api.get("/students/profile"),

  // Update student profile
  updateProfile: (data: any) => api.put("/students/profile", data),

  // Initialize course payment
  initializeCoursePayment: (courseId: string) => api.post("/payments/course", { courseId }),

  // Get payment history
  getPaymentHistory: (params?: any) => api.get("/payments/history", { params }),

  // Get all available courses (not just enrolled)
  getAllCourses: (params?: any) => api.get("/courses", { params }),
}
