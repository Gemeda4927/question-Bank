"use client"
import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import ProtectedRoute from "@/components/ProtectedRoute"
import StudentLayout from "@/components/StudentLayout"
import { studentService } from "@/services/studentService"
import {
  ChevronLeft,
  Loader2,
  CheckCircle2,
  XCircle,
  Send,
  Trophy,
  AlertTriangle,
  BarChart3,
  Edit3,
  Eye,
  Sparkles,
  Award,
  TrendingUp,
  Target,
  Star,
  Clock,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"
import confetti from "canvas-confetti"

interface Question {
  _id: string
  text: string
  type: string
  options?: string[]
  correctAnswer: string | string[] | Record<string, string>
  explanation?: string
  marks: number
  imageUrl?: string
  partialScoring?: boolean
  maxPoints?: number
}

interface ExamResult {
  totalScore: number
  maxPossibleScore: number
  percentage: number
  correctAnswers: number
  totalQuestions: number
  timeSpent: number
  answers: {
    questionId: string
    userAnswer: any
    correctAnswer: any
    isCorrect: boolean
    pointsEarned: number
    maxPoints: number
  }[]
}

export default function ExamReviewPage() {
  const params = useParams()
  const router = useRouter()
  const examId = params.id as string

  const [exam, setExam] = useState<any>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [answers, setAnswers] = useState<Record<string, any>>({})
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [showSubmitModal, setShowSubmitModal] = useState(false)
  const [showWarningModal, setShowWarningModal] = useState(false)
  const [examResult, setExamResult] = useState<ExamResult | null>(null)
  const [startTime] = useState<number>(Date.now())

  useEffect(() => {
    fetchExamData()
  }, [examId])

  const fetchExamData = async () => {
    try {
      setLoading(true)
      const res = await studentService.getExamById(examId)
      const data = res.data?.data || res.data
      setExam(data)
      setQuestions(data.questions || [])

      const savedAnswers = sessionStorage.getItem(`exam_${examId}_answers`)
      if (savedAnswers) {
        try {
          const parsed = JSON.parse(savedAnswers)
          setAnswers(parsed)
        } catch (e) {
          console.error("Failed to parse saved answers:", e)
          setAnswers({})
          toast.error("Failed to load saved answers")
        }
      }
    } catch (err) {
      console.error(err)
      toast.error("Failed to load exam data")
    } finally {
      setLoading(false)
    }
  }

  const calculatePoints = (question: Question, userAnswer: any): number => {
    const maxPoints = question.maxPoints || question.marks
    if (!userAnswer) return 0

    switch (question.type) {
      case "multiple-choice":
      case "multiple_choice":
      case "true-false":
      case "true_false":
        return userAnswer === question.correctAnswer ? maxPoints : 0

      case "multiple-select":
      case "multiple_select":
        if (Array.isArray(question.correctAnswer) && Array.isArray(userAnswer)) {
          const correctAnswers = question.correctAnswer
          const userAnswers = userAnswer

          if (question.partialScoring) {
            const correctSelections = userAnswers.filter((ans: string) => correctAnswers.includes(ans)).length
            const incorrectSelections = userAnswers.filter((ans: string) => !correctAnswers.includes(ans)).length
            const correctScore = (correctSelections / correctAnswers.length) * maxPoints
            const penalty = (incorrectSelections / correctAnswers.length) * (maxPoints * 0.25)
            return Math.max(0, correctScore - penalty)
          } else {
            const sortedCorrect = [...correctAnswers].sort()
            const sortedUser = [...userAnswers].sort()
            return JSON.stringify(sortedCorrect) === JSON.stringify(sortedUser) ? maxPoints : 0
          }
        }
        return 0

      case "short-answer":
      case "short_answer":
        const userAnswerStr = String(userAnswer).toLowerCase().trim()
        const correctAnswerStr = String(question.correctAnswer).toLowerCase().trim()
        if (userAnswerStr === correctAnswerStr) {
          return maxPoints
        } else if (userAnswerStr.includes(correctAnswerStr) || correctAnswerStr.includes(userAnswerStr)) {
          return maxPoints * 0.7
        }
        return 0

      case "essay":
        const essayAnswer = String(userAnswer)
        const keywords = Array.isArray(question.correctAnswer)
          ? question.correctAnswer
          : [String(question.correctAnswer)]
        let essayScore = 0
        const wordCount = essayAnswer.split(/\s+/).length

        if (wordCount >= 50) essayScore += maxPoints * 0.3
        else if (wordCount >= 25) essayScore += maxPoints * 0.15

        const foundKeywords = keywords.filter((keyword) =>
          essayAnswer.toLowerCase().includes(keyword.toLowerCase())
        ).length

        if (keywords.length > 0) {
          essayScore += (foundKeywords / keywords.length) * maxPoints * 0.7
        }
        return Math.min(maxPoints, essayScore)

      case "matching":
        if (typeof userAnswer === "object" && userAnswer !== null) {
          let correctMatches = 0
          const correctAnswers = question.correctAnswer as Record<string, string>
          const totalPairs = Object.keys(correctAnswers).length

          Object.keys(userAnswer).forEach((key) => {
            if (correctAnswers[key] === userAnswer[key]) {
              correctMatches++
            }
          })

          return (correctMatches / totalPairs) * maxPoints
        }
        return 0

      default:
        return userAnswer === question.correctAnswer ? maxPoints : 0
    }
  }

  const calculateExamResult = (): ExamResult => {
    const timeSpent = Math.floor((Date.now() - startTime) / 1000)
    let totalScore = 0
    let maxPossibleScore = 0
    let correctAnswers = 0

    const answerDetails = questions.map((question) => {
      const userAnswer = answers[question._id]
      const maxPoints = question.maxPoints || question.marks
      const pointsEarned = calculatePoints(question, userAnswer)

      totalScore += pointsEarned
      maxPossibleScore += maxPoints

      const isCorrect = pointsEarned > 0
      if (isCorrect) correctAnswers++

      return {
        questionId: question._id,
        userAnswer,
        correctAnswer: question.correctAnswer,
        isCorrect,
        pointsEarned,
        maxPoints,
      }
    })

    const percentage = maxPossibleScore > 0 ? (totalScore / maxPossibleScore) * 100 : 0

    return {
      totalScore,
      maxPossibleScore,
      percentage,
      correctAnswers,
      totalQuestions: questions.length,
      timeSpent,
      answers: answerDetails,
    }
  }

  const handleSubmit = async () => {
    if (submitting) return

    const unansweredCount = questions.filter((q) => !isQuestionAnswered(q._id)).length
    if (unansweredCount > 0) {
      setShowWarningModal(true)
      return
    }

    if (!confirm("Are you sure you want to submit your exam? This action cannot be undone.")) return

    setSubmitting(true)
    try {
      const result = calculateExamResult()
      setExamResult(result)

      const formatted = Object.entries(answers).map(([id, ans]) => ({
        questionId: id,
        answer: ans,
      }))

      await studentService.submitExam(examId, {
        answers: formatted,
        score: result.totalScore,
        maxScore: result.maxPossibleScore,
        percentage: result.percentage,
        timeSpent: result.timeSpent,
      })

      sessionStorage.removeItem(`exam_${examId}_answers`)
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      })
      toast.success("Exam submitted successfully!")
      setShowSubmitModal(true)
    } catch (err: any) {
      console.error(err)
      toast.error("Failed to submit exam")
    } finally {
      setSubmitting(false)
    }
  }

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`

  const isQuestionAnswered = (questionId: string): boolean => {
    const answer = answers[questionId]
    if (answer === undefined || answer === null) return false

    if (typeof answer === "string") return answer.trim().length > 0
    if (Array.isArray(answer)) return answer.length > 0 && answer.some((item) => String(item).trim() !== "")
    if (typeof answer === "object") {
      const entries = Object.entries(answer)
      return entries.length > 0 && entries.some(([_, value]) => String(value).trim() !== "")
    }
    return typeof answer === "boolean" || typeof answer === "number"
  }

  const formatAnswerDisplay = (question: Question, answer: any): string => {
    if (!answer) return "Not answered"
    if (question.type === "multiple-select" || question.type === "multiple_select") {
      return Array.isArray(answer) ? answer.join(", ") : String(answer)
    }
    if (question.type === "matching" && typeof answer === "object") {
      return Object.entries(answer)
        .map(([key, value]) => `${key}: ${value}`)
        .join(", ")
    }
    return String(answer)
  }

  const answeredCount = questions.filter((q) => isQuestionAnswered(q._id)).length
  const unansweredCount = questions.length - answeredCount
  const completionPercentage = questions.length > 0 ? (answeredCount / questions.length) * 100 : 0

  if (loading) {
    return (
      <ProtectedRoute allowedRole="student">
        <StudentLayout>
          <div className="flex items-center justify-center h-96">
            <Loader2 className="w-12 h-12 text-purple-500 animate-spin" />
          </div>
        </StudentLayout>
      </ProtectedRoute>
    )
  }

  if (!exam || questions.length === 0) {
    return (
      <ProtectedRoute allowedRole="student">
        <StudentLayout>
          <div className="text-center py-24">
            <XCircle className="w-14 h-14 mx-auto text-red-500 mb-3" />
            <h2 className="text-2xl font-bold">No Exam Found</h2>
            <button
              onClick={() => router.push("/dashboard/student/exams")}
              className="mt-6 px-5 py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700"
              aria-label="Back to exams"
            >
              Back to Exams
            </button>
          </div>
        </StudentLayout>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute allowedRole="student">
      <StudentLayout>
        <div className="max-w-6xl mx-auto space-y-6 pb-32">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-purple-600 via-fuchsia-500 to-pink-600 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-48 translate-x-48"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl translate-y-32 -translate-x-32"></div>

            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-6">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                  className="bg-white/20 backdrop-blur-sm rounded-2xl p-4"
                >
                  <Eye className="w-8 h-8" />
                </motion.div>
                <div>
                  <h1 className="text-4xl font-black mb-1">Review Your Answers</h1>
                  <p className="text-purple-100 text-lg">Check everything before final submission</p>
                </div>
              </div>

              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 mt-6">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <Sparkles className="w-6 h-6" />
                  {exam?.name}
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.1 }}
                    className="text-center bg-white/10 rounded-xl p-4"
                  >
                    <div className="text-4xl font-black mb-1">{questions.length}</div>
                    <div className="text-sm text-purple-100 font-medium">Total Questions</div>
                  </motion.div>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-center bg-green-500/30 rounded-xl p-4"
                  >
                    <div className="text-4xl font-black text-green-100 mb-1">{answeredCount}</div>
                    <div className="text-sm text-green-100 font-medium">Answered</div>
                  </motion.div>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-center bg-orange-500/30 rounded-xl p-4"
                  >
                    <div className="text-4xl font-black text-orange-100 mb-1">{unansweredCount}</div>
                    <div className="text-sm text-orange-100 font-medium">Unanswered</div>
                  </motion.div>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-center bg-blue-500/30 rounded-xl p-4"
                  >
                    <div className="text-4xl font-black text-blue-100 mb-1">{completionPercentage.toFixed(0)}%</div>
                    <div className="text-sm text-blue-100 font-medium">Complete</div>
                  </motion.div>
                </div>

                <div className="mt-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-purple-100">Progress</span>
                    <span className="text-sm font-bold text-white">{completionPercentage.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-4 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${completionPercentage}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className="bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 h-4 rounded-full shadow-lg"
                    />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {unansweredCount > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gradient-to-r from-orange-50 via-red-50 to-pink-50 border-2 border-orange-400 rounded-2xl p-6 shadow-xl"
            >
              <div className="flex items-center gap-4">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                  className="bg-gradient-to-br from-orange-500 to-red-500 p-4 rounded-2xl shadow-lg"
                >
                  <AlertTriangle className="w-7 h-7 text-white" />
                </motion.div>
                <div className="flex-1">
                  <h3 className="text-2xl font-black text-orange-900 mb-1">Incomplete Exam</h3>
                  <p className="text-orange-800 text-lg">
                    You have <span className="font-black text-red-600">{unansweredCount}</span> unanswered question
                    {unansweredCount !== 1 ? "s" : ""}. Please review and answer all questions before submitting.
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {unansweredCount === 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gradient-to-r from-green-50 via-emerald-50 to-teal-50 border-2 border-green-400 rounded-2xl p-6 shadow-xl"
            >
              <div className="flex items-center gap-4">
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                  className="bg-gradient-to-br from-green-500 to-emerald-500 p-4 rounded-2xl shadow-lg"
                >
                  <CheckCircle2 className="w-7 h-7 text-white" />
                </motion.div>
                <div className="flex-1">
                  <h3 className="text-2xl font-black text-green-900 mb-1">All Questions Answered!</h3>
                  <p className="text-green-800 text-lg">
                    Great job! You've answered all questions. Review your answers and submit when ready.
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {questions.map((question, index) => {
              const hasAnswer = isQuestionAnswered(question._id)
              const userAnswer = answers[question._id]

              return (
                <motion.div
                  key={question._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                  whileHover={{ scale: 1.02, y: -4 }}
                  className={`bg-white rounded-2xl p-6 border-2 shadow-lg hover:shadow-2xl transition-all ${
                    hasAnswer
                      ? "border-green-400 bg-gradient-to-br from-green-50 to-emerald-50"
                      : "border-orange-400 bg-gradient-to-br from-orange-50 to-red-50"
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <motion.div
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.5 }}
                        className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-white shadow-lg ${
                          hasAnswer
                            ? "bg-gradient-to-br from-green-500 to-emerald-600"
                            : "bg-gradient-to-br from-orange-500 to-red-500"
                        }`}
                      >
                        {index + 1}
                      </motion.div>
                      <div>
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                          Question {index + 1}
                        </span>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full font-bold">
                            {question.type}
                          </span>
                          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-bold flex items-center gap-1">
                            <Star className="w-3 h-3 fill-current" />
                            {question.maxPoints || question.marks} pts
                          </span>
                        </div>
                      </div>
                    </div>
                    {hasAnswer ? (
                      <CheckCircle2 className="w-7 h-7 text-green-600" />
                    ) : (
                      <XCircle className="w-7 h-7 text-orange-600" />
                    )}
                  </div>

                  <h3 className="font-bold text-gray-900 mb-4 line-clamp-2 text-lg">{question.text}</h3>

                  {hasAnswer ? (
                    <div className="bg-white rounded-xl p-4 border-2 border-green-300 shadow-sm">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                        <span className="text-sm font-bold text-green-900">Your Answer:</span>
                      </div>
                      <p className="text-gray-800 font-medium">{formatAnswerDisplay(question, userAnswer)}</p>
                    </div>
                  ) : (
                    <div className="bg-white rounded-xl p-4 border-2 border-orange-300 shadow-sm">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle className="w-5 h-5 text-orange-600" />
                        <span className="text-sm font-bold text-orange-900">Not Answered</span>
                      </div>
                      <p className="text-gray-600 text-sm">This question needs your response</p>
                    </div>
                  )}

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => router.push(`/dashboard/student/exams/${examId}?question=${index}`)}
                    className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-bold hover:from-purple-700 hover:to-blue-700 transition-all shadow-md hover:shadow-lg"
                    aria-label={hasAnswer ? "Edit answer" : "Answer question"}
                  >
                    <Edit3 className="w-4 h-4" />
                    {hasAnswer ? "Edit Answer" : "Answer Question"}
                  </motion.button>
                </motion.div>
              )
            })}
          </div>

          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t-2 border-purple-200 shadow-2xl"
          >
            <div className="max-w-6xl mx-auto px-6 py-4">
              <div className="flex gap-4 justify-between items-center">
                <button
                  onClick={() => router.push(`/dashboard/student/exams/${examId}`)}
                  className="flex items-center gap-2 px-6 py-3 border-2 border-gray-300 rounded-xl hover:bg-gray-50 font-semibold transition-all"
                  aria-label="Back to exam"
                >
                  <ChevronLeft className="w-5 h-5" /> Back to Exam
                </button>

                <div className="flex gap-3">
                  <button
                    onClick={() => router.push("/dashboard/student/exams")}
                    className="px-6 py-3 text-gray-700 hover:bg-gray-100 rounded-xl font-semibold transition-all"
                    aria-label="Cancel"
                  >
                    Cancel
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    aria-label="Submit exam"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" /> Submitting...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" /> Submit Exam
                      </>
                    )}
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>

          <AnimatePresence>
            {showWarningModal && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
              >
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  className="bg-white rounded-2xl p-8 text-center max-w-md w-full border-2 border-orange-400"
                >
                  <AlertTriangle className="w-12 h-12 text-orange-600 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-orange-900 mb-4">Unanswered Questions</h2>
                  <p className="text-gray-700 mb-6">
                    You have {unansweredCount} unanswered question{unansweredCount !== 1 ? "s" : ""}. Please answer all
                    questions before submitting.
                  </p>
                  <div className="flex gap-4 justify-center">
                    <button
                      onClick={() => setShowWarningModal(false)}
                      className="px-6 py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700"
                      aria-label="Continue reviewing"
                    >
                      Continue Reviewing
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {showSubmitModal && examResult && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4"
              >
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", damping: 20 }}
                  className="bg-gradient-to-br from-white via-purple-50 to-blue-50 rounded-3xl p-10 text-center shadow-2xl max-w-3xl w-full border-2 border-purple-200"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring" }}
                    className="flex items-center justify-center gap-4 mb-6"
                  >
                    <Trophy className="text-yellow-500 w-16 h-16" />
                    <Award className="text-purple-500 w-16 h-16" />
                    <Target className="text-green-500 w-16 h-16" />
                  </motion.div>

                  <motion.h2
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-4xl font-black mb-2 bg-gradient-to-r from-purple-600 via-fuchsia-600 to-blue-600 bg-clip-text text-transparent"
                  >
                    Exam Completed!
                  </motion.h2>

                  <motion.p
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-gray-600 mb-8 text-lg"
                  >
                    {examResult.percentage >= 80
                      ? "Outstanding performance! You've mastered this material. 🎉"
                      : examResult.percentage >= 60
                        ? "Good work! You have a solid understanding. 👏"
                        : "Keep practicing! Review the material and try again. 💪"}
                  </motion.p>

                  <div className="grid grid-cols-2 gap-4 mb-8">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.5 }}
                      className="bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl p-6 border-2 border-green-300 shadow-lg"
                    >
                      <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-2" />
                      <div className="text-3xl font-black text-green-600">{examResult.totalScore.toFixed(1)}</div>
                      <div className="text-sm text-green-700 font-semibold">Points Earned</div>
                    </motion.div>
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.6 }}
                      className="bg-gradient-to-br from-blue-100 to-cyan-100 rounded-2xl p-6 border-2 border-blue-300 shadow-lg"
                    >
                      <Target className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                      <div className="text-3xl font-black text-blue-600">{examResult.maxPossibleScore}</div>
                      <div className="text-sm text-blue-700 font-semibold">Max Possible</div>
                    </motion.div>
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.7 }}
                      className="bg-gradient-to-br from-purple-100 to-fuchsia-100 rounded-2xl p-6 border-2 border-purple-300 shadow-lg"
                    >
                      <BarChart3 className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                      <div className="text-3xl font-black text-purple-600">{examResult.percentage.toFixed(1)}%</div>
                      <div className="text-sm text-purple-700 font-semibold">Percentage</div>
                    </motion.div>
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.8 }}
                      className="bg-gradient-to-br from-orange-100 to-red-100 rounded-2xl p-6 border-2 border-orange-300 shadow-lg"
                    >
                      <CheckCircle2 className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                      <div className="text-3xl font-black text-orange-600">
                        {examResult.correctAnswers}/{examResult.totalQuestions}
                      </div>
                      <div className="text-sm text-orange-700 font-semibold">Correct Answers</div>
                    </motion.div>
                  </div>

                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.9 }}
                    className="bg-gradient-to-r from-gray-100 to-slate-100 rounded-xl p-4 mb-8 border border-gray-300"
                  >
                    <div className="flex items-center justify-center gap-3 text-gray-700">
                      <Clock className="w-6 h-6" />
                      <span className="font-bold text-lg">Time Spent: {formatTime(examResult.timeSpent)}</span>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="flex gap-4 justify-center"
                  >
                    <button
                      onClick={() => router.push("/dashboard/student/exams")}
                      className="px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition-all"
                      aria-label="Back to exams"
                    >
                      Back to Exams
                    </button>
                    <button
                      onClick={() => router.push("/dashboard/student")}
                      className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-bold hover:from-purple-700 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all"
                      aria-label="Go to dashboard"
                    >
                      Go to Dashboard
                    </button>
                  </motion.div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </StudentLayout>
    </ProtectedRoute>
  )
}