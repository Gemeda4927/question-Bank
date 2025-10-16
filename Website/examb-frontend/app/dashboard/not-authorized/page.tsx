'use client'
import { useRouter } from 'next/navigation'
import { ShieldAlert } from 'lucide-react'

export default function NotAuthorizedPage() {
  const router = useRouter()

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute w-72 h-72 bg-blue-200 rounded-full blur-3xl opacity-30 top-10 left-10 animate-pulse"></div>
        <div className="absolute w-96 h-96 bg-indigo-200 rounded-full blur-3xl opacity-30 bottom-10 right-10 animate-pulse delay-200"></div>
      </div>

      {/* Glassmorphism Card */}
      <div className="bg-white/60 backdrop-blur-lg border border-white/20 rounded-2xl shadow-2xl p-10 text-center max-w-md">
        <div className="flex justify-center mb-6">
          <div className="bg-red-100 p-4 rounded-full">
            <ShieldAlert className="text-red-500 w-12 h-12 animate-bounce" />
          </div>
        </div>

        <h1 className="text-6xl font-extrabold text-red-600 drop-shadow-sm mb-2">403</h1>
        <h2 className="text-2xl font-semibold text-gray-800 mb-3">Not Authorized</h2>
        <p className="text-gray-600 leading-relaxed mb-8">
          Sorry, you don’t have permission to access this page.
          <br />
          Please contact the administrator if you think this is a mistake.
        </p>

        <button
          onClick={() => router.push('/')}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-xl shadow-lg hover:scale-105 transition-all duration-300 hover:shadow-indigo-500/40"
        >
          Go Back Home
        </button>
      </div>

      {/* Small Footer */}
      <p className="absolute bottom-6 text-sm text-gray-400">
        © {new Date().getFullYear()} Exam Portal — All Rights Reserved
      </p>
    </div>
  )
}
