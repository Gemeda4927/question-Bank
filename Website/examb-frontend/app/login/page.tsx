"use client";
import { useState } from "react";
import type React from "react";

import api from "@/lib/api";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";
import {
  BookOpen,
  Mail,
  Lock,
  ArrowRight,
  Loader2,
  Sparkles,
  Shield,
  Zap,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { data } = await api.post("v1/users/login", { email, password });
      localStorage.setItem("token", data.token); // Store the token

      // Store the user data under "student" key
      const userData = {
        _id: data.user._id, // Assuming the API returns user._id
        name: data.user.name || "Unknown", // Adjust based on API response
        email: data.user.email || email, // Use provided email if name is missing
        role: data.user.role,
      };
      localStorage.setItem("student", JSON.stringify(userData));
      console.log("🟢 User data saved to localStorage:", userData);

      const role = data.user.role;
      if (role === "instructor" || role === "admin") {
        router.push("/dashboard/admin");
      } else {
        router.push("/dashboard/student");
      }
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        setError(err.response?.data?.message || "Login failed");
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Login failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-cyan-50 flex items-center justify-center px-4 py-12 relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-purple-400/30 rounded-full blur-3xl animate-pulse-glow"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-400/30 rounded-full blur-3xl animate-pulse-glow delay-500"></div>
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-pink-400/20 rounded-full blur-3xl animate-float"></div>
      </div>

      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-12 items-center relative z-10">
        {/* Left side - Branding */}
        <div className="hidden lg:block space-y-8 animate-slideInLeft">
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-600 via-purple-500 to-cyan-600 rounded-2xl flex items-center justify-center shadow-xl group-hover:scale-110 group-hover:rotate-6 transition-all">
              <BookOpen className="w-10 h-10 text-white" />
            </div>
            <span className="text-4xl font-black bg-gradient-to-r from-purple-600 via-pink-500 to-cyan-600 bg-clip-text text-transparent">
              ExamB
            </span>
          </div>

          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-100 to-cyan-100 text-purple-700 rounded-full text-sm font-bold">
              <Sparkles className="w-4 h-4" />
              Welcome Back
            </div>
            <h1 className="text-5xl md:text-6xl font-black text-gray-900 text-balance leading-tight">
              Welcome back to the{" "}
              <span className="bg-gradient-to-r from-purple-600 via-pink-500 to-cyan-600 bg-clip-text text-transparent">
                future of exams
              </span>
            </h1>
            <p className="text-xl text-gray-700 leading-relaxed text-pretty font-medium">
              Sign in to access your personalized dashboard and continue your learning journey.
            </p>
          </div>

          <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border-2 border-purple-100/50">
            <div className="absolute -top-6 -right-6 w-32 h-32 bg-gradient-to-br from-purple-500 via-pink-500 to-cyan-500 rounded-full blur-3xl opacity-40 animate-pulse-glow"></div>
            <div className="space-y-5 relative z-10">
              {[
                {
                  icon: <Sparkles className="w-6 h-6 text-purple-600" />,
                  text: "Beautiful, intuitive interface",
                  bg: "bg-purple-100",
                },
                {
                  icon: <Zap className="w-6 h-6 text-cyan-600" />,
                  text: "Lightning-fast performance",
                  bg: "bg-cyan-100",
                },
                {
                  icon: <Shield className="w-6 h-6 text-pink-600" />,
                  text: "Secure and reliable",
                  bg: "bg-pink-100",
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 p-4 bg-gradient-to-r from-gray-50 to-white rounded-2xl hover:shadow-lg transition-all group"
                >
                  <div
                    className={`w-12 h-12 ${item.bg} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-md`}
                  >
                    {item.icon}
                  </div>
                  <span className="font-bold text-gray-800">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right side - Login Form */}
        <div className="w-full animate-slideInRight">
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 md:p-12 border-2 border-purple-100/50">
            {/* Mobile logo */}
            <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-600 via-purple-500 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg">
                <BookOpen className="w-7 h-7 text-white" />
              </div>
              <span className="text-3xl font-black bg-gradient-to-r from-purple-600 via-pink-500 to-cyan-600 bg-clip-text text-transparent">
                ExamB
              </span>
            </div>

            <div className="mb-8">
              <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-3">Sign in</h2>
              <p className="text-gray-600 font-medium">Enter your credentials to access your account</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-700">Email</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-purple-600 transition-colors" />
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all text-gray-900 placeholder:text-gray-400 font-medium hover:border-purple-300"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-700">Password</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-purple-600 transition-colors" />
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all text-gray-900 placeholder:text-gray-400 font-medium hover:border-purple-300"
                    required
                  />
                </div>
              </div>

              {error && (
                <div className="p-4 bg-gradient-to-r from-red-50 to-red-100 border-2 border-red-200 rounded-xl animate-fadeIn shadow-md">
                  <p className="text-red-700 text-sm font-bold">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-purple-600 via-purple-500 to-cyan-600 text-white font-bold rounded-xl shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 relative overflow-hidden group"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span className="font-bold">Signing in...</span>
                  </>
                ) : (
                  <>
                    <span className="relative z-10 font-bold">Sign in</span>
                    <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-gray-600 font-medium">
                Don't have an account?{" "}
                <button
                  onClick={() => router.push("/signup")}
                  className="font-black text-transparent bg-gradient-to-r from-purple-600 to-cyan-600 bg-clip-text hover:from-cyan-600 hover:to-purple-600 transition-all"
                >
                  Sign up
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}