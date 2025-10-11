import api from "@/lib/api";

export const studentService = {
  // Get all available courses - CORRECT ENDPOINT
  getAllCourses: (params?: any) => api.get("/v1/courses", { params }),
  
  // Your other existing methods...
  getAvailableExams: (params?: any) => api.get("/v1/exams", { params: { ...params, status: "published" } }),
  getExamById: (id: string) => api.get(`/v1/exams/${id}`),
  submitExam: (examId: string, data: any) => api.post(`/v1/exams/${examId}/submit`, data),
  enrollCourse: (courseId: string) => api.post(`/v1/courses/${courseId}/enroll`),
  initializeCoursePayment: (courseId: string, examId: string) => api.post("/v1/payments/course", { courseId }),
}