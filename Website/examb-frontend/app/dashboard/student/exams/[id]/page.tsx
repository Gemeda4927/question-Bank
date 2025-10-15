"use client"
import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import ProtectedRoute from "@/components/ProtectedRoute"
import StudentLayout from "@/components/StudentLayout"
import { studentService } from "@/services/studentService"
import {
  FileText,
  Clock,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Star,
  Sparkles,
  CheckCircle2,
  XCircle,
  Trophy,
  Award,
  Lightbulb,
  BookOpen,
  Zap,
  Calculator,
  Target,
  BarChart3,
  Eye,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface Question {
  _id: string
  text: string
  type: string
  options?: string[]
  correctAnswer: string | string[]
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

export default function TakeExamPage() {
  const params = useParams()
  const router = useRouter()
  const examId = params.id as string

  const [exam, setExam] = useState<any>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, any>>({})
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [showSubmitModal, setShowSubmitModal] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null)
  const [showExplanation, setShowExplanation] = useState(false)
  const [currentExplanation, setCurrentExplanation] = useState<{
    text: string
    hasExplanation: boolean
    isCorrect: boolean
    pointsEarned: number
    maxPoints: number
  } | null>(null)
  const [mounted, setMounted] = useState(false)
  const [examResult, setExamResult] = useState<ExamResult | null>(null)
  const [startTime, setStartTime] = useState<number>(0)

  useEffect(() => {
    setMounted(true)
    setStartTime(Date.now())
    const savedAnswers = sessionStorage.getItem(`exam_${examId}_answers`)
    if (savedAnswers) {
      try {
        setAnswers(JSON.parse(savedAnswers))
      } catch (e) {
        console.error("Failed to parse saved answers:", e)
      }
    }
  }, [examId])

  useEffect(() => {
    if (mounted && Object.keys(answers).length > 0) {
      sessionStorage.setItem(`exam_${examId}_answers`, JSON.stringify(answers))
    }
  }, [answers, examId, mounted])

  useEffect(() => {
    if (mounted) {
      fetchExam()
    }
  }, [examId, mounted])

  const fetchExam = async () => {
    try {
      setLoading(true)
      const res = await studentService.getExamById(examId)
      const data = res.data?.data || res.data
      setExam(data)
      setQuestions(data.questions || [])
      if (data.duration) setTimeRemaining(data.duration * 60)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!mounted || timeRemaining === null || timeRemaining <= 0) return

    const t = setInterval(() => {
      setTimeRemaining((prev) => {
        if (!prev || prev <= 1) {
          clearInterval(t)
          handleAutoSubmit()
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(t)
  }, [timeRemaining, mounted])

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

  const handleAnswer = (qid: string, selected: any) => {
    if (!mounted) return

    setAnswers((prev) => ({
      ...prev,
      [qid]: selected,
    }))

    const question = questions.find((q) => q._id === qid)
    if (!question) return

    const pointsEarned = calculatePoints(question, selected)
    const maxPoints = question.maxPoints || question.marks

    const explanationText = question.explanation || "No detailed explanation provided for this question."

    setCurrentExplanation({
      text: explanationText,
      hasExplanation: !!question.explanation,
      isCorrect: pointsEarned > 0,
      pointsEarned,
      maxPoints,
    })
    setShowExplanation(true)
  }

  const handleCloseExplanation = () => {
    setShowExplanation(false)
    setCurrentExplanation(null)
    if (currentIndex < questions.length - 1) {
      nextQuestion()
    }
  }

  const nextQuestion = () => {
    if (mounted) {
      setCurrentIndex((prev) => Math.min(prev + 1, questions.length - 1))
    }
  }

  const prevQuestion = () => {
    if (mounted) {
      setCurrentIndex((prev) => Math.max(prev - 1, 0))
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
    if (submitting || !mounted) return
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
      setShowSubmitModal(true)
    } catch (err: any) {
      console.error(err)
    } finally {
      setSubmitting(false)
    }
  }

  const handleAutoSubmit = async () => {
    if (submitting || !mounted) return
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
        autoSubmitted: true,
      })

      sessionStorage.removeItem(`exam_${examId}_answers`)
      setShowSubmitModal(true)
    } catch (err: any) {
      console.error(err)
    } finally {
      setSubmitting(false)
    }
  }

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`

  const current = questions[currentIndex]
  const progress = questions.length > 0 ? ((currentIndex + 1) / questions.length) * 100 : 0

  if (!mounted || loading) {
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
            <h2 className="text-2xl font-bold">No Exam or Questions Found</h2>
            <button
              onClick={() => router.push("/dashboard/student/exams")}
              className="mt-6 px-5 py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700"
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
        <div className="max-w-5xl mx-auto space-y-6 relative">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-purple-600 via-fuchsia-500 to-cyan-600 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden"
          >
            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileText className="w-7 h-7" />
                <div>
                  <h1 className="text-2xl font-black">{exam.name}</h1>
                  <p className="text-sm text-purple-100">
                    Question {currentIndex + 1} of {questions.length}
                  </p>
                </div>
              </div>
              {timeRemaining !== null && (
                <div
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl backdrop-blur-sm ${
                    timeRemaining < 60 ? "bg-red-500/40" : "bg-white/20"
                  }`}
                >
                  <Clock className="w-5 h-5" />
                  <span className="font-bold">{formatTime(timeRemaining)}</span>
                </div>
              )}
            </div>

            <div className="w-full mt-4 bg-white/20 rounded-full h-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.4 }}
                className="bg-white h-2 rounded-full"
              />
            </div>
          </motion.div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 25 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -25 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-2xl p-8 shadow-xl border border-purple-100 relative"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-full font-bold text-sm">
                  <Sparkles className="w-4 h-4" />
                  Question {currentIndex + 1}
                </div>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-100 text-orange-700 rounded-full font-semibold text-sm">
                  <Star className="w-4 h-4 fill-current" /> {current.maxPoints || current.marks} Points
                </div>
              </div>

              <h2 className="text-2xl font-semibold mb-4">{current.text}</h2>

              {current.imageUrl && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4 }}
                  className="flex justify-center mb-6"
                >
                  <img
                    src={current.imageUrl || "/placeholder.svg"}
                    alt="Question image"
                    className="max-h-64 rounded-xl border border-gray-200 shadow-md object-contain"
                  />
                </motion.div>
              )}

              <div className="space-y-3">
                {(current.type === "multiple-choice" || current.type === "multiple_choice") &&
                  current.options?.map((opt: string, i: number) => (
                    <motion.label
                      key={i}
                      whileHover={{ scale: 1.02 }}
                      className={`flex items-center gap-4 p-5 rounded-xl border-2 transition-all cursor-pointer ${
                        answers[current._id] === opt
                          ? "border-purple-600 bg-purple-50 shadow-md"
                          : "border-gray-200 hover:border-purple-300"
                      }`}
                    >
                      <input
                        type="radio"
                        name={current._id}
                        checked={answers[current._id] === opt}
                        onChange={() => handleAnswer(current._id, opt)}
                        className="w-5 h-5 text-purple-600"
                        aria-label={`Option ${opt}`}
                      />
                      <span className="flex-1 font-medium">{opt}</span>
                    </motion.label>
                  ))}

                {(current.type === "multiple-select" || current.type === "multiple_select") &&
                  current.options?.map((opt: string, i: number) => (
                    <motion.label
                      key={i}
                      whileHover={{ scale: 1.02 }}
                      className={`flex items-center gap-4 p-5 rounded-xl border-2 transition-all cursor-pointer ${
                        Array.isArray(answers[current._id]) && answers[current._id].includes(opt)
                          ? "border-purple-600 bg-purple-50 shadow-md"
                          : "border-gray-200 hover:border-purple-300"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={Array.isArray(answers[current._id]) && answers[current._id].includes(opt)}
                        onChange={(e) => {
                          const currentAnswers = Array.isArray(answers[current._id]) ? answers[current._id] : []
                          const newAnswers = e.target.checked
                            ? [...currentAnswers, opt]
                            : currentAnswers.filter((a: string) => a !== opt)
                          handleAnswer(current._id, newAnswers)
                        }}
                        className="w-5 h-5 text-purple-600 rounded"
                        aria-label={`Option ${opt}`}
                      />
                      <span className="flex-1 font-medium">{opt}</span>
                    </motion.label>
                  ))}

                {(current.type === "true-false" || current.type === "true_false") &&
                  ["True", "False"].map((opt) => (
                    <motion.label
                      key={opt}
                      whileHover={{ scale: 1.02 }}
                      className={`flex items-center gap-4 p-5 rounded-xl border-2 cursor-pointer transition-all ${
                        answers[current._id] === opt
                          ? "border-purple-600 bg-purple-50 shadow-md"
                          : "border-gray-200 hover:border-purple-300"
                      }`}
                    >
                      <input
                        type="radio"
                        name={current._id}
                        checked={answers[current._id] === opt}
                        onChange={() => handleAnswer(current._id, opt)}
                        className="w-5 h-5 text-purple-600"
                        aria-label={`Option ${opt}`}
                      />
                      <span className="flex-1 font-medium">{opt}</span>
                    </motion.label>
                  ))}

                {(current.type === "short-answer" || current.type === "short_answer" || current.type === "essay") && (
                  <textarea
                    value={answers[current._id] || ""}
                    onChange={(e) => handleAnswer(current._id, e.target.value)}
                    rows={current.type === "essay" ? 8 : 4}
                    placeholder="Write your answer..."
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100"
                    aria-label="Answer input"
                  />
                )}

                {current.type === "matching" && Array.isArray(current.options) && (
                  <div className="space-y-4">
                    {current.options.map((option: string, index: number) => (
                      <div key={index} className="flex items-center gap-4 p-4 border-2 border-gray-200 rounded-xl">
                        <span className="font-medium w-32">{option}</span>
                        <input
                          type="text"
                          value={answers[current._id]?.[index] || ""}
                          onChange={(e) => {
                            const currentMatches = answers[current._id] || {}
                            const newMatches = { ...currentMatches, [index]: e.target.value }
                            handleAnswer(current._id, newMatches)
                          }}
                          placeholder="Your match..."
                          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-purple-500"
                          aria-label={`Match for ${option}`}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="flex justify-between items-center mt-4">
            <button
              onClick={prevQuestion}
              disabled={currentIndex === 0}
              className="flex items-center gap-2 px-5 py-3 border-2 border-gray-300 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Previous question"
            >
              <ChevronLeft className="w-5 h-5" /> Previous
            </button>

            {currentIndex < questions.length - 1 ? (
              <button
                onClick={nextQuestion}
                className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700"
                aria-label="Next question"
              >
                Next <ChevronRight className="w-5 h-5" />
              </button>
            ) : (
              <button
                onClick={() => router.push(`/dashboard/student/exams/${examId}/review`)}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700"
                aria-label="Review answers"
              >
                <Eye className="w-5 h-5" />
                Review Answers
              </button>
            )}
          </div>
        </div>

        <AnimatePresence>
          {showExplanation && currentExplanation && (
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
                transition={{ type: "spring", damping: 25 }}
                className={`rounded-3xl p-8 max-w-2xl w-full border-2 shadow-2xl ${
                  currentExplanation.isCorrect
                    ? "bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50 border-emerald-200"
                    : "bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 border-amber-200"
                }`}
              >
                <div className="text-center mb-6">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring" }}
                    className={`inline-flex items-center gap-3 px-6 py-3 rounded-full text-white font-bold text-lg mb-4 ${
                      currentExplanation.isCorrect
                        ? "bg-gradient-to-r from-emerald-500 to-green-500"
                        : "bg-gradient-to-r from-amber-500 to-orange-500"
                    }`}
                  >
                    <Award className="w-6 h-6" />
                    {currentExplanation.isCorrect ? "Great Job!" : "Keep Learning!"}
                    <Target className="w-6 h-6" />
                  </motion.div>

                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className={`flex items-center justify-center gap-2 mb-2 ${
                      currentExplanation.isCorrect ? "text-emerald-700" : "text-amber-700"
                    }`}
                  >
                    {currentExplanation.isCorrect ? (
                      <CheckCircle2 className="w-8 h-8 fill-emerald-500 text-white" />
                    ) : (
                      <XCircle className="w-8 h-8 fill-amber-500 text-white" />
                    )}
                    <span className="text-xl font-bold">
                      {currentExplanation.isCorrect
                        ? `Correct! +${currentExplanation.pointsEarned} Points`
                        : `Incomplete Answer +${currentExplanation.pointsEarned} Points`}
                    </span>
                  </motion.div>

                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.4 }}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-md"
                  >
                    <Calculator className="w-4 h-4 text-purple-600" />
                    <span className="text-sm font-bold text-purple-600">
                      {currentExplanation.pointsEarned} / {currentExplanation.maxPoints} Points
                    </span>
                  </motion.div>
                </div>

                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="bg-white rounded-2xl p-6 border shadow-lg mb-6"
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`p-3 rounded-xl ${
                        currentExplanation.hasExplanation ? "bg-blue-100 text-blue-600" : "bg-amber-100 text-amber-600"
                      }`}
                    >
                      {currentExplanation.hasExplanation ? (
                        <Lightbulb className="w-6 h-6" />
                      ) : (
                        <BookOpen className="w-6 h-6" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-gray-800 mb-3 flex items-center gap-2">
                        {currentExplanation.hasExplanation ? "Detailed Explanation" : "General Feedback"}
                        <Zap className="w-4 h-4 text-yellow-500" />
                      </h3>
                      <p className="text-gray-700 leading-relaxed text-lg">{currentExplanation.text}</p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5 }}
                  className="flex items-center justify-between mb-6 px-4"
                >
                  <span className="text-sm font-medium text-gray-600">Question Progress</span>
                  <span className="text-sm font-bold text-purple-600">
                    {currentIndex + 1} of {questions.length}
                  </span>
                </motion.div>

                <motion.button
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  onClick={handleCloseExplanation}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold text-lg py-4 rounded-2xl hover:from-purple-700 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
                  aria-label={currentIndex < questions.length - 1 ? "Continue to next question" : "Review answers"}
                >
                  <Sparkles className="w-5 h-5" />
                  {currentIndex < questions.length - 1 ? "Continue to Next Question" : "Review Your Answers"}
                  <ChevronRight className="w-5 h-5" />
                </motion.button>
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
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            >
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className="bg-white rounded-2xl p-10 text-center shadow-2xl max-w-2xl w-full"
              >
                <div className="flex items-center justify-center gap-4 mb-6">
                  <CheckCircle2 className="text-green-500 w-12 h-12" />
                  <BarChart3 className="text-purple-500 w-12 h-12" />
                  <Trophy className="text-yellow-500 w-12 h-12" />
                </div>

                <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  Exam Completed!
                </h2>

                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                    <div className="text-2xl font-bold text-green-600">{examResult.totalScore.toFixed(1)}</div>
                    <div className="text-sm text-green-700">Points Earned</div>
                  </div>
                  <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                    <div className="text-2xl font-bold text-blue-600">{examResult.maxPossibleScore}</div>
                    <div className="text-sm text-blue-700">Max Possible</div>
                  </div>
                  <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
                    <div className="text-2xl font-bold text-purple-600">{examResult.percentage.toFixed(1)}%</div>
                    <div className="text-sm text-purple-700">Percentage</div>
                  </div>
                  <div className="bg-orange-50 rounded-xl p-4 border border-orange-200">
                    <div className="text-2xl font-bold text-orange-600">
                      {examResult.correctAnswers}/{examResult.totalQuestions}
                    </div>
                    <div className="text-sm text-orange-700">Correct Answers</div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-4 mb-6">
                  <div className="flex items-center justify-center gap-2 text-gray-700">
                    <Clock className="w-5 h-5" />
                    <span className="font-semibold">Time Spent: {formatTime(examResult.timeSpent)}</span>
                  </div>
                </div>

                <p className="text-gray-600 mb-6 text-lg">
                  {examResult.percentage >= 80
                    ? "Outstanding performance! You've mastered this material."
                    : examResult.percentage >= 60
                      ? "Good work! You have a solid understanding."
                      : "Keep practicing! Review the material and try again."}
                </p>

                <div className="flex gap-4 justify-center">
                  <button
                    onClick={() => router.push("/dashboard/student/exams")}
                    className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50"
                    aria-label="Back to exams"
                  >
                    Back to Exams
                  </button>
                  <button
                    onClick={() => router.push("/dashboard/student/results")}
                    className="px-6 py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700"
                    aria-label="View detailed results"
                  >
                    View Detailed Results
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </StudentLayout>
    </ProtectedRoute>
  )
}