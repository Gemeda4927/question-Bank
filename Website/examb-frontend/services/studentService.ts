import api from "@/lib/api";

export const studentService = {
  // ✅ Get current logged-in student ID
  getCurrentStudentId: async (): Promise<
    string | null
  > => {
    try {
      const storedUser =
        localStorage.getItem("student");
      console.log(
        "🔍 Stored user data from localStorage:",
        storedUser
      ); // Log raw stored data

      if (!storedUser) {
        console.warn(
          "❌ No student data found in localStorage under 'student' key."
        );
        return null;
      }

      let parsedUser;
      try {
        parsedUser = JSON.parse(storedUser);
        console.log(
          "🧪 Parsed user data:",
          parsedUser
        ); // Log parsed data
      } catch (parseError) {
        console.error(
          "❌ Error parsing stored user data:",
          parseError
        );
        return null;
      }

      const studentId =
        parsedUser?._id || parsedUser?.id;
      console.log(
        "🔑 Extracted student ID:",
        studentId
      ); // Log the extracted ID

      if (
        !studentId ||
        typeof studentId !== "string"
      ) {
        console.warn(
          "❌ Invalid or missing student ID in parsed data:",
          parsedUser
        );
        return null;
      }

      return studentId;
    } catch (error) {
      console.error(
        "logError getting current student ID:",
        error
      );
      return null;
    }
  },

  // ✅ Get all courses
  getAllCourses: (params?: any) =>
    api.get("/v1/courses", { params }),

  // ✅ Get published exams
  getAvailableExams: (params?: any) =>
    api.get("/v1/exams", {
      params: { ...params, status: "published" },
    }),

  // ✅ Get single exam
  getExamById: (id: string) =>
    api.get(`/v1/exams/${id}`),

  // ✅ Submit exam
  submitExam: (examId: string, data: any) =>
    api.post(`/v1/exams/${examId}/submit`, data),

  // ✅ Enroll in course
  enrollCourse: (courseId: string) =>
    api.post(`/v1/courses/${courseId}/enroll`),

  // ✅ Initialize payment
  initializePayment: (payload: {
    courseId?: string;
    examId?: string;
  }) =>
    api.post("/v1/payments/initiate", payload),

  // TEMPORARY: Add a method to set test student ID for debugging
  setTestStudentId: (id: string) => {
    const testUser = {
      _id: id,
      name: "Test User",
    };
    localStorage.setItem(
      "student",
      JSON.stringify(testUser)
    );
    console.log("🧪 Set test student ID to:", id);
  },
};
