"use client"
import { useState, useEffect } from "react"
import AdminLayout from "@/components/AdminLayout"
import ProtectedRoute from "@/components/ProtectedRoute"
import DataTable from "@/components/DataTable"
import { adminService } from "@/services/adminService"
import QuestionForm from "@/components/forms/QuestionForm"
import {
  HelpCircle,
  Award,
  Tag,
  BookOpen,
  CheckCircle,
  XCircle,
  Sparkles,
  Brain,
  Target,
  TrendingUp,
  Zap,
} from "lucide-react"
import { motion } from "framer-motion"

export default function QuestionsPage() {
  const [stats, setStats] = useState({
    total: 0,
    multipleChoice: 0,
    trueFalse: 0,
    essay: 0,
    shortAnswer: 0,
  })

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await adminService.getQuestions()
        const questions = response.data?.data || response.data || []

        const calculated = {
          total: questions.length,
          multipleChoice: questions.filter((q: any) => q.questionType === "multiple-choice").length,
          trueFalse: questions.filter((q: any) => q.questionType === "true-false").length,
          essay: questions.filter((q: any) => q.questionType === "essay").length,
          shortAnswer: questions.filter((q: any) => q.questionType === "short-answer").length,
        }

        setStats(calculated)
      } catch (error) {
        console.error("Failed to fetch question stats:", error)
      }
    }

    fetchStats()
  }, [])

  const questionColumns = [
    {
      key: "questionText",
      label: "Question",
      render: (value: string) => (
        <div className="max-w-md">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
              <Brain className="w-4 h-4 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 line-clamp-2 leading-relaxed">{value}</p>
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "examId",
      label: "Exam",
      render: (value: any) => (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-lg flex items-center justify-center">
            <BookOpen className="w-4 h-4 text-blue-600" />
          </div>
          <span className="text-sm font-semibold text-gray-700">{value?.name || value?.code || "N/A"}</span>
        </div>
      ),
    },
    {
      key: "questionType",
      label: "Type",
      render: (value: string) => {
        const typeConfig: Record<string, { icon: any; color: string; bg: string }> = {
          "multiple-choice": { icon: Target, color: "text-purple-700", bg: "bg-purple-100 border-purple-200" },
          "true-false": { icon: CheckCircle, color: "text-green-700", bg: "bg-green-100 border-green-200" },
          "short-answer": { icon: Tag, color: "text-blue-700", bg: "bg-blue-100 border-blue-200" },
          essay: { icon: Sparkles, color: "text-pink-700", bg: "bg-pink-100 border-pink-200" },
        }
        const config = typeConfig[value] || { icon: Tag, color: "text-gray-700", bg: "bg-gray-100 border-gray-200" }
        const Icon = config.icon

        return (
          <span
            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${config.bg} border-2 text-xs font-bold ${config.color}`}
          >
            <Icon className="w-3.5 h-3.5" />
            {value
              .split("-")
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(" ")}
          </span>
        )
      },
    },
    {
      key: "marks",
      label: "Marks",
      render: (value: number) => (
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-xl flex items-center justify-center border-2 border-yellow-200">
            <Award className="w-5 h-5 text-yellow-600" />
          </div>
          <div>
            <p className="text-lg font-black text-gray-900">{value}</p>
            <p className="text-xs text-gray-500 font-medium">points</p>
          </div>
        </div>
      ),
    },
    {
      key: "correctAnswer",
      label: "Answer",
      render: (value: string, row: any) => {
        if (row.questionType === "multiple-choice" && row.options) {
          const optionIndex = row.options.indexOf(value)
          return (
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-md">
                {optionIndex >= 0 ? String.fromCharCode(65 + optionIndex) : "?"}
              </div>
              <span className="text-sm text-gray-600 line-clamp-1 max-w-[200px]">{value || "N/A"}</span>
            </div>
          )
        }
        if (row.questionType === "true-false") {
          return (
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                value?.toLowerCase() === "true"
                  ? "bg-green-100 text-green-700 border-2 border-green-200"
                  : "bg-red-100 text-red-700 border-2 border-red-200"
              }`}
            >
              {value?.toLowerCase() === "true" ? (
                <CheckCircle className="w-3.5 h-3.5" />
              ) : (
                <XCircle className="w-3.5 h-3.5" />
              )}
              {value || "N/A"}
            </span>
          )
        }
        return <span className="text-sm text-gray-600 line-clamp-2 max-w-[200px]">{value || "N/A"}</span>
      },
    },
    {
      key: "createdAt",
      label: "Created",
      render: (value: string) => (
        <div className="text-sm">
          <p className="font-semibold text-gray-900">
            {new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
          </p>
          <p className="text-xs text-gray-500">
            {new Date(value).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
          </p>
        </div>
      ),
    },
  ]

  return (
    <ProtectedRoute allowedRole="admin">
      <AdminLayout>
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-24 -translate-x-24"></div>

            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-4">
                <motion.div
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.5 }}
                  className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center"
                >
                  <HelpCircle className="w-8 h-8" />
                </motion.div>
                <div>
                  <h1 className="text-4xl font-black mb-1">Questions Management</h1>
                  <p className="text-purple-100 text-lg font-medium flex items-center gap-2">
                    <Zap className="w-5 h-5" />
                    Create, organize, and manage exam questions with ease
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-6">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:bg-white/20 transition-all"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-5 h-5" />
                    <span className="text-sm font-medium">Total Questions</span>
                  </div>
                  <p className="text-3xl font-black">{stats.total}</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:bg-white/20 transition-all"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="w-5 h-5" />
                    <span className="text-sm font-medium">Multiple Choice</span>
                  </div>
                  <p className="text-3xl font-black">{stats.multipleChoice}</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:bg-white/20 transition-all"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="w-5 h-5" />
                    <span className="text-sm font-medium">True/False</span>
                  </div>
                  <p className="text-3xl font-black">{stats.trueFalse}</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:bg-white/20 transition-all"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-5 h-5" />
                    <span className="text-sm font-medium">Essay</span>
                  </div>
                  <p className="text-3xl font-black">{stats.essay}</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:bg-white/20 transition-all"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Tag className="w-5 h-5" />
                    <span className="text-sm font-medium">Short Answer</span>
                  </div>
                  <p className="text-3xl font-black">{stats.shortAnswer}</p>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <DataTable
            endpoint="getQuestions"
            title="All Questions"
            columns={questionColumns}
            service={adminService}
            createForm={QuestionForm}
          />
        </motion.div>
      </AdminLayout>
    </ProtectedRoute>
  )
}
