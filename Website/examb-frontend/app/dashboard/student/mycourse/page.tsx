"use client"

import { useEffect, useState } from "react"
import ProtectedRoute from "@/components/ProtectedRoute"
import StudentLayout from "@/components/StudentLayout"
import { studentService } from "@/services/studentService"
import { GraduationCap, BookOpen, Loader2, Star, Clock, Users, Award, PlayCircle, ChevronRight, Bookmark } from "lucide-react"

interface StudentSubscription {
  studentId: {
    _id: string
    name: string
    email: string
  }
  coursePaymentStatus: string
}

interface Course {
  _id: string
  name: string
  code: string
  description: string
  price: number
  subscribedStudents: StudentSubscription[]
  duration?: string
  level?: string
  rating?: number
  totalStudents?: number
  category?: string
}

export default function PaidCoursesPage() {
  const [paidCourses, setPaidCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPaidCourses = async () => {
      try {
        const studentId = await studentService.getCurrentStudentId()
        if (!studentId) {
          console.error("No logged-in student found.")
          return
        }

        const response = await studentService.getAllCourses()
        const allCourses: Course[] = response.data?.data || []

        const userPaidCourses = allCourses.filter((course) =>
          course.subscribedStudents.some(
            (sub) =>
              sub.studentId?._id === studentId &&
              sub.coursePaymentStatus === "paid"
          )
        )

        // Enhance courses with additional data for demo
        const enhancedCourses = userPaidCourses.map(course => ({
          ...course,
          duration: `${Math.floor(Math.random() * 20) + 10} hours`,
          level: ['Beginner', 'Intermediate', 'Advanced'][Math.floor(Math.random() * 3)],
          rating: Number((Math.random() * 2 + 3).toFixed(1)), // Random rating between 3.0-5.0
          totalStudents: Math.floor(Math.random() * 500) + 100,
          category: ['Development', 'Design', 'Business', 'Marketing', 'Lifestyle'][Math.floor(Math.random() * 5)]
        }))

        setPaidCourses(enhancedCourses)
      } catch (error) {
        console.error("Error fetching paid courses:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchPaidCourses()
  }, [])

  const getCategoryColor = (category: string = 'Development') => {
    const colors: { [key: string]: string } = {
      'Development': 'from-emerald-500 to-teal-600',
      'Design': 'from-pink-500 to-rose-600',
      'Business': 'from-blue-500 to-indigo-600',
      'Marketing': 'from-orange-500 to-red-500',
      'Lifestyle': 'from-purple-500 to-violet-600'
    }
    return colors[category] || 'from-gray-500 to-gray-600'
  }

  const getLevelColor = (level: string = 'Beginner') => {
    const colors: { [key: string]: string } = {
      'Beginner': 'bg-green-100 text-green-800',
      'Intermediate': 'bg-yellow-100 text-yellow-800',
      'Advanced': 'bg-red-100 text-red-800'
    }
    return colors[level] || 'bg-gray-100 text-gray-800'
  }

  return (
    <ProtectedRoute allowedRole="student">
      <StudentLayout>
        {/* 🌟 Enhanced Banner Section */}
        <div className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 text-white py-20 px-6 rounded-b-3xl shadow-2xl overflow-hidden">
          {/* Animated Background Elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-white/10 rounded-full blur-xl"></div>
            <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-white/10 rounded-full blur-xl"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white/5 rounded-full blur-2xl"></div>
          </div>
          
          <div className="relative max-w-5xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-white/20 rounded-full animate-ping"></div>
                <GraduationCap className="relative w-16 h-16 text-yellow-300 animate-bounce" />
              </div>
            </div>
            <h1 className="text-5xl font-black mb-4 tracking-tight bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
              My Learning Journey
            </h1>
            <p className="text-blue-100 text-xl font-light max-w-2xl mx-auto leading-relaxed">
              Continue your educational adventure with the courses you've invested in. Your success story starts here!
            </p>
            
            {/* Stats Bar */}
            <div className="mt-8 flex justify-center items-center space-x-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-300">{paidCourses.length}</div>
                <div className="text-blue-100 text-sm">Courses Owned</div>
              </div>
              <div className="w-px h-8 bg-white/30"></div>
              <div className="text-center">
                <div className="text-2xl font-bold text-emerald-300">{paidCourses.reduce((acc, course) => acc + (course.totalStudents || 0), 0).toLocaleString()}</div>
                <div className="text-blue-100 text-sm">Fellow Learners</div>
              </div>
            </div>
          </div>
        </div>

        {/* 🎓 Enhanced Course List Section */}
        <div className="max-w-7xl mx-auto px-6 py-12">
          {loading ? (
            <div className="flex flex-col items-center justify-center min-h-96">
              <div className="relative">
                <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
                <div className="absolute inset-0 border-4 border-blue-200 border-t-blue-600 rounded-full animate-pulse"></div>
              </div>
              <p className="text-gray-600 text-lg font-medium mt-4 animate-pulse">
                Loading your learning treasures...
              </p>
            </div>
          ) : paidCourses.length === 0 ? (
            <div className="text-center py-20">
              <div className="relative inline-block mb-6">
                <BookOpen className="w-20 h-20 text-gray-300" />
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">!</span>
                </div>
              </div>
              <h2 className="text-2xl font-bold text-gray-700 mb-3">
                No Courses Yet
              </h2>
              <p className="text-gray-500 max-w-md mx-auto mb-6">
                Your learning collection is empty. Discover amazing courses and start your journey to mastery!
              </p>
              <button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300">
                Explore Courses
              </button>
            </div>
          ) : (
            <>
              {/* Header with Filter Options */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">Your Courses</h2>
                  <p className="text-gray-600">Continue where you left off</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg font-medium hover:bg-blue-100 transition-colors">
                    All Courses
                  </button>
                  <button className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg font-medium hover:bg-gray-200 transition-colors">
                    In Progress
                  </button>
                  <button className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg font-medium hover:bg-gray-200 transition-colors">
                    Completed
                  </button>
                </div>
              </div>

              {/* Enhanced Course Grid */}
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
                {paidCourses.map((course) => (
                  <div
                    key={course._id}
                    className="group relative bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100 overflow-hidden"
                  >
                    {/* Premium Badge */}
                    <div className="absolute top-4 right-4 z-10">
                      <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg flex items-center gap-1">
                        <Award className="w-3 h-3" />
                        PAID
                      </div>
                    </div>

                    {/* Bookmark */}
                    <button className="absolute top-4 left-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Bookmark className="w-5 h-5 text-gray-400 hover:text-red-500 transition-colors fill-current" />
                    </button>

                    {/* Course Image/Header */}
                    <div className={`h-32 bg-gradient-to-r ${getCategoryColor(course.category)} relative overflow-hidden`}>
                      <div className="absolute inset-0 bg-black/20"></div>
                      <div className="absolute bottom-4 left-4">
                        <span className="text-white/90 text-sm font-medium bg-black/20 backdrop-blur-sm px-3 py-1 rounded-full">
                          {course.category}
                        </span>
                      </div>
                    </div>

                    {/* Course Content */}
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${getLevelColor(course.level)}`}>
                          {course.level}
                        </span>
                        <div className="flex items-center gap-1 text-amber-500">
                          <Star className="w-4 h-4 fill-current" />
                          <span className="text-sm font-semibold">{course.rating}</span>
                        </div>
                      </div>

                      <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                        {course.name}
                      </h3>
                      <p className="text-gray-600 text-sm line-clamp-2 mb-4 leading-relaxed">
                        {course.description}
                      </p>

                      {/* Course Meta */}
                      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>{course.duration}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            <span>{(course.totalStudents || 0).toLocaleString()}</span>
                          </div>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="mb-4">
                        <div className="flex justify-between text-xs text-gray-500 mb-1">
                          <span>Course Progress</span>
                          <span>{Math.floor(Math.random() * 100)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-green-400 to-emerald-500 h-2 rounded-full transition-all duration-1000 ease-out"
                            style={{ width: `${Math.floor(Math.random() * 100)}%` }}
                          ></div>
                        </div>
                      </div>

                      {/* Action Button */}
                      <button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 group/btn">
                        <PlayCircle className="w-5 h-5" />
                        Continue Learning
                        <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                      </button>
                    </div>

                    {/* Hover Effect Border */}
                    <div className="absolute inset-0 rounded-3xl border-2 border-transparent group-hover:border-blue-200 transition-colors duration-300 pointer-events-none"></div>
                  </div>
                ))}
              </div>

              {/* Footer Stats */}
              <div className="mt-12 text-center">
                <div className="inline-flex items-center gap-6 bg-gradient-to-r from-blue-50 to-purple-50 px-8 py-6 rounded-2xl shadow-lg">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{paidCourses.length}</div>
                    <div className="text-gray-600 text-sm">Total Courses</div>
                  </div>
                  <div className="w-px h-12 bg-gray-300"></div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {paidCourses.reduce((acc, course) => acc + course.price, 0).toLocaleString()} ETB
                    </div>
                    <div className="text-gray-600 text-sm">Total Investment</div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </StudentLayout>
    </ProtectedRoute>
  )
}