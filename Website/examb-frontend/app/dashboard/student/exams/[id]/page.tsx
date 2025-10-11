"use client"
import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import ProtectedRoute from "@/components/ProtectedRoute"
import StudentLayout from "@/components/StudentLayout"
import { studentService } from "@/services/studentService"
import { FileText, Clock, AlertCircle, ChevronLeft, ChevronRight, Send, Loader2 } from "lucide-react"

export default function TakeExamPage() {
  const params = useParams()
  const router = useRouter()
  const examId = params.id as string

  const [exam, setExam] = useState<any>(null)
  const [questions, setQuestions] = useState<any[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, any>>({})
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null)

  useEffect(() => {
    fetchExamData()
  }, [examId])

  useEffect(() => {
    if (timeRemaining === null || timeRemaining <= 0) return

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(timer)
          handleSubmit()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [timeRemaining])

  const fetchExamData = async () => {
    try {
      setLoading(true)
      const response = await studentService.getExamById(examId)
      const examData = response.data?.data || response.data
      setExam(examData)
      setQuestions(examData.questions || [])

      if (examData.duration) {
        setTimeRemaining(examData.duration * 60)
      }
    } catch (error) {
      console.error("Error fetching exam:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleAnswerChange = (questionId: string, answer: any) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }))
  }

  const handleSubmit = async () => {
    if (submitting) return

    const unanswered = questions.filter((q) => !answers[q._id])
    if (unanswered.length > 0) {
      const confirm = window.confirm(
        `You have ${unanswered.length} unanswered questions. Are you sure you want to submit?`,
      )
      if (!confirm) return
    }

    setSubmitting(true)
    try {
      await studentService.submitExam(examId, { answers })
      router.push("/dashboard/student/results")
    } catch (error) {
      console.error("Error submitting exam:", error)
      alert("Failed to submit exam. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  if (loading) {
    return (
      <ProtectedRoute allowedRole="student">
        <StudentLayout>
          <div className="flex items-center justify-center h-96">
            <div className="relative">
              <div className="w-16 h-16 rounded-full border-4 border-purple-200"></div>
              <div className="w-16 h-16 rounded-full border-4 border-purple-600 border-t-transparent animate-spin absolute top-0 left-0"></div>
            </div>
          </div>
        </StudentLayout>
      </ProtectedRoute>
    )
  }

  if (!exam || questions.length === 0) {
    return (
      <ProtectedRoute allowedRole="student">
        <StudentLayout>
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-12 border-2 border-red-100 shadow-lg text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Exam not found</h3>
            <p className="text-gray-600 mb-6">This exam does not exist or has no questions.</p>
            <button
              onClick={() => router.push("/dashboard/student/exams")}
              className="px-6 py-3 bg-purple-600 text-white font-bold rounded-xl hover:bg-purple-700 transition-all"
            >
              Back to Exams
            </button>
          </div>
        </StudentLayout>
      </ProtectedRoute>
    )
  }

  const currentQuestion = questions[currentQuestionIndex]
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100
  const answeredCount = Object.keys(answers).length

  return (
    <ProtectedRoute allowedRole="student">
      <StudentLayout>
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-cyan-600 rounded-2xl p-6 text-white shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <h1 className="text-2xl font-black">{exam.title || exam.name}</h1>
                  <p className="text-purple-100 text-sm font-medium">
                    Question {currentQuestionIndex + 1} of {questions.length}
                  </p>
                </div>
              </div>

              {timeRemaining !== null && (
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl">
                  <Clock className="w-5 h-5" />
                  <span className="text-xl font-black">{formatTime(timeRemaining)}</span>
                </div>
              )}
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden">
              <div
                className="bg-white h-full transition-all duration-300 rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="flex items-center justify-between mt-3 text-sm font-semibold">
              <span>
                {answeredCount} of {questions.length} answered
              </span>
              <span>{Math.round(progress)}% complete</span>
            </div>
          </div>

          {/* Question Card */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl border-2 border-purple-100/50 shadow-lg overflow-hidden">
            <div className="p-8">
              <div className="mb-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-bold mb-4">
                  Question {currentQuestionIndex + 1}
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">{currentQuestion.question}</h2>
              </div>

              {/* Answer Options */}
              <div className="space-y-3">
                {currentQuestion.type === "multiple_choice" &&
                  currentQuestion.options?.map((option: string, index: number) => (
                    <label
                      key={index}
                      className={`flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all hover:shadow-md ${
                        answers[currentQuestion._id] === option
                          ? "border-purple-600 bg-purple-50"
                          : "border-gray-200 hover:border-purple-300"
                      }`}
                    >
                      <input
                        type="radio"
                        name={currentQuestion._id}
                        value={option}
                        checked={answers[currentQuestion._id] === option}
                        onChange={(e) => handleAnswerChange(currentQuestion._id, e.target.value)}
                        className="w-5 h-5 text-purple-600"
                      />
                      <span className="font-medium text-gray-900">{option}</span>
                    </label>
                  ))}

                {currentQuestion.type === "true_false" && (
                  <>
                    {["True", "False"].map((option) => (
                      <label
                        key={option}
                        className={`flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all hover:shadow-md ${
                          answers[currentQuestion._id] === option
                            ? "border-purple-600 bg-purple-50"
                            : "border-gray-200 hover:border-purple-300"
                        }`}
                      >
                        <input
                          type="radio"
                          name={currentQuestion._id}
                          value={option}
                          checked={answers[currentQuestion._id] === option}
                          onChange={(e) => handleAnswerChange(currentQuestion._id, e.target.value)}
                          className="w-5 h-5 text-purple-600"
                        />
                        <span className="font-medium text-gray-900">{option}</span>
                      </label>
                    ))}
                  </>
                )}

                {(currentQuestion.type === "short_answer" || currentQuestion.type === "essay") && (
                  <textarea
                    value={answers[currentQuestion._id] || ""}
                    onChange={(e) => handleAnswerChange(currentQuestion._id, e.target.value)}
                    rows={currentQuestion.type === "essay" ? 8 : 4}
                    placeholder="Type your answer here..."
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all"
                  />
                )}
              </div>
            </div>

            {/* Navigation */}
            <div className="p-6 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
              <button
                onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
                disabled={currentQuestionIndex === 0}
                className="flex items-center gap-2 px-4 py-2 border-2 border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <ChevronLeft className="w-5 h-5" />
                Previous
              </button>

              <div className="flex gap-2">
                {questions.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentQuestionIndex(index)}
                    className={`w-10 h-10 rounded-lg font-bold transition-all ${
                      index === currentQuestionIndex
                        ? "bg-purple-600 text-white"
                        : answers[questions[index]._id]
                          ? "bg-green-100 text-green-700 border-2 border-green-300"
                          : "bg-gray-100 text-gray-600 border-2 border-gray-300"
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>

              {currentQuestionIndex < questions.length - 1 ? (
                <button
                  onClick={() => setCurrentQuestionIndex((prev) => Math.min(questions.length - 1, prev + 1))}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-all"
                >
                  Next
                  <ChevronRight className="w-5 h-5" />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg font-bold hover:shadow-lg disabled:opacity-50 transition-all"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Submit Exam
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </StudentLayout>
    </ProtectedRoute>
  )
}
