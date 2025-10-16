"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { studentService } from "@/services/studentService"
import ProtectedRoute from "@/components/ProtectedRoute"
import StudentLayout from "@/components/StudentLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import {
  Clock,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Trophy,
  BookOpen,
  Target,
  Zap,
  Star,
  Award,
  Sparkles,
  Brain,
  Lightbulb,
  Shield,
  RotateCcw
} from "lucide-react"

interface Question {
  _id: string
  examId: string | { _id: string; name?: string; code?: string }
  text: string
  type: string
  options: string[]
  correctAnswer?: string
  marks?: number
  hints?: string[]
  explanation?: string
  reference?: string
  imageUrl?: string
  difficulty?: "easy" | "medium" | "hard"
}

interface Answer {
  questionId: string
  selectedOption: string
  isCorrect?: boolean
  timestamp: number
}

export default function ExamPage() {
  const params = useParams()
  const router = useRouter()
  const examId = params.id as string

  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Answer[]>([])
  const [timeLeft, setTimeLeft] = useState(3600)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [examSubmitted, setExamSubmitted] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [isAnimating, setIsAnimating] = useState(false)

  const currentQuestion = questions[currentQuestionIndex]
  const totalQuestions = questions.length
  const answeredQuestions = answers.length
  const progress = totalQuestions > 0 ? (answeredQuestions / totalQuestions) * 100 : 0

  // Enhanced question fetching with error handling
  useEffect(() => {
    const fetchQuestions = async () => {
      if (!examId) {
        setError("Exam ID not found")
        setLoading(false)
        return
      }
      
      try {
        setLoading(true)
        setError(null)
        const res = await studentService.getAllQuestions()
        const allData = res.data?.data || res.data || []
        const questionsArray = Array.isArray(allData) ? allData : [allData]
        const filtered = questionsArray.filter((q: Question) =>
          (typeof q.examId === "string" ? q.examId : q.examId._id) === examId
        )
        
        if (filtered.length === 0) {
          setError("No questions found for this exam")
        } else {
          setQuestions(filtered)
        }
      } catch (err) {
        console.error("Failed to load questions:", err)
        setError("Unable to load exam questions. Please try again.")
      } finally {
        setLoading(false)
      }
    }
    fetchQuestions()
  }, [examId])

  // Enhanced timer with warnings
  useEffect(() => {
    if (timeLeft > 0 && !examSubmitted) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0 && !examSubmitted) {
      handleAutoSubmit()
    }
  }, [timeLeft, examSubmitted])

  const handleAnswerSelect = (option: string) => {
    if (!currentQuestion || examSubmitted) return
    
    setIsAnimating(true)
    setSelectedOption(option)
    
    const newAnswer: Answer = {
      questionId: currentQuestion._id,
      selectedOption: option,
      isCorrect: option === currentQuestion.correctAnswer,
      timestamp: Date.now()
    }
    
    setAnswers(prev => {
      const filtered = prev.filter(ans => ans.questionId !== currentQuestion._id)
      return [...filtered, newAnswer]
    })

    // Auto-advance after short delay for better UX
    setTimeout(() => {
      setIsAnimating(false)
      if (currentQuestionIndex < totalQuestions - 1) {
        handleNextQuestion()
      }
    }, 500)
  }

  const handleNextQuestion = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setIsAnimating(true)
      setTimeout(() => {
        setCurrentQuestionIndex(prev => prev + 1)
        setSelectedOption(null)
        setIsAnimating(false)
      }, 300)
    }
  }

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setIsAnimating(true)
      setTimeout(() => {
        setCurrentQuestionIndex(prev => prev - 1)
        setSelectedOption(getCurrentAnswer()?.selectedOption || null)
        setIsAnimating(false)
      }, 300)
    }
  }

  const handleQuestionNavigation = (index: number) => {
    if (index >= 0 && index < totalQuestions) {
      setIsAnimating(true)
      setTimeout(() => {
        setCurrentQuestionIndex(index)
        setSelectedOption(getCurrentAnswer()?.selectedOption || null)
        setIsAnimating(false)
      }, 300)
    }
  }

  const handleAutoSubmit = () => {
    setExamSubmitted(true)
    setShowResults(true)
  }

  const handleSubmitExam = async () => {
    setIsSubmitting(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      setExamSubmitted(true)
      setShowResults(true)
    } catch (err) {
      console.error("Submission error:", err)
      setError("Failed to submit exam. Please try again.")
    } finally {
      setIsSubmitting(false)
      setShowConfirmation(false)
    }
  }

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    const s = seconds % 60
    return `${h.toString().padStart(2,'0')}:${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}`
  }

  const getCurrentAnswer = () => answers.find(ans => ans.questionId === currentQuestion?._id)

  const calculateScore = () => {
    const correctAnswers = answers.filter(ans => ans.isCorrect).length
    const totalMarks = questions.reduce((sum, q) => sum + (q.marks || 1), 0)
    const obtainedMarks = answers.reduce((sum, ans) =>
      sum + (ans.isCorrect ? (questions.find(q => q._id === ans.questionId)?.marks || 1) : 0), 0
    )
    const percentage = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0
    
    // Performance rating
    let performance = "Beginner"
    let performanceColor = "text-gray-600"
    if (percentage >= 90) {
      performance = "Excellent"
      performanceColor = "text-yellow-600"
    } else if (percentage >= 75) {
      performance = "Good"
      performanceColor = "text-green-600"
    } else if (percentage >= 60) {
      performance = "Average"
      performanceColor = "text-blue-600"
    }

    return {
      correct: correctAnswers,
      total: totalQuestions,
      percentage,
      totalMarks,
      obtainedMarks,
      performance,
      performanceColor
    }
  }

  const score = calculateScore()

  const getTimeWarning = () => {
    if (timeLeft < 300) return "text-red-500 animate-pulse font-bold"
    if (timeLeft < 900) return "text-amber-500 font-semibold"
    return "text-gray-700"
  }

  const getDifficultyBadge = (difficulty?: string) => {
    switch (difficulty) {
      case "easy":
        return <Badge variant="success" className="flex items-center gap-1"><Zap className="w-3 h-3" /> Easy</Badge>
      case "medium":
        return <Badge variant="warning" className="flex items-center gap-1"><Target className="w-3 h-3" /> Medium</Badge>
      case "hard":
        return <Badge variant="destructive" className="flex items-center gap-1"><Brain className="w-3 h-3" /> Hard</Badge>
      default:
        return null
    }
  }

  // Enhanced loading screen
  if (loading) return (
    <ProtectedRoute allowedRole="student">
      <StudentLayout>
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
          <div className="text-center space-y-6">
            <div className="relative">
              <div className="w-24 h-24 border-4 border-purple-200 rounded-full animate-spin mx-auto"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <BookOpen className="w-8 h-8 text-purple-600 animate-pulse" />
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-3xl font-bold text-purple-700 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Preparing Your Exam
              </h3>
              <p className="text-gray-600">Loading questions and setting up your environment...</p>
            </div>
          </div>
        </div>
      </StudentLayout>
    </ProtectedRoute>
  )

  // Enhanced error state
  if (error) return (
    <ProtectedRoute allowedRole="student">
      <StudentLayout>
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-orange-50 to-pink-50 p-4">
          <Card className="max-w-md w-full p-8 shadow-2xl border-red-200 transform hover:scale-105 transition-transform duration-300">
            <div className="text-center space-y-4">
              <div className="relative">
                <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-2 animate-bounce" />
                <Shield className="w-8 h-8 text-red-300 absolute -top-2 -right-2 animate-pulse" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-gray-800">Exam Loading Error</h3>
                <p className="text-gray-600 leading-relaxed">{error}</p>
              </div>
              <div className="flex gap-3 justify-center pt-4">
                <Button 
                  onClick={() => router.back()} 
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Go Back
                </Button>
                <Button 
                  onClick={() => window.location.reload()} 
                  variant="outline"
                  className="border-purple-500 text-purple-600 hover:bg-purple-50 transition-all duration-300"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Retry
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </StudentLayout>
    </ProtectedRoute>
  )

  // Enhanced Review Page
  if (showResults) return (
    <ProtectedRoute allowedRole="student">
      <StudentLayout>
        <div className="min-h-screen py-8 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
          <div className="max-w-6xl mx-auto px-4 space-y-8">
            {/* Results Header */}
            <Card className="shadow-2xl border-0 overflow-hidden transform hover:scale-105 transition-transform duration-500">
              <CardHeader className="bg-gradient-to-r from-green-500 via-emerald-600 to-teal-700 text-white py-12 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="relative z-10">
                  <Trophy className="w-20 h-20 mx-auto mb-4 animate-bounce text-yellow-300 filter drop-shadow-lg" />
                  <CardTitle className="text-5xl font-bold mb-4 bg-gradient-to-r from-yellow-300 to-white bg-clip-text text-transparent">
                    Exam Completed!
                  </CardTitle>
                  <p className="text-green-100 text-xl font-light">Your performance analysis is ready</p>
                </div>
              </CardHeader>
              <CardContent className="p-8 space-y-8">
                {/* Score Overview */}
                <div className="text-center space-y-6">
                  <div className="relative inline-block">
                    <div className="w-40 h-40 bg-gradient-to-r from-green-400 to-teal-500 rounded-full flex items-center justify-center mx-auto shadow-2xl animate-pulse">
                      <span className="text-4xl font-bold text-white">{score.percentage.toFixed(1)}%</span>
                    </div>
                    <Award className="w-8 h-8 text-yellow-400 absolute -top-2 -right-2 animate-spin" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-2xl font-bold text-gray-800">
                      <span className={score.performanceColor}>{score.performance}</span> Performance
                    </p>
                    <p className="text-gray-600 text-lg font-semibold">
                      {score.correct}/{score.total} Correct Answers • {score.obtainedMarks}/{score.totalMarks} Marks
                    </p>
                  </div>
                </div>

                {/* Enhanced Question Review */}
                <div className="grid gap-6">
                  <div className="flex items-center gap-2 text-xl font-bold text-gray-800 mb-4">
                    <BookOpen className="w-6 h-6 text-purple-600" />
                    Question Review
                  </div>
                  {questions.map((q, index) => {
                    const answer = answers.find(a => a.questionId === q._id)
                    const isCorrect = answer?.isCorrect
                    return (
                      <Card 
                        key={q._id} 
                        className="border shadow-sm hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border-l-4 border-l-purple-500"
                      >
                        <CardContent className="p-6 space-y-4">
                          <div className="flex justify-between items-start gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <span className="text-lg font-semibold text-gray-800 bg-purple-100 px-3 py-1 rounded-full">
                                  {index + 1}
                                </span>
                                {getDifficultyBadge(q.difficulty)}
                              </div>
                              <h4 className="text-lg font-medium text-gray-800 leading-relaxed">{q.text}</h4>
                            </div>
                            <Badge 
                              variant={isCorrect ? "success" : "destructive"} 
                              className="flex items-center gap-1 px-3 py-1 text-sm font-semibold"
                            >
                              {isCorrect ? (
                                <CheckCircle className="w-4 h-4" />
                              ) : (
                                <AlertCircle className="w-4 h-4" />
                              )}
                              {isCorrect ? "Correct" : "Incorrect"}
                            </Badge>
                          </div>

                          {q.imageUrl && (
                            <img 
                              src={q.imageUrl} 
                              alt="Question visual" 
                              className="rounded-lg border shadow-sm max-w-md mx-auto"
                            />
                          )}

                          <div className="grid gap-2">
                            {q.options.map(opt => {
                              const isSelected = answer?.selectedOption === opt
                              const isCorrectAnswer = opt === q.correctAnswer
                              return (
                                <div
                                  key={opt}
                                  className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                                    isSelected && isCorrectAnswer
                                      ? "bg-green-50 border-green-500 shadow-sm"
                                      : isSelected && !isCorrectAnswer
                                      ? "bg-red-50 border-red-500 shadow-sm"
                                      : isCorrectAnswer
                                      ? "bg-blue-50 border-blue-300 shadow-sm"
                                      : "bg-gray-50 border-gray-200 hover:border-gray-300"
                                  }`}
                                >
                                  <div className="flex items-center gap-3">
                                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                                      isSelected && isCorrectAnswer
                                        ? "bg-green-500 border-green-500 text-white"
                                        : isSelected && !isCorrectAnswer
                                        ? "bg-red-500 border-red-500 text-white"
                                        : isCorrectAnswer
                                        ? "bg-blue-500 border-blue-500 text-white"
                                        : "bg-white border-gray-400"
                                    }`}>
                                      {isCorrectAnswer && <CheckCircle className="w-3 h-3" />}
                                      {isSelected && !isCorrectAnswer && <AlertCircle className="w-3 h-3" />}
                                    </div>
                                    <span className={`font-medium ${
                                      isSelected && !isCorrectAnswer ? "text-red-700" : "text-gray-700"
                                    }`}>
                                      {opt}
                                    </span>
                                    {isCorrectAnswer && !isSelected && (
                                      <Badge variant="outline" className="ml-auto text-blue-600 border-blue-300">
                                        Correct Answer
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                              )
                            })}
                          </div>

                          {/* Learning Resources */}
                          {(q.hints || q.explanation || q.reference) && (
                            <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-lg border border-purple-200">
                              <div className="flex items-center gap-2 text-purple-800 font-semibold mb-2">
                                <Lightbulb className="w-4 h-4" />
                                Learning Resources
                              </div>
                              <div className="space-y-2 text-sm">
                                {q.hints && (
                                  <p className="text-amber-700 italic">
                                    <strong>Hint:</strong> {q.hints.join(", ")}
                                  </p>
                                )}
                                {q.explanation && (
                                  <p className="text-gray-700">
                                    <strong>Explanation:</strong> {q.explanation}
                                  </p>
                                )}
                                {q.reference && (
                                  <a 
                                    href={q.reference} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:text-blue-800 underline transition-colors duration-200 inline-flex items-center gap-1"
                                  >
                                    <BookOpen className="w-3 h-3" />
                                    Reference Material
                                  </a>
                                )}
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </StudentLayout>
    </ProtectedRoute>
  )

  // Enhanced Exam Page
  return (
    <ProtectedRoute allowedRole="student">
      <StudentLayout>
        <div className="min-h-screen py-8 bg-gradient-to-br from-purple-50 via-pink-50 to-yellow-50">
          <div className="max-w-4xl mx-auto px-4 space-y-8">
            {/* Enhanced Header Section */}
            <div className="text-center space-y-2">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Online Examination
              </h1>
              <p className="text-gray-600 text-lg">Test your knowledge and skills</p>
            </div>

            {/* Enhanced Progress & Timer Section */}
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
                  {/* Timer */}
                  <div className={`flex items-center gap-3 text-2xl font-mono font-bold ${getTimeWarning()} transition-all duration-300`}>
                    <div className="relative">
                      <Clock className="w-8 h-8" />
                      {timeLeft < 300 && (
                        <Sparkles className="w-4 h-4 text-red-500 absolute -top-1 -right-1 animate-ping" />
                      )}
                    </div>
                    <span>{formatTime(timeLeft)}</span>
                    {timeLeft < 300 && (
                      <Badge variant="destructive" className="animate-pulse">
                        Time Critical!
                      </Badge>
                    )}
                  </div>

                  {/* Progress */}
                  <div className="flex-1 max-w-2xl space-y-2">
                    <div className="flex justify-between text-sm font-semibold text-gray-700">
                      <span>Progress</span>
                      <span>{answeredQuestions}/{totalQuestions} ({progress.toFixed(0)}%)</span>
                    </div>
                    <Progress 
                      value={progress} 
                      className="h-3 rounded-full bg-gray-200 transition-all duration-500"
                    />
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-4 text-sm font-semibold">
                    <div className="text-green-600 flex items-center gap-1">
                      <CheckCircle className="w-4 h-4" />
                      {answers.filter(a => a.isCorrect).length}
                    </div>
                    <div className="text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {answers.filter(a => !a.isCorrect).length}
                    </div>
                    <div className="text-gray-600 flex items-center gap-1">
                      <Target className="w-4 h-4" />
                      {totalQuestions - answeredQuestions}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Enhanced Question Navigator */}
            <Card className="shadow-lg border-0">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4 text-lg font-semibold text-gray-800">
                  <Brain className="w-5 h-5 text-purple-600" />
                  Question Navigator
                </div>
                <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2">
                  {questions.map((q, idx) => {
                    const answer = answers.find(a => a.questionId === q._id)
                    const isCurrent = idx === currentQuestionIndex
                    let statusClass = "bg-gray-200 hover:bg-gray-300 text-gray-700"
                    
                    if (answer) {
                      statusClass = answer.isCorrect 
                        ? "bg-green-500 hover:bg-green-600 text-white shadow-sm" 
                        : "bg-red-500 hover:bg-red-600 text-white shadow-sm"
                    } else if (isCurrent) {
                      statusClass = "bg-purple-500 text-white shadow-lg transform scale-110"
                    }

                    return (
                      <button
                        key={idx}
                        className={`${statusClass} rounded-lg p-3 font-bold transition-all duration-300 transform hover:scale-110 active:scale-95 flex items-center justify-center text-sm shadow-md`}
                        onClick={() => handleQuestionNavigation(idx)}
                      >
                        {idx + 1}
                      </button>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Enhanced Question Card */}
            {currentQuestion && (
              <Card className={`shadow-2xl border-0 transform transition-all duration-500 ${
                isAnimating ? 'scale-95 opacity-50' : 'scale-100 opacity-100'
              }`}>
                <CardContent className="p-8 space-y-6">
                  {/* Question Header */}
                  <div className="flex justify-between items-start gap-4 mb-6">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl font-bold text-purple-600 bg-purple-100 px-4 py-2 rounded-full">
                        {currentQuestionIndex + 1}
                      </span>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          {getDifficultyBadge(currentQuestion.difficulty)}
                          <Badge variant="outline" className="text-gray-600">
                            {currentQuestion.marks || 1} mark{currentQuestion.marks !== 1 ? 's' : ''}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-500">Question {currentQuestionIndex + 1} of {totalQuestions}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Star className="w-6 h-6 text-yellow-400 cursor-pointer hover:scale-110 transition-transform" />
                    </div>
                  </div>

                  {/* Question Text */}
                  <h3 className="text-xl font-semibold text-gray-800 leading-relaxed">
                    {currentQuestion.text}
                  </h3>

                  {/* Question Image */}
                  {currentQuestion.imageUrl && (
                    <div className="flex justify-center">
                      <img 
                        src={currentQuestion.imageUrl} 
                        alt="Question visual aid" 
                        className="rounded-xl shadow-lg max-w-full h-auto max-h-80 object-contain border"
                      />
                    </div>
                  )}

                  {/* Options */}
                  <div className="space-y-3">
                    {currentQuestion.options.map((option, index) => {
                      const isSelected = getCurrentAnswer()?.selectedOption === option
                      const isCorrect = option === currentQuestion.correctAnswer
                      const letters = ['A', 'B', 'C', 'D']
                      
                      let optionStyle = "border-2 border-gray-200 hover:border-purple-300 hover:bg-purple-50 text-gray-700"
                      if (isSelected) {
                        optionStyle = "border-2 border-purple-500 bg-purple-100 text-purple-700 shadow-md"
                      }

                      return (
                        <button
                          key={option}
                          className={`w-full text-left p-4 rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 font-medium ${optionStyle}`}
                          onClick={() => handleAnswerSelect(option)}
                        >
                          <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-lg ${
                              isSelected 
                                ? 'bg-purple-500 text-white shadow-md' 
                                : 'bg-gray-100 text-gray-600 border'
                            }`}>
                              {letters[index]}
                            </div>
                            <span className="flex-1 text-lg">{option}</span>
                            {isSelected && (
                              <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                                <div className="w-2 h-2 bg-white rounded-full"></div>
                              </div>
                            )}
                          </div>
                        </button>
                      )
                    })}
                  </div>

                  {/* Hints */}
                  {currentQuestion.hints && (
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                      <div className="flex items-center gap-2 text-amber-800 font-semibold mb-2">
                        <Lightbulb className="w-4 h-4" />
                        Hint
                      </div>
                      <p className="text-amber-700 text-sm">{currentQuestion.hints.join(", ")}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Enhanced Navigation Buttons */}
            <div className="flex justify-between items-center gap-4">
              <Button 
                onClick={handlePreviousQuestion} 
                disabled={currentQuestionIndex === 0}
                variant="outline"
                className="flex items-center gap-2 px-6 py-3 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-105"
              >
                <ArrowLeft className="w-5 h-5" />
                Previous
              </Button>
              
              <div className="flex items-center gap-2 text-sm font-semibold text-gray-600">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                Answered: {answeredQuestions}
              </div>

              {currentQuestionIndex < totalQuestions - 1 ? (
                <Button 
                  onClick={handleNextQuestion}
                  className="flex items-center gap-2 px-8 py-3 text-lg font-semibold bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transition-all duration-300 hover:scale-105 shadow-lg"
                >
                  Next
                  <ArrowRight className="w-5 h-5" />
                </Button>
              ) : (
                <Button 
                  variant="destructive"
                  onClick={() => setShowConfirmation(true)}
                  className="flex items-center gap-2 px-8 py-3 text-lg font-semibold bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 transition-all duration-300 hover:scale-105 shadow-lg"
                >
                  <Target className="w-5 h-5" />
                  Submit Exam
                </Button>
              )}
            </div>
          </div>

          {/* Enhanced Confirmation Modal */}
          {showConfirmation && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
              <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl transform animate-in zoom-in-95 duration-300 space-y-6 border border-purple-200">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center mx-auto shadow-lg">
                    <Target className="w-8 h-8 text-white" />
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-2xl font-bold text-gray-800">Submit Exam?</h4>
                    <p className="text-gray-600 leading-relaxed">
                      Are you sure you want to submit your exam? This action cannot be undone. 
                      You have answered {answeredQuestions} out of {totalQuestions} questions.
                    </p>
                  </div>
                </div>
                <div className="flex justify-center gap-3 pt-4">
                  <Button 
                    variant="outline" 
                    onClick={() => setShowConfirmation(false)}
                    className="px-6 py-2 border-gray-300 hover:bg-gray-50 transition-all duration-200"
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleSubmitExam} 
                    disabled={isSubmitting}
                    className="px-8 py-2 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 transition-all duration-200 shadow-lg"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Submitting...
                      </div>
                    ) : (
                      "Submit Exam"
                    )}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </StudentLayout>
    </ProtectedRoute>
  )
}