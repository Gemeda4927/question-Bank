interface Program {
  _id: string
  name: string
  code?: string
}

interface Instructor {
  _id: string
  name: string
  email?: string
}

interface Exam {
  _id: string
  name: string
  description?: string
  price?: number
}

interface SubscribedStudent {
  studentId: {
    _id: string
    name: string
    email: string
  }
  coursePaymentStatus: "paid" | "unpaid" | "pending" | "failed"
  examsPaid: Array<{
    examId: string
    paymentStatus: "paid" | "unpaid" | "pending" | "failed"
    paidAt: string | null
    _id: string
  }>
  _id: string
}

interface Course {
  _id: string
  name: string
  code: string
  description?: string
  level?: string
  semester?: number
  price?: number
  creditHours?: number
  programId?: Program | string
  exams?: Exam[] | string[]
  subscribedStudents?: SubscribedStudent[]
  prerequisites?: string[]
  instructors?: Instructor[] | string[]
  createdAt?: string
  updatedAt?: string
  isDeleted?: boolean
}

interface EnrollmentStatus {
  isEnrolled: boolean
  hasPaid: boolean
  enrolledExams: string[]
  paymentStatus: "paid" | "unpaid" | "pending" | "failed"
}

interface SubscriptionModalData {
  course: Course | null
  showModal: boolean
}

interface Question {
  _id: string
  text: string
  type: "multiple-choice" | "true-false" | "short-answer" | "essay"
  options?: string[]
  marks: number
  correctAnswer?: string
}

interface ExamDetail {
  _id: string
  name: string
  code: string
  courseId: {
    _id: string
    name: string
    code: string
  }
  type: "quiz" | "midterm" | "final"
  description?: string
  date: string
  duration: number
  totalMarks: number
  passingMarks: number
  questions: Question[]
  subscribedStudents: any[]
  isDeleted: boolean
  createdAt: string
  updatedAt: string
}
