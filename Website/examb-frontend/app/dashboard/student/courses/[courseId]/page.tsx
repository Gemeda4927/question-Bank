"use client"
import { useEffect, useState } from "react"
import { studentService } from "@/services/studentService"
import { useRouter } from "next/navigation"
import ProtectedRoute from "@/components/ProtectedRoute"
import StudentLayout from "@/components/StudentLayout"
import {
  ArrowLeft,
  BookOpen,
  FileText,
  Clock,
  Award,
  Calendar,
  MapPin,
  Play,
  XCircle,
  Zap,
  Target,
  BarChart3,
  Star,
  Users,
  Bookmark,
  Share2,
  Eye,
  Sparkles,
  Brain,
  Trophy,
  Lightbulb,
  TrendingUp,
} from "lucide-react"

interface CoursePageProps {
  params: Promise<{ courseId: string }>
}

export default function CoursePage({ params }: CoursePageProps) {
  const [course, setCourse] = useState<any>(null)
  const [exams, setExams] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [resolvedParams, setResolvedParams] = useState<{ courseId: string } | null>(null)
  const [isBookmarked, setIsBookmarked] = useState(false)

  const router = useRouter()

  useEffect(() => {
    const resolveParams = async () => {
      const resolved = await params
      setResolvedParams(resolved)
    }
    resolveParams()
  }, [params])

  useEffect(() => {
    if (resolvedParams) {
      fetchCourse()
      fetchExams()
    }
  }, [resolvedParams])

  const fetchCourse = async () => {
    if (!resolvedParams) return
    try {
      setLoading(true)
      const response = await studentService.getAllCourses()
      const allCourses = response.data.data || response.data
      const foundCourse = allCourses.find((c: any) => c._id === resolvedParams.courseId)
      if (!foundCourse) setError("Course not found")
      else setCourse(foundCourse)
    } catch (err: any) {
      console.error(err)
      setError(err.response?.data?.message || "Failed to load course")
    } finally {
      setLoading(false)
    }
  }

  const fetchExams = async () => {
    if (!resolvedParams) return
    try {
      const response = await studentService.getAllExams()
      const allExams = response.data.data || response.data
      const filteredExams = allExams.filter((exam: any) => exam.courseId?._id === resolvedParams.courseId)
      setExams(filteredExams)
    } catch (error: any) {
      console.error("Error fetching exams:", error)
    }
  }

  const handleTakeExam = (examId: string) => {
    router.push(`../exams/${examId}/questions`)

    // http://localhost:3000/dashboard/student/exams/68efe2594d9baa474f41ec09/questions
  }

  const getDifficultyColor = (level: string) => {
    switch (level?.toLowerCase()) {
      case 'easy': return 'from-emerald-400 to-teal-500'
      case 'medium': return 'from-amber-400 to-orange-500'
      case 'hard': return 'from-rose-400 to-red-500'
      case 'expert': return 'from-indigo-400 to-purple-500'
      default: return 'from-slate-400 to-gray-500'
    }
  }

  const getDifficultyText = (level: string) => {
    switch (level?.toLowerCase()) {
      case 'easy': return 'Easy'
      case 'medium': return 'Medium'
      case 'hard': return 'Hard'
      case 'expert': return 'Expert'
      default: return level || 'Not Specified'
    }
  }

  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes} minutes`
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return mins > 0 ? `${hours}h ${mins}m` : `${hours} hour${hours > 1 ? 's' : ''}`
  }

  if (loading || !resolvedParams) {
    return (
      <ProtectedRoute allowedRole="student">
        <StudentLayout>
          <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50/30 flex items-center justify-center">
            <div className="text-center space-y-6">
              <div className="relative">
                <div className="w-20 h-20 animate-spin rounded-full border-4 border-t-purple-600 border-gray-200"></div>
                <Sparkles className="w-8 h-8 text-purple-500 absolute -top-2 -right-2 animate-pulse" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-gray-800">Loading Course</h3>
                <p className="text-gray-600 max-w-md">Preparing an amazing learning experience for you...</p>
              </div>
            </div>
          </div>
        </StudentLayout>
      </ProtectedRoute>
    )
  }

  if (error || !course) {
    return (
      <ProtectedRoute allowedRole="student">
        <StudentLayout>
          <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50/30 flex items-center justify-center p-4">
            <div className="bg-white/95 backdrop-blur-lg rounded-3xl p-12 border border-red-100 shadow-2xl text-center max-w-lg mx-auto transform hover:scale-[1.02] transition-all duration-300">
              <div className="w-24 h-24 bg-gradient-to-br from-red-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <XCircle className="w-12 h-12 text-red-500" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">{error || "Course not found"}</h3>
              <p className="text-gray-600 mb-8 text-lg">We couldn't find the course you're looking for.</p>
              <button
                onClick={() => router.back()}
                className="px-8 py-4 bg-gradient-to-r from-purple-500 to-cyan-500 text-white rounded-2xl font-semibold hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center gap-2 mx-auto"
              >
                <ArrowLeft className="w-5 h-5" />
                Back to Courses
              </button>
            </div>
          </div>
        </StudentLayout>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute allowedRole="student">
      <StudentLayout>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50/30">
          <div className="max-w-7xl mx-auto space-y-8 p-6">
            {/* Navigation */}
            <div className="flex items-center justify-between">
              <button
                onClick={() => router.back()}
                className="group flex items-center gap-3 text-gray-600 hover:text-purple-600 font-semibold transition-all duration-300 px-6 py-3 rounded-2xl hover:bg-white hover:shadow-lg border border-transparent hover:border-purple-100"
              >
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" /> 
                Back to Courses
              </button>
              
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setIsBookmarked(!isBookmarked)}
                  className={`p-3 rounded-2xl transition-all duration-300 ${
                    isBookmarked 
                      ? 'bg-amber-50 text-amber-500 border border-amber-200 shadow-lg' 
                      : 'bg-white text-gray-400 hover:text-amber-500 hover:bg-amber-50 border border-gray-200 hover:border-amber-200'
                  }`}
                >
                  <Bookmark className={`w-5 h-5 ${isBookmarked ? 'fill-current' : ''}`} />
                </button>
                <button className="p-3 rounded-2xl bg-white text-gray-400 hover:text-purple-600 hover:bg-purple-50 border border-gray-200 hover:border-purple-200 transition-all duration-300">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Course Header */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-600 via-indigo-600 to-cyan-600 text-white shadow-2xl">
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -translate-y-48 translate-x-48"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-300/20 rounded-full -translate-x-32 translate-y-32"></div>
              
              <div className="relative z-10 p-8 lg:p-12">
                <div className="flex flex-col lg:flex-row items-start gap-8">
                  <div className="flex-1 space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="w-20 h-20 bg-white/20 rounded-3xl flex items-center justify-center backdrop-blur-sm border border-white/30 shadow-2xl">
                        <BookOpen className="w-10 h-10" />
                      </div>
                      <div className="flex-1">
                        <h1 className="text-4xl lg:text-5xl font-bold mb-2 leading-tight bg-gradient-to-r from-white to-cyan-100 bg-clip-text text-transparent">
                          {course.name}
                        </h1>
                        <p className="text-purple-100 font-medium text-lg opacity-90">{course.code}</p>
                      </div>
                    </div>
                    
                    {course.description && (
                      <p className="text-purple-100 text-lg leading-relaxed max-w-4xl opacity-95">
                        {course.description}
                      </p>
                    )}
                    
                    <div className="flex flex-wrap gap-4">
                      <span className="px-5 py-3 rounded-2xl bg-white/20 backdrop-blur-sm font-semibold text-sm border border-white/30 shadow-lg flex items-center gap-3">
                        <Award className="w-5 h-5" /> Level: {course.level || "N/A"}
                      </span>
                      <span className="px-5 py-3 rounded-2xl bg-white/20 backdrop-blur-sm font-semibold text-sm border border-white/30 shadow-lg flex items-center gap-3">
                        <Calendar className="w-5 h-5" /> Semester: {course.semester || "N/A"}
                      </span>
                      <span className="px-5 py-3 rounded-2xl bg-white/20 backdrop-blur-sm font-semibold text-sm border border-white/30 shadow-lg flex items-center gap-3">
                        <Users className="w-5 h-5" /> 1.2K Students
                      </span>
                    </div>
                  </div>
                  
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <Star className="w-6 h-6 text-amber-300" />
                        <span className="text-lg font-bold">4.8/5.0 Rating</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Eye className="w-6 h-6 text-cyan-300" />
                        <span className="text-lg font-bold">95% Completion</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Trophy className="w-6 h-6 text-purple-300" />
                        <span className="text-lg font-bold">Expert Level</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Progress Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Your Progress</p>
                    <p className="text-2xl font-bold text-gray-800">68%</p>
                  </div>
                </div>
                <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-gradient-to-r from-emerald-400 to-teal-500 h-2 rounded-full w-2/3"></div>
                </div>
              </div>
              
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center">
                    <Brain className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Exams Completed</p>
                    <p className="text-2xl font-bold text-gray-800">3/5</p>
                  </div>
                </div>
                <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-gradient-to-r from-blue-400 to-cyan-500 h-2 rounded-full w-3/5"></div>
                </div>
              </div>
              
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center">
                    <Lightbulb className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Average Score</p>
                    <p className="text-2xl font-bold text-gray-800">84%</p>
                  </div>
                </div>
                <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-gradient-to-r from-purple-400 to-pink-500 h-2 rounded-full w-4/5"></div>
                </div>
              </div>
            </div>

            {/* Exams Section */}
            <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
              <div className="p-8 border-b border-gray-200 bg-gradient-to-r from-purple-50 via-white to-cyan-50">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg">
                      <Target className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold text-gray-800">Available Exams</h2>
                      <p className="text-gray-600 text-lg mt-2">Test your knowledge and track your progress</p>
                    </div>
                  </div>
                  <div className="text-center lg:text-right">
                    <p className="text-3xl font-bold text-purple-600">{exams.length} Exams</p>
                    <p className="text-gray-500 text-lg">Ready to take</p>
                  </div>
                </div>
              </div>

              <div className="p-8 space-y-8">
                {exams.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="w-32 h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                      <FileText className="w-12 h-12 text-gray-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-700 mb-3">No Exams Available</h3>
                    <p className="text-gray-500 max-w-md mx-auto text-lg">
                      There are no exams available for this course yet. Please check back later.
                    </p>
                  </div>
                ) : (
                  <div className="grid gap-8">
                    {exams.map((exam: any, index: number) => {
                      const difficulty = exam.difficulty || 'medium'
                      const isNew = index < 2 // Mark first two exams as new
                      
                      return (
                        <div
                          key={exam._id}
                          className="group relative bg-gradient-to-br from-white to-gray-50 rounded-3xl border border-gray-200 hover:border-purple-200 shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden"
                        >
                          {isNew && (
                            <div className="absolute top-6 right-6 z-10">
                              <span className="px-4 py-2 bg-gradient-to-r from-green-400 to-emerald-500 text-white text-sm font-bold rounded-full shadow-lg flex items-center gap-2">
                                <Sparkles className="w-4 h-4" />
                                NEW
                              </span>
                            </div>
                          )}
                          
                          <div className="p-8">
                            <div className="flex flex-col lg:flex-row justify-between items-start gap-8">
                              {/* Exam Info */}
                              <div className="flex-1 space-y-6">
                                <div className="flex items-start gap-6">
                                  <div className={`w-20 h-20 rounded-2xl flex items-center justify-center shadow-xl bg-gradient-to-r ${getDifficultyColor(difficulty)}`}>
                                    <Zap className="w-8 h-8 text-white" />
                                  </div>
                                  <div className="flex-1">
                                    <div className="flex items-center gap-4 mb-3">
                                      <h3 className="text-3xl font-bold text-gray-800">{exam.name}</h3>
                                      <span className={`px-4 py-2 rounded-full text-sm font-bold bg-gradient-to-r ${getDifficultyColor(difficulty)} text-white shadow-lg`}>
                                        {getDifficultyText(difficulty)}
                                      </span>
                                    </div>
                                    <p className="text-gray-600 text-lg leading-relaxed mb-6">{exam.description}</p>
                                    
                                    {/* Exam Metadata Grid */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                                      <div className="flex items-center gap-4 p-4 bg-white rounded-2xl shadow-sm border border-gray-100">
                                        <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center">
                                          <Clock className="w-7 h-7 text-blue-600" />
                                        </div>
                                        <div>
                                          <p className="font-medium text-sm text-gray-600">Duration</p>
                                          <p className="font-semibold text-lg">{formatDuration(exam.duration)}</p>
                                        </div>
                                      </div>
                                      
                                      <div className="flex items-center gap-4 p-4 bg-white rounded-2xl shadow-sm border border-gray-100">
                                        <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center">
                                          <Award className="w-7 h-7 text-green-600" />
                                        </div>
                                        <div>
                                          <p className="font-medium text-sm text-gray-600">Total Marks</p>
                                          <p className="font-semibold text-lg">{exam.totalMarks} Points</p>
                                        </div>
                                      </div>
                                      
                                      <div className="flex items-center gap-4 p-4 bg-white rounded-2xl shadow-sm border border-gray-100">
                                        <div className="w-14 h-14 bg-amber-100 rounded-2xl flex items-center justify-center">
                                          <BarChart3 className="w-7 h-7 text-amber-600" />
                                        </div>
                                        <div>
                                          <p className="font-medium text-sm text-gray-600">Questions</p>
                                          <p className="font-semibold text-lg">{exam.questions?.length || 'N/A'}</p>
                                        </div>
                                      </div>

                                      <div className="flex items-center gap-4 p-4 bg-white rounded-2xl shadow-sm border border-gray-100">
                                        <div className="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center">
                                          <BookOpen className="w-7 h-7 text-purple-600" />
                                        </div>
                                        <div>
                                          <p className="font-medium text-sm text-gray-600">Type</p>
                                          <p className="font-semibold text-lg">{exam.type || 'General'}</p>
                                        </div>
                                      </div>
                                    </div>
                                    
                                    {/* Additional Info */}
                                    <div className="flex flex-wrap gap-3">
                                      {exam.universityId?.name && (
                                        <span className="px-5 py-3 rounded-2xl bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 font-medium text-base flex items-center gap-3 border border-blue-100 shadow-sm">
                                          <MapPin className="w-5 h-5" /> 
                                          {exam.universityId.name}
                                        </span>
                                      )}
                                      {exam.code && (
                                        <span className="px-5 py-3 rounded-2xl bg-gray-100 text-gray-700 font-medium text-base border border-gray-200 shadow-sm">
                                          Code: {exam.code}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Action Button */}
                              <div className="flex flex-col gap-4 min-w-[220px]">



                                <button
                                  onClick={() => handleTakeExam(exam._id)}
                                  className="px-8 py-4 bg-gradient-to-r from-purple-500 to-cyan-500 text-white rounded-2xl font-bold hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3 group relative overflow-hidden"
                                >
                                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                  <div className="relative z-10 flex items-center gap-3">
                                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                                      <Play className="w-4 h-4 text-white" />
                                    </div>
                                    <span className="text-lg">Take Exam</span>
                                  </div>
                                </button>







                                <button className="px-6 py-3 text-gray-600 hover:text-purple-600 font-semibold rounded-xl hover:bg-purple-50 border border-gray-200 hover:border-purple-200 transition-all duration-300 flex items-center justify-center gap-2">
                                  <Eye className="w-5 h-5" />
                                  Preview Exam
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </StudentLayout>
    </ProtectedRoute>
  )
}