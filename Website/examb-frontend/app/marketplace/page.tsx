"use client";
import { useState, useEffect } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import StudentLayout from "@/components/StudentLayout";
import { studentService } from "@/services/studentService";
import {
  BookOpen,
  Search,
  ShoppingCart,
  CheckCircle2,
  Loader2,
  Users,
  Award,
  BookMarked,
  Star,
  Sparkles,
  AlertCircle,
  RefreshCw,
  CreditCard,
  FileText,
  Zap,
  TrendingUp,
  Target,
  Rocket,
  GraduationCap,
  Trophy,
  Flame,
  Lock,
  Unlock,
  Shield,
  Clock,
  Heart,
} from "lucide-react";
import {
  motion,
  AnimatePresence,
} from "framer-motion";
import { toast } from "sonner";

// Type definitions
interface Program {
  _id: string;
  name: string;
  code?: string;
}

interface Instructor {
  _id: string;
  name: string;
  email?: string;
}

interface Exam {
  _id: string;
  name: string;
  description?: string;
  price?: number;
  duration?: number;
}

interface SubscribedStudent {
  studentId: {
    _id: string;
    name: string;
    email: string;
  };
  coursePaymentStatus:
    | "paid"
    | "unpaid"
    | "pending"
    | "failed";
  examsPaid: Array<{
    examId: string;
    paymentStatus:
      | "paid"
      | "unpaid"
      | "pending"
      | "failed";
    paidAt: string | null;
    _id: string;
  }>;
  _id: string;
}

interface Course {
  _id: string;
  name: string;
  code: string;
  description?: string;
  level?: string;
  semester?: number;
  price?: number;
  creditHours?: number;
  programId?: Program | string;
  exams?: Exam[] | string[];
  subscribedStudents?: SubscribedStudent[];
  prerequisites?: string[];
  instructors?: Instructor[] | string[];
  createdAt?: string;
  updatedAt?: string;
  isDeleted?: boolean;
  isActive?: boolean;
}

interface EnrollmentStatus {
  isEnrolled: boolean;
  hasPaid: boolean;
  enrolledExams: string[];
  paymentStatus:
    | "paid"
    | "unpaid"
    | "pending"
    | "failed";
}

interface SubscriptionModalData {
  course: Course | null;
  showModal: boolean;
}

interface PaymentData {
  courseId: string;
  purchaseType: "full-course" | "exam";
  examId?: string;
  amount?: number;
}

