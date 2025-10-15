"use client"
import { type ReactNode, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getUserRole } from "@/lib/auth"
import { Shield } from "lucide-react"

interface ProtectedRouteProps {
  children: ReactNode
  allowedRole: "student" | "admin"
}

export default function ProtectedRoute({ children, allowedRole }: ProtectedRouteProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [roleChecked, setRoleChecked] = useState(false)

  useEffect(() => {
    const checkRole = () => {
      const role = getUserRole()

      if (!role) {
        router.push("/login")
      } else {
        const mappedRole = role === "instructor" ? "admin" : role

        if (mappedRole !== allowedRole) {
          router.push("/dashboard/not-authorized")
        } else {
          setLoading(false)
        }
      }
      setRoleChecked(true)
    }

    const timeout = setTimeout(checkRole, 50)

    return () => clearTimeout(timeout)
  }, [router, allowedRole])

  if (loading && !roleChecked) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50">
        <div className="text-center space-y-6">
          <div className="relative w-20 h-20 mx-auto">
            <div className="absolute inset-0 border-4 border-purple-200 rounded-full animate-ping"></div>
            <div className="relative w-20 h-20 border-4 border-purple-600 border-t-transparent rounded-full animate-spin flex items-center justify-center">
              <Shield className="w-8 h-8 text-purple-600" />
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-black text-gray-900 mb-2">Verifying Access</h2>
            <p className="text-gray-600 font-medium">Checking your permissions...</p>
          </div>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
