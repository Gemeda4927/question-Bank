import api from "@/lib/api"

export const studentService = {
  // 🔐 Authentication & User Management
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

  // 👤 Profile Management
  getProfile: async () => {
    try {
      const studentId = await studentService.getCurrentStudentId()
      if (!studentId) {
        throw new Error("No student ID found")
      }
      return await api.get(`/v1/users/${studentId}`)
    } catch (error) {
      console.error("Error fetching profile:", error)
      throw error
    }
  },

  updateProfile: async (data: any) => {
    try {
      const studentId = await studentService.getCurrentStudentId()
      if (!studentId) {
        throw new Error("No student ID found")
      }
      return await api.put(`/v1/users/${studentId}`, data)
    } catch (error) {
      console.error("Error updating profile:", error)
      throw error
    }
  },

  updateProfileField: async (field: string, value: string) => {
    try {
      const studentId = await studentService.getCurrentStudentId()
      if (!studentId) {
        throw new Error("No student ID found")
      }
      return await api.patch(`/v1/users/${studentId}`, { [field]: value })
    } catch (error) {
      console.error(`Error updating profile field ${field}:`, error)
      throw error
    }
  },

  // 📚 Course Management
  getAllCourses: (params?: any) => api.get("/v1/courses", { params }),
  
  getEnrolledCourses: async () => {
    try {
      const studentId = await studentService.getCurrentStudentId()
      if (!studentId) {
        throw new Error("No student ID found")
      }
      return await api.get(`/v1/users/${studentId}/courses`)
    } catch (error) {
      console.error("Error fetching enrolled courses:", error)
      throw error
    }
  },

  getCourseById: (id: string) => api.get(`/v1/courses/${id}`),
  
  enrollCourse: async (courseId: string) => {
    try {
      const studentId = await studentService.getCurrentStudentId()
      if (!studentId) {
        throw new Error("No student ID found")
      }
      return await api.post(`/v1/courses/${courseId}/enroll`, { studentId })
    } catch (error) {
      console.error("Error enrolling in course:", error)
      throw error
    }
  },

  // 🎯 Exam Management
  getAvailableExams: (params?: any) =>
    api.get("/v1/exams", {
      params: { ...params, status: "published" },
    }),

  getExamById: (id: string) => api.get(`/v1/exams/${id}`),

  getExamHistory: async () => {
    try {
      const studentId = await studentService.getCurrentStudentId()
      if (!studentId) {
        throw new Error("No student ID found")
      }
      return await api.get(`/v1/users/${studentId}/exams`)
    } catch (error) {
      console.error("Error fetching exam history:", error)
      throw error
    }
  },

  submitExam: async (examId: string, data: any) => {
    try {
      const studentId = await studentService.getCurrentStudentId()
      if (!studentId) {
        throw new Error("No student ID found")
      }
      return await api.post(`/v1/exams/${examId}/submit`, {
        ...data,
        studentId
      })
    } catch (error) {
      console.error("Error submitting exam:", error)
      throw error
    }
  },

  getExamResults: async (examId: string) => {
    try {
      const studentId = await studentService.getCurrentStudentId()
      if (!studentId) {
        throw new Error("No student ID found")
      }
      return await api.get(`/v1/exams/${examId}/results/${studentId}`)
    } catch (error) {
      console.error("Error fetching exam results:", error)
      throw error
    }
  },

  // 💰 Payment Management
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

  getPaymentHistory: async () => {
    try {
      const studentId = await studentService.getCurrentStudentId()
      if (!studentId) {
        throw new Error("No student ID found")
      }
      return await api.get(`/v1/users/${studentId}/payments`)
    } catch (error) {
      console.error("Error fetching payment history:", error)
      throw error
    }
  },

  verifyPayment: (paymentId: string) => 
    api.get(`/v1/payments/${paymentId}/verify`),

  // 📊 Dashboard & Analytics
  getDashboardStats: async () => {
    try {
      const studentId = await studentService.getCurrentStudentId()
      if (!studentId) {
        throw new Error("No student ID found")
      }
      return await api.get(`/v1/users/${studentId}/dashboard/stats`)
    } catch (error) {
      console.error("Error fetching dashboard stats:", error)
      // Fallback to general stats if user-specific fails
      return await api.get("/v1/exams/dashboard/stats")
    }
  },

  getAcademicProgress: async () => {
    try {
      const studentId = await studentService.getCurrentStudentId()
      if (!studentId) {
        throw new Error("No student ID found")
      }
      return await api.get(`/v1/users/${studentId}/progress`)
    } catch (error) {
      console.error("Error fetching academic progress:", error)
      throw error
    }
  },

  // 🏆 Achievements & Certificates
  getAchievements: async () => {
    try {
      const studentId = await studentService.getCurrentStudentId()
      if (!studentId) {
        throw new Error("No student ID found")
      }
      return await api.get(`/v1/users/${studentId}/achievements`)
    } catch (error) {
      console.error("Error fetching achievements:", error)
      throw error
    }
  },

  getCertificates: async () => {
    try {
      const studentId = await studentService.getCurrentStudentId()
      if (!studentId) {
        throw new Error("No student ID found")
      }
      return await api.get(`/v1/users/${studentId}/certificates`)
    } catch (error) {
      console.error("Error fetching certificates:", error)
      throw error
    }
  },

  downloadCertificate: (certificateId: string) =>
    api.get(`/v1/certificates/${certificateId}/download`, {
      responseType: 'blob'
    }),

  // 🔔 Notifications & Settings
  getNotifications: async () => {
    try {
      const studentId = await studentService.getCurrentStudentId()
      if (!studentId) {
        throw new Error("No student ID found")
      }
      return await api.get(`/v1/users/${studentId}/notifications`)
    } catch (error) {
      console.error("Error fetching notifications:", error)
      throw error
    }
  },

  markNotificationAsRead: async (notificationId: string) => {
    try {
      const studentId = await studentService.getCurrentStudentId()
      if (!studentId) {
        throw new Error("No student ID found")
      }
      return await api.patch(`/v1/users/${studentId}/notifications/${notificationId}/read`)
    } catch (error) {
      console.error("Error marking notification as read:", error)
      throw error
    }
  },

  updateNotificationSettings: async (settings: any) => {
    try {
      const studentId = await studentService.getCurrentStudentId()
      if (!studentId) {
        throw new Error("No student ID found")
      }
      return await api.put(`/v1/users/${studentId}/notification-settings`, settings)
    } catch (error) {
      console.error("Error updating notification settings:", error)
      throw error
    }
  },

  // 🛠️ Utility Methods
  refreshUserData: async () => {
    try {
      const response = await studentService.getProfile()
      const userData = response.data?.data || response.data
      
      if (userData && typeof window !== "undefined") {
        const currentData = JSON.parse(localStorage.getItem("student") || "{}")
        const updatedData = {
          ...currentData,
          ...userData,
          lastSynced: new Date().toISOString()
        }
        localStorage.setItem("student", JSON.stringify(updatedData))
        console.log("🔄 User data refreshed in localStorage")
        return updatedData
      }
    } catch (error) {
      console.error("Error refreshing user data:", error)
    }
  },

  clearLocalData: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("student")
      localStorage.removeItem("token")
      console.log("🧹 Local student data cleared")
    }
  },

  // 🧪 Development & Testing
  setTestStudentId: (id: string) => {
    const testUser = {
      _id: id,
      id: id,
      name: "Test User",
      email: "test@example.com",
      role: "student",
      createdAt: new Date().toISOString()
    }
    localStorage.setItem("student", JSON.stringify(testUser))
    console.log("🧪 Set test student ID to:", id)
    return testUser
  },

  // 🎯 Quick Status Check
  getStudentStatus: async () => {
    try {
      const studentId = await studentService.getCurrentStudentId()
      if (!studentId) {
        return { isAuthenticated: false, studentId: null }
      }
      
      const profile = await studentService.getProfile()
      return {
        isAuthenticated: true,
        studentId,
        profile: profile.data?.data || profile.data,
        lastSynced: new Date().toISOString()
      }
    } catch (error) {
      return { 
        isAuthenticated: false, 
        studentId: null,
        error: "Failed to fetch student status"
      }
    }
  }
}