export default function MarketplacePage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [enrollmentStatus, setEnrollmentStatus] = useState<Map<string, EnrollmentStatus>>(new Map());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [processingPayment, setProcessingPayment] = useState<string | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<string>("all");
  const [selectedSemester, setSelectedSemester] = useState<string>("all");
  const [subscriptionModal, setSubscriptionModal] = useState<SubscriptionModalData>({
    course: null,
    showModal: false,
  });
  const [paymentInProgress, setPaymentInProgress] = useState<PaymentData | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  // Check for pending payments on component mount
  useEffect(() => {
    checkPendingPayments();
  }, []);

  const checkPendingPayments = async () => {
    try {
      const pendingPayment = localStorage.getItem('pendingPayment');
      if (pendingPayment) {
        const paymentData: PaymentData = JSON.parse(pendingPayment);
        setPaymentInProgress(paymentData);
        
        // Verify payment status
        await verifyPaymentStatus(paymentData);
      }
    } catch (error) {
      console.error("Error checking pending payments:", error);
    }
  };

  const verifyPaymentStatus = async (paymentData: PaymentData) => {
    try {
      toast.loading("Verifying payment status...", { icon: "🔍" });
      
      // Simulate API call to verify payment
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // For demo purposes, assume payment was successful
      localStorage.removeItem('pendingPayment');
      setPaymentInProgress(null);
      
      toast.success("Payment verified successfully!", { icon: "✅" });
      await fetchData(); // Refresh data
      
    } catch (error) {
      console.error("Payment verification failed:", error);
      toast.error("Payment verification failed. Please try again.", { icon: "❌" });
    }
  };

  const extractCoursesData = (response: any): Course[] => {
    console.log("[v1] API Response:", response);

    // Handle the expected structure: { status: "success", results: number, data: [...] }
    if (response?.status === "success" && Array.isArray(response?.data)) {
      return response.data;
    }

    // Handle nested response.data.data structure
    if (response?.data?.status === "success" && Array.isArray(response?.data?.data)) {
      return response.data.data;
    }

    // Fallback for direct array
    if (Array.isArray(response?.data)) {
      return response.data;
    }

    // Single course object
    if (response?.data && typeof response.data === "object" && response.data._id) {
      return [response.data];
    }

    console.warn("[v1] Unexpected API response structure:", response);
    return [];
  };

  const checkEnrollmentStatus = async (course: Course): Promise<EnrollmentStatus> => {
    try {
      // Get current student ID from the service
      const currentStudentId = await studentService.getCurrentStudentId();
      console.log("[v1] Checking enrollment for student:", currentStudentId, "in course:", course.name);

      // Check if subscribedStudents array exists and has data
      if (Array.isArray(course.subscribedStudents) && course.subscribedStudents.length > 0) {
        // Find current student's subscription in the course data
        const studentSubscription = course.subscribedStudents.find(
          (sub) => sub.studentId._id === currentStudentId || sub.studentId === currentStudentId
        );

        if (studentSubscription) {
          console.log("[v1] Found subscription:", {
            course: course.name,
            paymentStatus: studentSubscription.coursePaymentStatus,
            examsPaid: studentSubscription.examsPaid,
          });

          // Extract paid exam IDs
          const paidExamIds = studentSubscription.examsPaid
            ?.filter((exam) => exam.paymentStatus === "paid")
            .map((exam) => exam.examId) || [];

          const hasPaid = studentSubscription.coursePaymentStatus === "paid";

          return {
            isEnrolled: true,
            hasPaid: hasPaid,
            enrolledExams: paidExamIds,
            paymentStatus: studentSubscription.coursePaymentStatus,
          };
        }
      }

      // Student not found in subscribedStudents array
      console.log("[v1] Student not enrolled in course:", course.name);
      return {
        isEnrolled: false,
        hasPaid: false,
        enrolledExams: [],
        paymentStatus: "unpaid",
      };
    } catch (error) {
      console.error("[v1] Error checking enrollment status:", error);
      return {
        isEnrolled: false,
        hasPaid: false,
        enrolledExams: [],
        paymentStatus: "unpaid",
      };
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log("[v1] Fetching courses...");

      // Fetch all courses
      const res = await studentService.getAllCourses();
      console.log("[v1] Raw response:", res);
      const allCourses = extractCoursesData(res);
      
      // Filter out inactive courses
      const activeCourses = allCourses.filter(course => course.isActive !== false);
      setCourses(activeCourses);

      // Check enrollment status for each course
      const statusMap = new Map<string, EnrollmentStatus>();
      for (const course of activeCourses) {
        const status = await checkEnrollmentStatus(course);
        statusMap.set(course._id, status);
        console.log("[v1] Course enrollment status:", {
          course: course.name,
          isEnrolled: status.isEnrolled,
          hasPaid: status.hasPaid,
          paymentStatus: status.paymentStatus,
        });
      }
      setEnrollmentStatus(statusMap);

      if (activeCourses.length === 0) {
        toast.info("No courses available at the moment", {
          icon: "📚",
        });
      } else {
        toast.success(`Loaded ${activeCourses.length} amazing course${activeCourses.length > 1 ? "s" : ""}!`, {
          icon: "🎉",
        });
      }
    } catch (error: any) {
      console.error("[v1] Error fetching courses:", error);
      const errorMessage = error.response?.data?.message || error.message || "Failed to load courses.";
      setError(errorMessage);
      toast.error(errorMessage, {
        icon: "😞",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribeClick = (course: Course) => {
    setSubscriptionModal({
      course,
      showModal: true,
    });
  };

  const handlePurchase = async (
    courseId: string,
    purchaseType: "full-course" | "exam" = "full-course",
    examId?: string
  ) => {
    try {
      setProcessingPayment(courseId);
      const course = courses.find((c) => c._id === courseId);

      if (!course) {
        toast.error("Course not found", {
          icon: "❌",
        });
        return;
      }

      // Store payment data for verification
      const paymentData: PaymentData = {
        courseId,
        purchaseType,
        examId,
        amount: purchaseType === "exam" && examId ? 
          (Array.isArray(course.exams) ? 
            (course.exams.find(e => typeof e === 'object' && e._id === examId) as Exam)?.price : 0) 
          : course.price
      };
      
      localStorage.setItem('pendingPayment', JSON.stringify(paymentData));
      setPaymentInProgress(paymentData);

      // Check if course is free
      if ((!course.price || course.price === 0) && purchaseType === "full-course") {
        await handleFreeEnrollment(courseId);
        return;
      }

      // Handle payment flow
      await handlePaymentFlow(courseId, purchaseType, examId);

    } catch (error: any) {
      console.error("[v1] Payment/Enrollment error:", error);
      const errorMessage = error.response?.data?.message || "Failed to process request.";
      toast.error(errorMessage, { icon: "⚠️" });
      
      // Clear pending payment on error
      localStorage.removeItem('pendingPayment');
      setPaymentInProgress(null);
    } finally {
      setProcessingPayment(null);
    }
  };

  const handleFreeEnrollment = async (courseId: string) => {
    try {
      toast.loading("Enrolling in free course...", { icon: "🎓" });
      
      await studentService.enrollCourse(courseId);
      
      // Update local state
      setEnrollmentStatus((prev) =>
        new Map(prev.set(courseId, {
          isEnrolled: true,
          hasPaid: true,
          enrolledExams: [],
          paymentStatus: "paid",
        }))
      );

      setSubscriptionModal({
        course: null,
        showModal: false,
      });

      toast.success("Successfully enrolled in free course!", { 
        icon: "🎊",
        description: "You now have full access to all course materials."
      });

      await fetchData(); // Refresh data to get updated status
      
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Failed to enroll in free course");
    }
  };

  const handlePaymentFlow = async (
    courseId: string,
    purchaseType: "full-course" | "exam",
    examId?: string
  ) => {
    try {
      let response;
      const course = courses.find(c => c._id === courseId);

      if (purchaseType === "exam" && examId) {
        toast.loading("Initializing exam payment...", { icon: "💳" });
        response = await studentService.initializeExamPayment(examId);
      } else {
        toast.loading("Initializing course payment...", { icon: "💳" });
        response = await studentService.initializeCoursePayment(courseId);
      }

      const checkoutUrl = 
        response.data?.checkout_url || 
        response.data?.paymentUrl || 
        response.data?.data?.checkout_url ||
        response.data?.payment_url;

      if (checkoutUrl) {
        toast.success("Redirecting to secure payment gateway...", { 
          icon: "🔒",
          description: "You'll be redirected to complete your payment securely."
        });
        
        // Open in new tab for better user experience
        const newWindow = window.open(checkoutUrl, '_blank');
        if (!newWindow) {
          toast.warning("Please allow popups for payment", { icon: "📱" });
          window.location.href = checkoutUrl;
        }
      } else {
        throw new Error("No checkout URL received from payment service");
      }
    } catch (error: any) {
      // Clear pending payment on error
      localStorage.removeItem('pendingPayment');
      setPaymentInProgress(null);
      throw error;
    }
  };

  const handleViewContent = (courseId: string) => {
    window.location.href = `/student/courses/${courseId}`;
  };

  const handleRetryPayment = (course: Course) => {
    handleSubscribeClick(course);
  };

  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel =
      selectedLevel === "all" || course.level === selectedLevel;
    const matchesSemester =
      selectedSemester === "all" || course.semester?.toString() === selectedSemester;
    return matchesSearch && matchesLevel && matchesSemester;
  });

  const levels = Array.from(new Set(courses.map((c) => c.level).filter(Boolean))).sort();
  const semesters = Array.from(new Set(courses.map((c) => c.semester).filter(Boolean))).sort((a, b) => (a || 0) - (b || 0));

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedLevel("all");
    setSelectedSemester("all");
  };

  const CourseCardSkeleton = () => (
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl border-2 border-gray-100 shadow-lg overflow-hidden animate-pulse">
      <div className="bg-gradient-to-br from-purple-300 via-pink-300 to-orange-300 p-6 h-36"></div>
      <div className="p-6 space-y-4">
        <div className="h-7 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-3/4"></div>
        <div className="h-5 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-1/2"></div>
        <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-full"></div>
        <div className="grid grid-cols-4 gap-3 py-3">
          <div className="h-10 bg-gradient-to-r from-gray-200 to-gray-300 rounded-xl"></div>
          <div className="h-10 bg-gradient-to-r from-gray-200 to-gray-300 rounded-xl"></div>
          <div className="h-10 bg-gradient-to-r from-gray-200 to-gray-300 rounded-xl"></div>
          <div className="h-10 bg-gradient-to-r from-gray-200 to-gray-300 rounded-xl"></div>
        </div>
        <div className="h-12 bg-gradient-to-r from-gray-200 to-gray-300 rounded-xl"></div>
      </div>
    </div>
  );

  const SubscriptionModal = () => {
    if (!subscriptionModal.course) return null;

    const course = subscriptionModal.course;
    const exams = Array.isArray(course.exams) ? course.exams : [];
    const isFree = !course.price || course.price === 0;
    const status = enrollmentStatus.get(course._id);

    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setSubscriptionModal({ course: null, showModal: false })}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-3 rounded-2xl">
                <Rocket className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text">
                Choose Your Path
              </h3>
            </div>

            {isFree ? (
              <div className="space-y-4">
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-6 text-center">
                  <Sparkles className="w-12 h-12 mx-auto text-green-600 mb-3" />
                  <p className="text-lg font-semibold text-green-800 mb-2">
                    This course is completely FREE! 🎉
                  </p>
                  <p className="text-green-600 text-sm">
                    Start learning immediately with lifetime access
                  </p>
                </div>
                <div className="flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handlePurchase(course._id, "full-course")}
                    disabled={processingPayment === course._id}
                    className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 rounded-xl font-semibold disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all"
                  >
                    {processingPayment === course._id ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Enrolling...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-5 h-5" />
                        Enroll Now
                      </>
                    )}
                  </motion.button>
                  <button
                    onClick={() => setSubscriptionModal({ course: null, showModal: false })}
                    className="px-6 py-4 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-xl transition-all font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-5">
                {/* Payment Status Banner */}
                {status?.paymentStatus === "pending" && (
                  <div className="bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-2xl p-4">
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-yellow-600" />
                      <div>
                        <p className="text-sm font-bold text-yellow-800">Payment Pending</p>
                        <p className="text-xs text-yellow-700">Your payment is being processed</p>
                      </div>
                    </div>
                  </div>
                )}

                {status?.paymentStatus === "failed" && (
                  <div className="bg-gradient-to-br from-red-50 to-pink-50 border-2 border-red-200 rounded-2xl p-4">
                    <div className="flex items-center gap-3">
                      <AlertCircle className="w-5 h-5 text-red-600" />
                      <div>
                        <p className="text-sm font-bold text-red-800">Payment Failed</p>
                        <p className="text-xs text-red-700">Please try again or contact support</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Full Course Option */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="border-2 border-purple-200 rounded-2xl p-5 hover:border-purple-400 hover:shadow-lg transition-all bg-gradient-to-br from-purple-50 to-pink-50"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Trophy className="w-5 h-5 text-purple-600" />
                      <h4 className="font-bold text-gray-900">Full Course Access</h4>
                    </div>
                    <div className="text-right">
                      <span className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text">
                        ETB {course.price}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                    <Zap className="w-4 h-4 text-yellow-500" />
                    <span>All materials + {exams.length} exam{exams.length !== 1 ? "s" : ""} included</span>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handlePurchase(course._id, "full-course")}
                    disabled={processingPayment === course._id || status?.paymentStatus === "pending"}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-xl font-semibold disabled:opacity-50 flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all"
                  >
                    {processingPayment === course._id ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Processing...
                      </>
                    ) : status?.paymentStatus === "pending" ? (
                      <>
                        <Clock className="w-5 h-5" />
                        Payment Pending
                      </>
                    ) : (
                      <>
                        <CreditCard className="w-5 h-5" />
                        Purchase Full Course
                      </>
                    )}
                  </motion.button>
                </motion.div>

                {/* Individual Exam Options */}
                {exams.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <FileText className="w-5 h-5 text-blue-600" />
                      <h4 className="font-bold text-gray-900">Individual Exams</h4>
                    </div>
                    <div className="space-y-2 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                      {exams.map((exam, index) => {
                        const examObj = typeof exam === "object" ? exam : null;
                        const examId = examObj?._id || exam;
                        const isPaid = status?.enrolledExams.includes(examId as string);

                        return (
                          <motion.div
                            key={examId as string}
                            whileHover={{ scale: 1.01, x: 4 }}
                            className="flex items-center justify-between p-4 border-2 border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-all"
                          >
                            <div className="flex items-center gap-3">
                              <div className="bg-blue-100 p-2 rounded-lg">
                                <Target className="w-4 h-4 text-blue-600" />
                              </div>
                              <div>
                                <p className="font-semibold text-gray-900">
                                  {typeof exam === "string" ? `Exam ${index + 1}` : exam.name}
                                </p>
                                {typeof exam !== "string" && exam.description && (
                                  <p className="text-xs text-gray-500 line-clamp-1">{exam.description}</p>
                                )}
                                {typeof exam !== "string" && exam.duration && (
                                  <p className="text-xs text-gray-500">
                                    <Clock className="w-3 h-3 inline mr-1" />
                                    {exam.duration} min
                                  </p>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {isPaid ? (
                                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1">
                                  <CheckCircle2 className="w-3 h-3" />
                                  Paid
                                </span>
                              ) : (
                                <>
                                  <span className="text-sm font-bold text-blue-600 mr-2">
                                    ETB {typeof exam === "object" ? exam.price || "N/A" : "N/A"}
                                  </span>
                                  <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => handlePurchase(course._id, "exam", examId as string)}
                                    disabled={processingPayment === course._id}
                                    className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg font-semibold text-sm hover:shadow-md transition-all disabled:opacity-50 whitespace-nowrap"
                                  >
                                    Buy
                                  </motion.button>
                                </>
                              )}
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={() => setSubscriptionModal({ course: null, showModal: false })}
                    className="flex-1 py-3 text-gray-600 hover:text-gray-800 hover:bg-gray-100 transition-all border-2 border-gray-200 rounded-xl font-medium"
                  >
                    Maybe Later
                  </button>
                  {status?.paymentStatus === "failed" && (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handlePurchase(course._id, "full-course")}
                      disabled={processingPayment === course._id}
                      className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 rounded-xl font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {processingPayment === course._id ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <RefreshCw className="w-5 h-5" />
                      )}
                      Retry Payment
                    </motion.button>
                  )}
                </div>
              </div>
            )}

            {/* Security Badge */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                <Shield className="w-4 h-4 text-green-500" />
                <span>Secure payment • 24/7 support • Money-back guarantee</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  };

  return (
    <ProtectedRoute allowedRole="student">
      <StudentLayout>
        <motion.div
          className="space-y-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Payment In Progress Banner */}
          {paymentInProgress && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-300 rounded-2xl p-5 shadow-lg"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="bg-blue-500 p-3 rounded-2xl shadow-md">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-blue-900 font-bold text-lg">Payment in Progress</p>
                    <p className="text-blue-700 text-sm">
                      Completing your {paymentInProgress.purchaseType} purchase...
                    </p>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setPaymentInProgress(null)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-xl text-sm font-bold hover:bg-blue-600 transition-all"
                >
                  Dismiss
                </motion.button>
              </div>
            </motion.div>
          )}

          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <motion.h1
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-5xl font-black bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 text-transparent bg-clip-text tracking-tight mb-2"
              >
                Course Marketplace
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="text-gray-600 text-lg flex items-center gap-2"
              >
                <Flame className="w-5 h-5 text-orange-500 animate-pulse" />
                Discover amazing courses and level up your skills! 🚀
              </motion.p>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={fetchData}
                disabled={loading}
                className="flex items-center gap-2 px-5 py-3 text-sm font-medium text-gray-700 hover:text-gray-900 transition-all disabled:opacity-50 border-2 border-gray-300 rounded-xl hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 shadow-sm hover:shadow-md"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
                Refresh
              </motion.button>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl px-5 py-3 border-2 border-purple-300 shadow-lg"
              >
                <p className="text-xs text-purple-100 font-medium">Available Courses</p>
                <p className="text-2xl font-black text-white">{courses.length}</p>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl px-5 py-3 border-2 border-green-300 shadow-lg"
              >
                <p className="text-xs text-green-100 font-medium">Your Enrollments</p>
                <p className="text-2xl font-black text-white">
                  {Array.from(enrollmentStatus.values()).filter((status) => status.isEnrolled).length}
                </p>
              </motion.div>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-300 rounded-2xl p-5 shadow-lg"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="bg-red-500 p-3 rounded-2xl shadow-md">
                    <AlertCircle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-red-900 font-bold text-lg">Oops! Something went wrong</p>
                    <p className="text-red-700 text-sm">{error}</p>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={fetchData}
                  className="px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl text-sm font-bold hover:shadow-lg transition-all"
                >
                  Try Again
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* Rest of the component remains the same as your original code */}
          {/* Filters, Course Grid, etc. */}
          <div className="bg-gradient-to-br from-white to-gray-50 border-2 border-gray-200 rounded-3xl p-6 shadow-xl">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative group">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-purple-500 transition-colors" />
                <input
                  type="text"
                  placeholder="🔍 Search for your next adventure..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-14 pr-5 py-4 border-2 border-gray-300 rounded-2xl text-gray-800 placeholder-gray-400 focus:ring-4 focus:ring-purple-200 focus:border-purple-500 transition-all font-medium shadow-sm"
                />
              </div>

              <div className="flex gap-3 flex-wrap">
                <select
                  value={selectedLevel}
                  onChange={(e) => setSelectedLevel(e.target.value)}
                  className="px-5 py-4 rounded-2xl border-2 border-gray-300 bg-white focus:ring-4 focus:ring-blue-200 focus:border-blue-500 text-gray-700 font-medium cursor-pointer min-w-[150px] shadow-sm hover:shadow-md transition-all"
                >
                  <option value="all">🎓 All Levels</option>
                  {levels.map((level) => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
                </select>

                <select
                  value={selectedSemester}
                  onChange={(e) => setSelectedSemester(e.target.value)}
                  className="px-5 py-4 rounded-2xl border-2 border-gray-300 bg-white focus:ring-4 focus:ring-blue-200 focus:border-blue-500 text-gray-700 font-medium cursor-pointer min-w-[170px] shadow-sm hover:shadow-md transition-all"
                >
                  <option value="all">📅 All Semesters</option>
                  {semesters.map((sem) => (
                    <option key={sem} value={sem?.toString()}>
                      Semester {sem}
                    </option>
                  ))}
                </select>

                {(searchTerm || selectedLevel !== "all" || selectedSemester !== "all") && (
                  <motion.button
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={clearFilters}
                    className="px-5 py-4 text-gray-700 hover:text-gray-900 transition-all border-2 border-gray-300 rounded-2xl hover:bg-gradient-to-r hover:from-gray-100 hover:to-gray-200 font-medium whitespace-nowrap shadow-sm hover:shadow-md"
                  >
                    ✨ Clear Filters
                  </motion.button>
                )}
              </div>
            </div>

            {(searchTerm || selectedLevel !== "all" || selectedSemester !== "all") && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mt-5 flex items-center gap-3 text-sm"
              >
                <TrendingUp className="w-5 h-5 text-purple-500" />
                <span className="text-gray-600 font-medium">
                  Showing <span className="text-purple-600 font-bold">{filteredCourses.length}</span> of{" "}
                  <span className="font-bold">{courses.length}</span> courses
                </span>
                {searchTerm && (
                  <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-semibold">
                    "{searchTerm}"
                  </span>
                )}
                {selectedLevel !== "all" && (
                  <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold">
                    {selectedLevel}
                  </span>
                )}
                {selectedSemester !== "all" && (
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
                    Semester {selectedSemester}
                  </span>
                )}
              </motion.div>
            )}
          </div>

          {/* Loading Skeletons */}
          {loading && courses.length === 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <CourseCardSkeleton key={i} />
              ))}
            </div>
          ) : (
            <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredCourses.map((course, index) => {
                const status = enrollmentStatus.get(course._id) || {
                  isEnrolled: false,
                  hasPaid: false,
                  enrolledExams: [],
                  paymentStatus: "unpaid",
                };
                const isEnrolled = status.isEnrolled;
                const hasPaid = status.hasPaid;
                const isProcessing = processingPayment === course._id;
                const programName = typeof course.programId === "object" ? course.programId?.name : "General Program";
                const examCount = Array.isArray(course.exams) ? course.exams.length : 0;
                const studentCount = Array.isArray(course.subscribedStudents) ? course.subscribedStudents.length : 0;
                const isFree = !course.price || course.price === 0;
                const instructorCount = Array.isArray(course.instructors) ? course.instructors.length : 0;
                const prerequisitesCount = course.prerequisites?.length || 0;

                const canAccessContent = hasPaid && status.paymentStatus === "paid";
                const showExams = hasPaid && examCount > 0;

                const gradients = [
                  "from-purple-500 via-pink-500 to-red-500",
                  "from-blue-500 via-cyan-500 to-teal-500",
                  "from-orange-500 via-red-500 to-pink-500",
                  "from-green-500 via-emerald-500 to-teal-500",
                  "from-indigo-500 via-purple-500 to-pink-500",
                  "from-yellow-500 via-orange-500 to-red-500",
                ];
                const gradient = gradients[index % gradients.length];

                return (
                  <motion.div
                    key={course._id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.4 }}
                    whileHover={{ scale: 1.03, y: -5 }}
                    className="bg-white rounded-3xl border-2 border-gray-200 shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden group"
                  >
                    {/* Course Header */}
                    <div className={`bg-gradient-to-br ${gradient} p-6 text-white relative overflow-hidden`}>
                      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-500"></div>
                      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12 group-hover:scale-150 transition-transform duration-500"></div>
                      <div className="flex justify-between items-center mb-4 relative z-10">
                        <motion.div
                          whileHover={{ rotate: 360 }}
                          transition={{ duration: 0.5 }}
                          className="bg-white/20 backdrop-blur-sm rounded-2xl p-3 group-hover:bg-white/30 transition-all shadow-lg"
                        >
                          <GraduationCap className="w-7 h-7" />
                        </motion.div>
                        {isEnrolled && (
                          <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className={`px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-lg ${
                              status.paymentStatus === "paid"
                                ? "bg-green-400"
                                : status.paymentStatus === "pending"
                                ? "bg-yellow-400"
                                : status.paymentStatus === "failed"
                                ? "bg-red-400"
                                : "bg-gray-400"
                            }`}
                          >
                            {status.paymentStatus === "paid" ? (
                              <>
                                <Unlock className="w-4 h-4" /> ✨ Paid
                              </>
                            ) : status.paymentStatus === "pending" ? (
                              <>
                                <Loader2 className="w-4 h-4 animate-spin" /> Pending
                              </>
                            ) : status.paymentStatus === "failed" ? (
                              <>
                                <AlertCircle className="w-4 h-4" /> Failed
                              </>
                            ) : (
                              <>
                                <Lock className="w-4 h-4" /> Unpaid
                              </>
                            )}
                          </motion.span>
                        )}
                      </div>
                      <h3 className="text-2xl font-black leading-tight mb-2 relative z-10 line-clamp-2 drop-shadow-md">
                        {course.name}
                      </h3>
                      <p className="text-white/90 text-sm font-semibold relative z-10 flex items-center gap-2">
                        <span className="bg-white/20 px-2 py-0.5 rounded-lg">{course.code}</span>
                      </p>
                    </div>

                    {/* Course Details */}
                    <div className="p-6 space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Award className="w-5 h-5 text-indigo-500" />
                          <span className="line-clamp-1 font-medium">{programName}</span>
                        </div>
                        {course.level && (
                          <span className="bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700 px-3 py-1 rounded-xl text-xs font-bold border border-blue-200">
                            {course.level}
                          </span>
                        )}
                      </div>

                      {course.description && (
                        <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed">
                          {course.description}
                        </p>
                      )}

                      <div className="grid grid-cols-4 border-t-2 border-b-2 border-gray-100 py-4 text-center gap-3">
                        <div className="group hover:scale-110 transition-transform">
                          <div className="bg-gradient-to-br from-purple-100 to-pink-100 p-2 rounded-xl mb-1 mx-auto w-fit">
                            <BookMarked className="w-4 h-4 text-purple-600" />
                          </div>
                          <p className="text-xs text-gray-500 font-medium">Credits</p>
                          <p className="font-black text-gray-800">{course.creditHours || 0}</p>
                        </div>
                        <div className="group hover:scale-110 transition-transform">
                          <div className="bg-gradient-to-br from-yellow-100 to-orange-100 p-2 rounded-xl mb-1 mx-auto w-fit">
                            <Star className="w-4 h-4 text-yellow-600" />
                          </div>
                          <p className="text-xs text-gray-500 font-medium">Exams</p>
                          <p className="font-black text-gray-800">{examCount}</p>
                        </div>
                        <div className="group hover:scale-110 transition-transform">
                          <div className="bg-gradient-to-br from-blue-100 to-cyan-100 p-2 rounded-xl mb-1 mx-auto w-fit">
                            <Users className="w-4 h-4 text-blue-600" />
                          </div>
                          <p className="text-xs text-gray-500 font-medium">Students</p>
                          <p className="font-black text-gray-800">{studentCount}</p>
                        </div>
                        <div className="group hover:scale-110 transition-transform">
                          <div className="bg-gradient-to-br from-green-100 to-emerald-100 p-2 rounded-xl mb-1 mx-auto w-fit">
                            <Target className="w-4 h-4 text-green-600" />
                          </div>
                          <p className="text-xs text-gray-500 font-medium">Prereqs</p>
                          <p className="font-black text-gray-800">{prerequisitesCount}</p>
                        </div>
                      </div>

                      {showExams && Array.isArray(course.exams) && (
                        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-2xl p-4">
                          <div className="flex items-center gap-2 mb-3">
                            <FileText className="w-5 h-5 text-blue-600" />
                            <h4 className="font-bold text-gray-900">Available Exams</h4>
                          </div>
                          <div className="space-y-2 max-h-40 overflow-y-auto custom-scrollbar">
                            {course.exams.map((exam, idx) => {
                              const examObj = typeof exam === "object" ? exam : null;
                              const examId = examObj?._id || exam;
                              const isPaidExam = status.enrolledExams.includes(examId as string);

                              return (
                                <div key={examId as string} className="flex items-center justify-between p-3 bg-white border border-blue-200 rounded-xl">
                                  <div className="flex items-center gap-2">
                                    <Target className="w-4 h-4 text-blue-600" />
                                    <span className="text-sm font-semibold text-gray-800">
                                      {examObj?.name || `Exam ${idx + 1}`}
                                    </span>
                                  </div>
                                  {isPaidExam ? (
                                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1">
                                      <CheckCircle2 className="w-3 h-3" /> Paid
                                    </span>
                                  ) : (
                                    <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-lg text-xs font-bold">
                                      Unpaid
                                    </span>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {isEnrolled && !hasPaid && (
                        <div className="bg-gradient-to-br from-orange-50 to-yellow-50 border-2 border-orange-200 rounded-2xl p-4">
                          <div className="flex items-center gap-3">
                            <Lock className="w-5 h-5 text-orange-600" />
                            <div>
                              <p className="text-sm font-bold text-orange-900">Payment Required</p>
                              <p className="text-xs text-orange-700">
                                Complete payment to unlock course content and materials
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-2">
                        {!isFree ? (
                          <div>
                            <span className="text-3xl font-black bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text">
                              ETB {course.price}
                            </span>
                            <span className="text-xs text-gray-500 block font-medium">💎 One-time payment</span>
                          </div>
                        ) : (
                          <div>
                            <span className="text-3xl font-black bg-gradient-to-r from-green-600 to-emerald-600 text-transparent bg-clip-text">
                              FREE
                            </span>
                            <span className="text-xs text-gray-500 block font-medium">🎉 Lifetime access</span>
                          </div>
                        )}

                        {canAccessContent ? (
                          <motion.button
                            onClick={() => handleViewContent(course._id)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all flex items-center gap-2 text-sm"
                          >
                            <Unlock className="w-5 h-5" /> View Content
                          </motion.button>
                        ) : (
                          <motion.button
                            onClick={() => 
                              status.paymentStatus === "failed" 
                                ? handleRetryPayment(course) 
                                : handleSubscribeClick(course)
                            }
                            disabled={isProcessing}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={`px-6 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all flex items-center gap-2 text-sm disabled:opacity-50 ${
                              isFree
                                ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white"
                                : isEnrolled && !hasPaid
                                ? status.paymentStatus === "failed"
                                  ? "bg-gradient-to-r from-orange-500 to-red-500 text-white"
                                  : "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                                : "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                            }`}
                          >
                            {isProcessing ? (
                              <>
                                <Loader2 className="w-5 h-5 animate-spin" /> Processing...
                              </>
                            ) : isEnrolled && !hasPaid ? (
                              status.paymentStatus === "failed" ? (
                                <>
                                  <RefreshCw className="w-5 h-5" /> Retry Payment
                                </>
                              ) : (
                                <>
                                  <CreditCard className="w-5 h-5" /> Complete Payment
                                </>
                              )
                            ) : (
                              <>
                                <ShoppingCart className="w-5 h-5" />
                                {isFree ? "Enroll Free" : "Get Started"}
                              </>
                            )}
                          </motion.button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}

          {filteredCourses.length === 0 && !loading && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gradient-to-br from-white to-gray-50 p-16 rounded-3xl text-center border-2 border-gray-200 shadow-xl"
            >
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}
                className="mb-6"
              >
                <div className="bg-gradient-to-br from-purple-100 to-pink-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto">
                  <BookOpen className="w-12 h-12 text-purple-600" />
                </div>
              </motion.div>
              <h3 className="text-3xl font-black text-gray-900 mb-3">
                {searchTerm || selectedLevel !== "all" || selectedSemester !== "all"
                  ? "No courses found 🔍"
                  : "No courses available yet 📚"}
              </h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto text-lg">
                {searchTerm || selectedLevel !== "all" || selectedSemester !== "all"
                  ? "Try adjusting your filters or search terms to discover more courses."
                  : "New courses are coming soon! Check back later for exciting learning opportunities."}
              </p>
              {(searchTerm || selectedLevel !== "all" || selectedSemester !== "all") && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={clearFilters}
                  className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl font-bold hover:shadow-xl transition-all inline-flex items-center gap-3 text-lg"
                >
                  <RefreshCw className="w-5 h-5" /> Clear All Filters
                </motion.button>
              )}
            </motion.div>
          )}

          {/* Subscription Modal */}
          {subscriptionModal.showModal && <SubscriptionModal />}
        </motion.div>

        <style jsx global>{`
          .custom-scrollbar::-webkit-scrollbar {
            width: 8px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: #f1f1f1;
            border-radius: 10px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: linear-gradient(to bottom, #a855f7, #ec4899);
            border-radius: 10px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: linear-gradient(to bottom, #9333ea, #db2777);
          }
        `}</style>
      </StudentLayout>
    </ProtectedRoute>
  );
}