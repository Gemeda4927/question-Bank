import api from "@/lib/api";

interface PaymentPayload {
  courseId?: string;
  examId?: string;
  type?: string;
}

export const studentService = {
  // 🔐 Authentication & User Management
  getCurrentStudentId: async (): Promise<string | null> => {
    try {
      const storedUser = localStorage.getItem("student");
      if (!storedUser) return null;

      const parsedUser = JSON.parse(storedUser);
      return parsedUser?._id || parsedUser?.id || null;
    } catch (error) {
      console.error("Error getting current student ID:", error);
      return null;
    }
  },

  // 👤 Profile Management
  getProfile: async () => {
    const studentId = await studentService.getCurrentStudentId();
    if (!studentId) throw new Error("No student ID found");
    return api.get(`/v1/users/${studentId}`);
  },

  updateProfile: async (data: any) => {
    const studentId = await studentService.getCurrentStudentId();
    if (!studentId) throw new Error("No student ID found");
    return api.put(`/v1/users/${studentId}`, data);
  },

  updateProfileField: async (field: string, value: string) => {
    const studentId = await studentService.getCurrentStudentId();
    if (!studentId) throw new Error("No student ID found");
    return api.patch(`/v1/users/${studentId}`, { [field]: value });
  },

  // 📚 Course Management
  getAllCourses: (params?: any) => api.get("/v1/courses", { params }),

  getEnrolledCourses: async () => {
    const studentId = await studentService.getCurrentStudentId();
    if (!studentId) throw new Error("No student ID found");
    return api.get(`/v1/users/${studentId}/courses`);
  },

  getCourseById: (id: string) => api.get(`/v1/courses/${id}`),

  enrollCourse: async (courseId: string) => {
    const studentId = await studentService.getCurrentStudentId();
    if (!studentId) throw new Error("No student ID found");
    return api.post(`/v1/courses/${courseId}/enroll`, { studentId });
  },

  // 🎯 Exam Management
  getAvailableExams: (params?: any) =>
    api.get("/v1/exams", { params: { ...params, status: "published" } }),

  getExamById: (id: string) => api.get(`/v1/exams/${id}`),

  getExamHistory: async () => {
    const studentId = await studentService.getCurrentStudentId();
    if (!studentId) throw new Error("No student ID found");
    return api.get(`/v1/users/${studentId}/exams`);
  },

  submitExam: async (examId: string, data: any) => {
    const studentId = await studentService.getCurrentStudentId();
    if (!studentId) throw new Error("No student ID found");
    return api.post(`/v1/exams/${examId}/submit`, { ...data, studentId });
  },

  getExamResults: async (examId: string) => {
    const studentId = await studentService.getCurrentStudentId();
    if (!studentId) throw new Error("No student ID found");
    return api.get(`/v1/exams/${examId}/results/${studentId}`);
  },














  // 💰 Payments
  initializeCoursePayment: (courseId: string, p0: { type: string; }) =>
    api.post(`/v1/courses/${courseId}/payment`),

  initializeExamPayment: (examId: string, courseId: string) =>
    api.post(`/v1/courses/${courseId}/exam-payment`, { examId }),

  initializePayment: (payload: PaymentPayload) =>
    api.post("/v1/payments/initiate", payload),

  getPaymentHistory: async () => {
    const studentId = await studentService.getCurrentStudentId();
    if (!studentId) throw new Error("No student ID found");
    return api.get(`/v1/users/${studentId}/payments`);
  },

  verifyPayment: (paymentId: string) =>
    api.get(`/v1/payments/${paymentId}/verify`),

  // 📊 Dashboard & Analytics
  getDashboardStats: async () => {
    const studentId = await studentService.getCurrentStudentId();
    if (!studentId) throw new Error("No student ID found");
    try {
      return await api.get(`/v1/users/${studentId}/dashboard/stats`);
    } catch {
      return await api.get("/v1/exams/dashboard/stats");
    }
  },















  
  getAcademicProgress: async () => {
    const studentId = await studentService.getCurrentStudentId();
    if (!studentId) throw new Error("No student ID found");
    return api.get(`/v1/users/${studentId}/progress`);
  },

  getAchievements: async () => {
    const studentId = await studentService.getCurrentStudentId();
    if (!studentId) throw new Error("No student ID found");
    return api.get(`/v1/users/${studentId}/achievements`);
  },

  getCertificates: async () => {
    const studentId = await studentService.getCurrentStudentId();
    if (!studentId) throw new Error("No student ID found");
    return api.get(`/v1/users/${studentId}/certificates`);
  },

  downloadCertificate: (certificateId: string) =>
    api.get(`/v1/certificates/${certificateId}/download`, { responseType: "blob" }),

  // 🔔 Notifications
  getNotifications: async () => {
    const studentId = await studentService.getCurrentStudentId();
    if (!studentId) throw new Error("No student ID found");
    return api.get(`/v1/users/${studentId}/notifications`);
  },

  markNotificationAsRead: async (notificationId: string) => {
    const studentId = await studentService.getCurrentStudentId();
    if (!studentId) throw new Error("No student ID found");
    return api.patch(`/v1/users/${studentId}/notifications/${notificationId}/read`);
  },

  updateNotificationSettings: async (settings: any) => {
    const studentId = await studentService.getCurrentStudentId();
    if (!studentId) throw new Error("No student ID found");
    return api.put(`/v1/users/${studentId}/notification-settings`, settings);
  },

  // 🛠️ Utility
  refreshUserData: async () => {
    const response = await studentService.getProfile();
    const userData = response.data?.data || response.data;
    if (userData && typeof window !== "undefined") {
      const currentData = JSON.parse(localStorage.getItem("student") || "{}");
      const updatedData = { ...currentData, ...userData, lastSynced: new Date().toISOString() };
      localStorage.setItem("student", JSON.stringify(updatedData));
      return updatedData;
    }
  },

  clearLocalData: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("student");
      localStorage.removeItem("token");
    }
  },

  setTestStudentId: (id: string) => {
    const testUser = { _id: id, id, name: "Test User", email: "test@example.com", role: "student", createdAt: new Date().toISOString() };
    localStorage.setItem("student", JSON.stringify(testUser));
    return testUser;
  },

  getStudentStatus: async () => {
    try {
      const studentId = await studentService.getCurrentStudentId();
      if (!studentId) return { isAuthenticated: false, studentId: null };

      const profile = await studentService.getProfile();
      return { isAuthenticated: true, studentId, profile: profile.data?.data || profile.data, lastSynced: new Date().toISOString() };
    } catch {
      return { isAuthenticated: false, studentId: null, error: "Failed to fetch student status" };
    }
  },
};
