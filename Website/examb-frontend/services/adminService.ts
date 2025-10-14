import api from "@/lib/api"

export const adminService = {
  // Users
  getUsers: (params?: any) => api.get("/v1/users", { params }),
  getUserById: (id: string) => api.get(`/v1/users/${id}`),
  createUser: (data: any) => api.post("/v1/users", data),
  updateUser: (id: string, data: any) => api.put(`/v1/users/${id}`, data),
  deleteUser: (id: string) => api.delete(`/v1/users/${id}`),
  softDeleteUser: (id: string) => api.patch(`/v1/users/${id}/soft-delete`),
  restoreUser: (id: string) => api.patch(`/v1/users/${id}/restore`),

  // Universities
  getUniversities: (params?: any) => api.get("/v1/universities", { params }),
  getUniversityById: (id: string) => api.get(`/v1/universities/${id}`),
  createUniversity: (data: any) => api.post("/v1/universities", data),
  updateUniversity: (id: string, data: any) => api.put(`/v1/universities/${id}`, data),
  softDeleteUniversity: (id: string) => api.patch(`/v1/universities/${id}/soft-delete`),
  restoreUniversity: (id: string) => api.patch(`/v1/universities/${id}/restore`),

  // Colleges
  getColleges: (params?: any) => api.get("/v1/colleges", { params }),
  createCollege: (data: any) => api.post("/v1/colleges", data),
  updateCollege: (id: string, data: any) => api.put(`/v1/colleges/${id}`, data),
  deleteCollege: (id: string) => api.delete(`/v1/colleges/${id}`),

  // Faculties
  getFaculties: (params?: any) => api.get("/v1/faculties", { params }),
  createFaculty: (data: any) => api.post("/v1/faculties", data),
  updateFaculty: (id: string, data: any) => api.put(`/v1/faculties/${id}`, data),
  deleteFaculty: (id: string) => api.delete(`/v1/faculties/${id}`),

  // Departments
  getDepartments: (params?: any) => api.get("/v1/departments", { params }),
  getDepartmentById: (id: string) => api.get(`/v1/departments/${id}`),
  createDepartment: (data: any) => api.post("/v1/departments", data),
  updateDepartment: (id: string, data: any) => api.patch(`/v1/departments/${id}`, data),
  softDeleteDepartment: (id: string) => api.patch(`/v1/departments/${id}/soft-delete`),
  restoreDepartment: (id: string) => api.patch(`/v1/departments/${id}/restore`),
  deleteDepartment: (id: string) => api.delete(`/v1/departments/${id}`),

  // Programs
  getPrograms: (params?: any) => api.get("/v1/programs", { params }),
  createProgram: (data: any) => api.post("/v1/programs", data),
  updateProgram: (id: string, data: any) => api.put(`/v1/programs/${id}`, data),
  deleteProgram: (id: string) => api.delete(`/v1/programs/${id}`),

  // Courses
  getCourses: (params?: any) => api.get("/v1/courses", { params }),
  createCourse: (data: any) => api.post("/v1/courses", data),
  updateCourse: (id: string, data: any) => api.put(`/v1/courses/${id}`, data),
  deleteCourse: (id: string) => api.delete(`/v1/courses/${id}`),

  // Exams
  getExams: (params?: any) => api.get("/v1/exams", { params }),
  createExam: (data: any) => api.post("/v1/exams", data),
  updateExam: (id: string, data: any) => api.put(`/v1/exams/${id}`, data),
  deleteExam: (id: string) => api.delete(`/v1/exams/${id}`),

  // Questions
  getQuestions: (params?: any) => api.get("/v1/questions", { params }),
  createQuestion: (data: any) => api.post("/v1/questions", data),
  updateQuestion: (id: string, data: any) => api.put(`/v1/questions/${id}`, data),
  deleteQuestion: (id: string) => api.delete(`/v1/questions/${id}`),

  // Payments
  getPayments: (params?: any) => api.get("/v1/payments", { params }),
  createPayment: (data: any) => api.post("/v1/payments", data),
  updatePayment: (id: string, data: any) => api.put(`/v1/payments/${id}`, data),
  deletePayment: (id: string) => api.delete(`/v1/payments/${id}`),
}
