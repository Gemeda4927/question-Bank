import api from "@/lib/api"

export const adminService = {
  getUsers: (params?: any) => api.get("/users", { params }),
  getUserById: (id: string) => api.get(`/users/${id}`),
  createUser: (data: any) => api.post("/users", data),
  updateUser: (id: string, data: any) => api.put(`/users/${id}`, data),
  deleteUser: (id: string) => api.delete(`/users/${id}`),
  softDeleteUser: (id: string) => api.patch(`/users/${id}/soft-delete`),
  restoreUser: (id: string) => api.patch(`/users/${id}/restore`),

  // Universities
  getUniversities: (params?: any) => api.get("/universities", { params }),
  getUniversityById: (id: string) => api.get(`/universities/${id}`),
  createUniversity: (data: any) => api.post("/universities", data),
  updateUniversity: (id: string, data: any) => api.put(`/universities/${id}`, data),
  softDeleteUniversity: (id: string) => api.patch(`/universities/${id}/soft-delete`),
  restoreUniversity: (id: string) => api.patch(`/universities/${id}/restore`),

  // Colleges
  getColleges: (params?: any) => api.get("/colleges", { params }),
  createCollege: (data: any) => api.post("/colleges", data),
  updateCollege: (id: string, data: any) => api.put(`/colleges/${id}`, data),
  deleteCollege: (id: string) => api.delete(`/colleges/${id}`),

  // Faculties
  getFaculties: (params?: any) => api.get("/faculties", { params }),
  createFaculty: (data: any) => api.post("/faculties", data),
  updateFaculty: (id: string, data: any) => api.put(`/faculties/${id}`, data),
  deleteFaculty: (id: string) => api.delete(`/faculties/${id}`),

  // Departments
  getDepartments: (params?: any) => api.get("/departments", { params }),
  getDepartmentById: (id: string) => api.get(`/departments/${id}`),
  createDepartment: (data: any) => api.post("/departments", data),
  updateDepartment: (id: string, data: any) => api.patch(`/departments/${id}`, data),
  softDeleteDepartment: (id: string) => api.patch(`/departments/${id}/soft-delete`),
  restoreDepartment: (id: string) => api.patch(`/departments/${id}/restore`),
  deleteDepartment: (id: string) => api.delete(`/departments/${id}`),

  // Programs
  getPrograms: (params?: any) => api.get("/programs", { params }),
  createProgram: (data: any) => api.post("/programs", data),
  updateProgram: (id: string, data: any) => api.put(`/programs/${id}`, data),
  deleteProgram: (id: string) => api.delete(`/programs/${id}`),

  // Courses
  getCourses: (params?: any) => api.get("/courses", { params }),
  createCourse: (data: any) => api.post("/courses", data),
  updateCourse: (id: string, data: any) => api.put(`/courses/${id}`, data),
  deleteCourse: (id: string) => api.delete(`/courses/${id}`),

  // Exams
  getExams: (params?: any) => api.get("/exams", { params }),
  createExam: (data: any) => api.post("/exams", data),
  updateExam: (id: string, data: any) => api.put(`/exams/${id}`, data),
  deleteExam: (id: string) => api.delete(`/exams/${id}`),

  // Questions
  getQuestions: (params?: any) => api.get("/questions", { params }),
  createQuestion: (data: any) => api.post("/questions", data),
  updateQuestion: (id: string, data: any) => api.put(`/questions/${id}`, data),
  deleteQuestion: (id: string) => api.delete(`/questions/${id}`),

  // Payments
  getPayments: (params?: any) => api.get("/payments", { params }),
  createPayment: (data: any) => api.post("/payments", data),
  updatePayment: (id: string, data: any) => api.put(`/payments/${id}`, data),
  deletePayment: (id: string) => api.delete(`/payments/${id}`),
}
