import api from "@/lib/api"

export const adminService = {
  // Users
  getUsers: async (params?: any) => {
    try {
      return await api.get("/v1/users", { params })
    } catch (error) {
      console.error("[v0] Error fetching users:", error)
      throw error
    }
  },
  getUserById: async (id: string) => {
    try {
      return await api.get(`/v1/users/${id}`)
    } catch (error) {
      console.error("[v0] Error fetching user:", error)
      throw error
    }
  },
  createUser: async (data: any) => {
    try {
      return await api.post("/v1/users", data)
    } catch (error) {
      console.error("[v0] Error creating user:", error)
      throw error
    }
  },
  updateUser: async (id: string, data: any) => {
    try {
      return await api.put(`/v1/users/${id}`, data)
    } catch (error) {
      console.error("[v0] Error updating user:", error)
      throw error
    }
  },
  deleteUser: async (id: string) => {
    try {
      return await api.delete(`/v1/users/${id}`)
    } catch (error) {
      console.error("[v0] Error deleting user:", error)
      throw error
    }
  },
  softDeleteUser: async (id: string) => {
    try {
      return await api.patch(`/v1/users/${id}/soft-delete`)
    } catch (error) {
      console.error("[v0] Error soft deleting user:", error)
      throw error
    }
  },
  restoreUser: async (id: string) => {
    try {
      return await api.patch(`/v1/users/${id}/restore`)
    } catch (error) {
      console.error("[v0] Error restoring user:", error)
      throw error
    }
  },

  // Universities
  getUniversities: async (params?: any) => {
    try {
      return await api.get("/v1/universities", { params })
    } catch (error) {
      console.error("[v0] Error fetching universities:", error)
      throw error
    }
  },
  getUniversityById: async (id: string) => {
    try {
      return await api.get(`/v1/universities/${id}`)
    } catch (error) {
      console.error("[v0] Error fetching university:", error)
      throw error
    }
  },
  createUniversity: async (data: any) => {
    try {
      return await api.post("/v1/universities", data)
    } catch (error) {
      console.error("[v0] Error creating university:", error)
      throw error
    }
  },
  updateUniversity: async (id: string, data: any) => {
    try {
      return await api.put(`/v1/universities/${id}`, data)
    } catch (error) {
      console.error("[v0] Error updating university:", error)
      throw error
    }
  },
  softDeleteUniversity: async (id: string) => {
    try {
      return await api.patch(`/v1/universities/${id}/soft-delete`)
    } catch (error) {
      console.error("[v0] Error soft deleting university:", error)
      throw error
    }
  },
  restoreUniversity: async (id: string) => {
    try {
      return await api.patch(`/v1/universities/${id}/restore`)
    } catch (error) {
      console.error("[v0] Error restoring university:", error)
      throw error
    }
  },

  // Colleges
  getColleges: async (params?: any) => {
    try {
      return await api.get("/v1/colleges", { params })
    } catch (error) {
      console.error("[v0] Error fetching colleges:", error)
      throw error
    }
  },
  createCollege: async (data: any) => {
    try {
      return await api.post("/v1/colleges", data)
    } catch (error) {
      console.error("[v0] Error creating college:", error)
      throw error
    }
  },
  updateCollege: async (id: string, data: any) => {
    try {
      return await api.put(`/v1/colleges/${id}`, data)
    } catch (error) {
      console.error("[v0] Error updating college:", error)
      throw error
    }
  },
  deleteCollege: async (id: string) => {
    try {
      return await api.delete(`/v1/colleges/${id}`)
    } catch (error) {
      console.error("[v0] Error deleting college:", error)
      throw error
    }
  },

  // Faculties
  getFaculties: async (params?: any) => {
    try {
      return await api.get("/v1/faculties", { params })
    } catch (error) {
      console.error("[v0] Error fetching faculties:", error)
      throw error
    }
  },
  createFaculty: async (data: any) => {
    try {
      return await api.post("/v1/faculties", data)
    } catch (error) {
      console.error("[v0] Error creating faculty:", error)
      throw error
    }
  },
  updateFaculty: async (id: string, data: any) => {
    try {
      return await api.put(`/v1/faculties/${id}`, data)
    } catch (error) {
      console.error("[v0] Error updating faculty:", error)
      throw error
    }
  },
  deleteFaculty: async (id: string) => {
    try {
      return await api.delete(`/v1/faculties/${id}`)
    } catch (error) {
      console.error("[v0] Error deleting faculty:", error)
      throw error
    }
  },

  // Departments
  getDepartments: async (params?: any) => {
    try {
      return await api.get("/v1/departments", { params })
    } catch (error) {
      console.error("[v0] Error fetching departments:", error)
      throw error
    }
  },
  getDepartmentById: async (id: string) => {
    try {
      return await api.get(`/v1/departments/${id}`)
    } catch (error) {
      console.error("[v0] Error fetching department:", error)
      throw error
    }
  },
  createDepartment: async (data: any) => {
    try {
      return await api.post("/v1/departments", data)
    } catch (error) {
      console.error("[v0] Error creating department:", error)
      throw error
    }
  },
  updateDepartment: async (id: string, data: any) => {
    try {
      return await api.patch(`/v1/departments/${id}`, data)
    } catch (error) {
      console.error("[v0] Error updating department:", error)
      throw error
    }
  },
  softDeleteDepartment: async (id: string) => {
    try {
      return await api.patch(`/v1/departments/${id}/soft-delete`)
    } catch (error) {
      console.error("[v0] Error soft deleting department:", error)
      throw error
    }
  },
  restoreDepartment: async (id: string) => {
    try {
      return await api.patch(`/v1/departments/${id}/restore`)
    } catch (error) {
      console.error("[v0] Error restoring department:", error)
      throw error
    }
  },
  deleteDepartment: async (id: string) => {
    try {
      return await api.delete(`/v1/departments/${id}`)
    } catch (error) {
      console.error("[v0] Error deleting department:", error)
      throw error
    }
  },

  // Programs
  getPrograms: async (params?: any) => {
    try {
      return await api.get("/v1/programs", { params })
    } catch (error) {
      console.error("[v0] Error fetching programs:", error)
      throw error
    }
  },
  createProgram: async (data: any) => {
    try {
      return await api.post("/v1/programs", data)
    } catch (error) {
      console.error("[v0] Error creating program:", error)
      throw error
    }
  },
  updateProgram: async (id: string, data: any) => {
    try {
      return await api.put(`/v1/programs/${id}`, data)
    } catch (error) {
      console.error("[v0] Error updating program:", error)
      throw error
    }
  },
  deleteProgram: async (id: string) => {
    try {
      return await api.delete(`/v1/programs/${id}`)
    } catch (error) {
      console.error("[v0] Error deleting program:", error)
      throw error
    }
  },

  // Courses
  getCourses: async (params?: any) => {
    try {
      return await api.get("/v1/courses", { params })
    } catch (error) {
      console.error("[v0] Error fetching courses:", error)
      throw error
    }
  },
  createCourse: async (data: any) => {
    try {
      return await api.post("/v1/courses", data)
    } catch (error) {
      console.error("[v0] Error creating course:", error)
      throw error
    }
  },
  updateCourse: async (id: string, data: any) => {
    try {
      return await api.put(`/v1/courses/${id}`, data)
    } catch (error) {
      console.error("[v0] Error updating course:", error)
      throw error
    }
  },
  deleteCourse: async (id: string) => {
    try {
      return await api.delete(`/v1/courses/${id}`)
    } catch (error) {
      console.error("[v0] Error deleting course:", error)
      throw error
    }
  },

  // Exams
  getExams: async (params?: any) => {
    try {
      return await api.get("/v1/exams", { params })
    } catch (error) {
      console.error("[v0] Error fetching exams:", error)
      throw error
    }
  },
  createExam: async (data: any) => {
    try {
      return await api.post("/v1/exams", data)
    } catch (error) {
      console.error("[v0] Error creating exam:", error)
      throw error
    }
  },
  updateExam: async (id: string, data: any) => {
    try {
      return await api.put(`/v1/exams/${id}`, data)
    } catch (error) {
      console.error("[v0] Error updating exam:", error)
      throw error
    }
  },
  deleteExam: async (id: string) => {
    try {
      return await api.delete(`/v1/exams/${id}`)
    } catch (error) {
      console.error("[v0] Error deleting exam:", error)
      throw error
    }
  },

  // Questions
  getQuestions: async (params?: any) => {
    try {
      return await api.get("/v1/questions", { params })
    } catch (error) {
      console.error("[v0] Error fetching questions:", error)
      throw error
    }
  },
  createQuestion: async (data: any) => {
    try {
      return await api.post("/v1/questions", data)
    } catch (error) {
      console.error("[v0] Error creating question:", error)
      throw error
    }
  },
  updateQuestion: async (id: string, data: any) => {
    try {
      return await api.put(`/v1/questions/${id}`, data)
    } catch (error) {
      console.error("[v0] Error updating question:", error)
      throw error
    }
  },
  deleteQuestion: async (id: string) => {
    try {
      return await api.delete(`/v1/questions/${id}`)
    } catch (error) {
      console.error("[v0] Error deleting question:", error)
      throw error
    }
  },

  // Payments
  getPayments: async (params?: any) => {
    try {
      return await api.get("/v1/payments", { params })
    } catch (error) {
      console.error("[v0] Error fetching payments:", error)
      throw error
    }
  },
  createPayment: async (data: any) => {
    try {
      return await api.post("/v1/payments", data)
    } catch (error) {
      console.error("[v0] Error creating payment:", error)
      throw error
    }
  },
  updatePayment: async (id: string, data: any) => {
    try {
      return await api.put(`/v1/payments/${id}`, data)
    } catch (error) {
      console.error("[v0] Error updating payment:", error)
      throw error
    }
  },
  deletePayment: async (id: string) => {
    try {
      return await api.delete(`/v1/payments/${id}`)
    } catch (error) {
      console.error("[v0] Error deleting payment:", error)
      throw error
    }
  },
}
