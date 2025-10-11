"use client";
import { useEffect, useState } from "react";
import { studentService } from "@/services/studentService";
import { useRouter } from "next/navigation";
import { FaCheckCircle, FaTimesCircle, FaLock, FaArrowLeft } from "react-icons/fa";

export default function CoursePage({ params }: { params: { courseId: string } }) {
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedExam, setSelectedExam] = useState<any>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const router = useRouter();
  const studentId = localStorage.getItem("student")
    ? JSON.parse(localStorage.getItem("student") || "{}")._id
    : null;

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Authentication required");
          return;
        }

        const response = await studentService.getAllCourses();
        const allCourses = response.data.data || response.data;
        if (!allCourses || !Array.isArray(allCourses)) {
          throw new Error("Invalid API response format");
        }

        const foundCourse = allCourses.find((c: any) => c._id === params.courseId);
        if (!foundCourse) {
          setError("Course not found");
        } else {
          setCourse(foundCourse);
        }
      } catch (err: any) {
        console.error("❌ Error fetching courses:", err.message, err.response?.data || err);
        setError(err.response?.data?.message || "Failed to load courses");
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [params.courseId]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-purple-100">
        <p className="text-lg font-bold text-purple-600 animate-pulse">Loading course...</p>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-purple-100">
        <div className="text-center">
          <p className="text-red-600 font-bold text-lg">{error}</p>
          <button
            onClick={() => router.back()}
            className="mt-4 flex items-center justify-center gap-2 bg-purple-600 text-white px-6 py-2 rounded-lg shadow hover:bg-purple-700 transition"
          >
            <FaArrowLeft /> Go Back
          </button>
        </div>
      </div>
    );

  if (!course)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-purple-100">
        <p className="text-gray-500 text-lg">No course found.</p>
      </div>
    );

  const studentSubscription = course.subscribedStudents?.find(
    (s: any) => s.studentId?._id === studentId
  );
  const isEnrolled = !!studentSubscription;
  const hasPaid = isEnrolled && studentSubscription.coursePaymentStatus === "paid";

  // Merge course exams with student's paid exams
  const allExams = [
    ...(course.exams || []),
    ...(studentSubscription?.examsPaid?.map((e: any) => {
      const existingExam = course.exams?.find((ex: any) => ex._id === e.examId);
      return {
        _id: e.examId,
        name: existingExam?.name || `Exam ${e.examId}`,
        description: existingExam?.description || "",
        paymentStatus: e.paymentStatus || "unpaid",
      };
    }) || []),
  ];

  // Remove duplicates
  const uniqueExams = allExams.filter(
    (exam, index, self) => index === self.findIndex(e => e._id === exam._id)
  );

  const handleExamClick = async (exam: any) => {
    if (!isEnrolled) {
      alert("You need to enroll in the course to access the exam.");
      return;
    }

    try {
      const response = await studentService.getExamById(exam._id);
      setQuestions(response.data.questions || []);
      setSelectedExam(exam);
      setIsModalOpen(true);
    } catch (err) {
      console.error("Failed to load exam questions", err);
      alert("Failed to load questions");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-purple-100 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="mb-4 flex items-center gap-2 text-purple-600 font-semibold hover:underline"
        >
          <FaArrowLeft /> Back
        </button>

        {/* Course Card */}
        <div className="bg-white rounded-3xl shadow-xl p-6 mb-6 border-t-8 border-purple-600 hover:scale-[1.02] transition-transform duration-300">
          <h1 className="text-4xl font-extrabold mb-2 text-purple-800">{course.name}</h1>
          <p className="text-gray-600 mb-4">{course.description}</p>

          <div className="flex flex-wrap gap-4 mb-6">
            <span
              className={`px-4 py-1 rounded-full font-semibold ${
                isEnrolled ? (hasPaid ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800") : "bg-gray-200 text-gray-700"
              }`}
            >
              {isEnrolled ? (hasPaid ? "Enrolled & Paid" : "Enrolled") : "Not Enrolled"}
            </span>
            <span className="px-4 py-1 rounded-full bg-purple-100 text-purple-700 font-semibold">
              Level: {course.level}
            </span>
            <span className="px-4 py-1 rounded-full bg-purple-100 text-purple-700 font-semibold">
              Semester: {course.semester}
            </span>
            <span className="px-4 py-1 rounded-full bg-yellow-100 text-yellow-800 font-semibold">
              Price: ${course.price}
            </span>
          </div>

          {!isEnrolled && (
            <button
              className="bg-purple-600 text-white px-6 py-2 rounded-xl shadow-lg hover:bg-purple-700 transition font-semibold"
              onClick={() => alert("Subscribe / Payment flow goes here")}
            >
              Subscribe to Course
            </button>
          )}
        </div>

        {/* Exams Card */}
        <div className="bg-white p-6 rounded-3xl shadow-xl hover:shadow-2xl transition mb-6">
          <h2 className="text-2xl font-semibold mb-4 text-purple-700 flex items-center gap-2">
            <FaLock /> Exams
          </h2>
          {uniqueExams.length > 0 ? (
            <ul className="space-y-4">
              {uniqueExams.map((exam: any) => {
                const examPaid = exam.paymentStatus === "paid";
                return (
                  <li
                    key={exam._id}
                    className="flex flex-col md:flex-row justify-between items-start md:items-center border p-4 rounded-2xl hover:shadow-lg transition bg-gray-50"
                  >
                    <div>
                      <p className="font-bold text-gray-800 text-lg">{exam.name}</p>
                      <p className="text-gray-600">{exam.description || "No description available"}</p>
                    </div>
                    <div className="mt-2 md:mt-0 flex items-center gap-2">
                      {examPaid ? (
                        <span className="text-green-600 font-semibold flex items-center gap-1">
                          <FaCheckCircle /> Paid
                        </span>
                      ) : (
                        <span className="text-red-500 font-semibold flex items-center gap-1">
                          <FaTimesCircle /> Unpaid
                        </span>
                      )}
                      <button
                        disabled={!isEnrolled}
                        className={`px-4 py-2 rounded-lg font-semibold transition ${
                          examPaid
                            ? "bg-green-600 text-white hover:bg-green-700"
                            : "bg-yellow-400 text-white hover:bg-yellow-500"
                        } ${!isEnrolled && "opacity-50 cursor-not-allowed"}`}
                        onClick={() => handleExamClick(exam)}
                      >
                        {examPaid ? "Access" : "Pay Now"}
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="text-gray-500">No exams found for this course.</p>
          )}
        </div>
      </div>

      {/* Exam Questions Modal */}
      {isModalOpen && selectedExam && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-3xl shadow-xl max-w-3xl w-full p-6 relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 font-bold text-xl"
            >
              &times;
            </button>

            <h2 className="text-2xl font-semibold mb-4 text-purple-700">
              {selectedExam.name} - Questions
            </h2>

            {questions.length > 0 ? (
              <ul className="list-decimal list-inside space-y-3 max-h-[60vh] overflow-y-auto">
                {questions.map((q: any) => (
                  <li key={q._id} className="p-2 bg-gray-100 rounded-lg">
                    <p className="text-gray-700">{q.questionText}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No questions available.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
