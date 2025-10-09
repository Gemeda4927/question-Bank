"use client"
import { useState } from "react"
import type React from "react"

import api from "@/lib/api"
import { useRouter } from "next/navigation"
import { AxiosError } from "axios"
import { BookOpen, Mail, Lock, User, ArrowRight, Loader2, CheckCircle, Sparkles, Award, Target } from "lucide-react"

export default function SignupPage() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState<"student" | "instructor">("student")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setLoading(true)

    try {
      const { data } = await api.post("/users/signup", {
        name,
        email,
        password,
        role,
      })

      localStorage.setItem("token", data.token)
      setSuccess("Account created successfully! Redirecting...")

      setTimeout(() => {
        if (role === "instructor") router.push("/dashboard/admin")
        else router.push("/dashboard/student")
      }, 1500)
    } catch (err: unknown) {
      if (err instanceof AxiosError) setError(err.response?.data?.message || "Signup failed")
      else if (err instanceof Error) setError(err.message)
      else setError("Signup failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-pink-50 to-purple-50 flex items-center justify-center px-4 py-12 relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 right-10 w-96 h-96 bg-cyan-400/30 rounded-full blur-3xl animate-pulse-glow"></div>
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-purple-400/30 rounded-full blur-3xl animate-pulse-glow delay-500"></div>
        <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-pink-400/20 rounded-full blur-3xl animate-float"></div>
      </div>

      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-12 items-center relative z-10">
        {/* Left side - Signup Form */}
        <div className="w-full animate-slideInLeft order-2 lg:order-1">
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 md:p-12 border-2 border-cyan-100/50">
            {/* Mobile logo */}
            <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-600 via-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <BookOpen className="w-7 h-7 text-white" />
              </div>
              <span className="text-3xl font-black bg-gradient-to-r from-cyan-600 via-purple-500 to-purple-600 bg-clip-text text-transparent">
                ExamB
              </span>
            </div>

            <div className="mb-8">
              <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-3">Create account</h2>
              <p className="text-gray-600 font-medium">Join thousands of users on ExamB</p>
            </div>

            <form onSubmit={handleSignup} className="space-y-5">
              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-700">Full Name</label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-cyan-600 transition-colors" />
                  <input
                    type="text"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100 transition-all text-gray-900 placeholder:text-gray-400 font-medium hover:border-cyan-300"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-700">Email</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-cyan-600 transition-colors" />
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100 transition-all text-gray-900 placeholder:text-gray-400 font-medium hover:border-cyan-300"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-700">Password</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-cyan-600 transition-colors" />
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100 transition-all text-gray-900 placeholder:text-gray-400 font-medium hover:border-cyan-300"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-700">I am a...</label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setRole("student")}
                    className={`py-4 px-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
                      role === "student"
                        ? "bg-gradient-to-r from-purple-600 via-purple-500 to-cyan-600 text-white shadow-xl scale-105"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105"
                    }`}
                  >
                    <Target className="w-5 h-5" />
                    Student
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole("instructor")}
                    className={`py-4 px-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
                      role === "instructor"
                        ? "bg-gradient-to-r from-cyan-600 via-purple-500 to-purple-600 text-white shadow-xl scale-105"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105"
                    }`}
                  >
                    <Award className="w-5 h-5" />
                    Instructor
                  </button>
                </div>
              </div>

              {error && (
                <div className="p-4 bg-gradient-to-r from-red-50 to-red-100 border-2 border-red-200 rounded-xl animate-fadeIn shadow-md">
                  <p className="text-red-700 text-sm font-bold">{error}</p>
                </div>
              )}

              {success && (
                <div className="p-4 bg-gradient-to-r from-green-50 to-green-100 border-2 border-green-200 rounded-xl animate-fadeIn flex items-center gap-3 shadow-md">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  <p className="text-green-700 text-sm font-bold">{success}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-cyan-600 via-purple-500 to-purple-600 text-white font-bold rounded-xl shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 relative overflow-hidden group"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span className="font-bold">Creating account...</span>
                  </>
                ) : (
                  <>
                    <span className="relative z-10 font-bold">Create Account</span>
                    <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-cyan-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-gray-600 font-medium">
                Already have an account?{" "}
                <button
                  onClick={() => router.push("/login")}
                  className="font-black text-transparent bg-gradient-to-r from-cyan-600 to-purple-600 bg-clip-text hover:from-purple-600 hover:to-cyan-600 transition-all"
                >
                  Sign in
                </button>
              </p>
            </div>
          </div>
        </div>

        {/* Right side - Branding */}
        <div className="hidden lg:block space-y-8 animate-slideInRight order-1 lg:order-2">
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="w-16 h-16 bg-gradient-to-br from-cyan-600 via-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl group-hover:scale-110 group-hover:rotate-6 transition-all">
              <BookOpen className="w-10 h-10 text-white" />
            </div>
            <span className="text-4xl font-black bg-gradient-to-r from-cyan-600 via-purple-500 to-purple-600 bg-clip-text text-transparent">
              ExamB
            </span>
          </div>

          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-100 to-purple-100 text-cyan-700 rounded-full text-sm font-bold">
              <Sparkles className="w-4 h-4" />
              Join Us Today
            </div>
            <h1 className="text-5xl md:text-6xl font-black text-gray-900 text-balance leading-tight">
              Start your journey with{" "}
              <span className="bg-gradient-to-r from-cyan-600 via-purple-500 to-purple-600 bg-clip-text text-transparent">
                ExamB
              </span>
            </h1>
            <p className="text-xl text-gray-700 leading-relaxed text-pretty font-medium">
              Create your account and unlock the full potential of modern exam management.
            </p>
          </div>

          <div className="relative bg-gradient-to-br from-cyan-100 via-purple-50 to-purple-100 rounded-3xl shadow-2xl p-10 border-2 border-cyan-100/50">
            <div className="absolute -top-6 -right-6 w-32 h-32 bg-gradient-to-br from-cyan-500 via-purple-500 to-purple-500 rounded-full blur-3xl opacity-40 animate-pulse-glow"></div>
            <div className="space-y-6 relative z-10">
              <h3 className="text-2xl font-black text-gray-900 flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-purple-600" />
                What you'll get:
              </h3>
              <div className="space-y-5">
                {[
                  {
                    title: "Unlimited Exams",
                    desc: "Create and manage as many exams as you need",
                    color: "from-purple-600 to-purple-400",
                    bg: "bg-purple-100",
                  },
                  {
                    title: "Real-time Analytics",
                    desc: "Track performance with beautiful dashboards",
                    color: "from-cyan-600 to-cyan-400",
                    bg: "bg-cyan-100",
                  },
                  {
                    title: "24/7 Support",
                    desc: "Get help whenever you need it",
                    color: "from-pink-600 to-pink-400",
                    bg: "bg-pink-100",
                  },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-4 p-4 bg-white/80 backdrop-blur-sm rounded-2xl hover:shadow-lg transition-all group"
                  >
                    <div
                      className={`w-10 h-10 bg-gradient-to-br ${item.color} rounded-xl flex items-center justify-center flex-shrink-0 mt-1 group-hover:scale-110 transition-transform shadow-md`}
                    >
                      <CheckCircle className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="font-black text-gray-900 text-lg">{item.title}</div>
                      <div className="text-sm text-gray-700 font-medium">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
