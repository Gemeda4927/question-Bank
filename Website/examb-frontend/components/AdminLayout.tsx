"use client"

import { useState, type ReactNode } from "react"
import { useRouter, usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  Building2,
  School,
  UserCog,
  CreditCard,
  FileText,
  HelpCircle,
  LogOut,
  Menu,
  X,
  ChevronRight,
} from "lucide-react"

interface AdminLayoutProps {
  children: ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const handleLogout = () => {
    localStorage.removeItem("token")
    router.replace("/login")
  }

  const menuItems = [
    { name: "Dashboard", path: "/dashboard/admin", icon: LayoutDashboard },
    { name: "Users", path: "/dashboard/admin/users", icon: Users },
    { name: "Universities", path: "/dashboard/admin/universities", icon: GraduationCap },
    { name: "Programs", path: "/dashboard/admin/programs", icon: BookOpen },
    { name: "Colleges", path: "/dashboard/admin/colleges", icon: Building2 },
    { name: "Courses", path: "/dashboard/admin/courses", icon: School },
    { name: "Faculty", path: "/dashboard/admin/faculty", icon: UserCog },
    { name: "Exams", path: "/dashboard/admin/exams", icon: FileText },
    { name: "Questions", path: "/dashboard/admin/questions", icon: HelpCircle },
    { name: "Payments", path: "/dashboard/admin/payments", icon: CreditCard },
  ]

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <aside
        className={`${
          sidebarOpen ? "w-72" : "w-20"
        } bg-white border-r border-gray-200 flex flex-col transition-all duration-300 shadow-xl`}
      >
        {/* Header */}
        <div className="p-6 flex items-center justify-between border-b border-gray-200">
          {sidebarOpen && (
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg">
                <GraduationCap className="w-7 h-7 text-white" />
              </div>
              <span className="text-2xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                ExamB
              </span>
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2.5 hover:bg-gray-100 rounded-xl transition-colors"
          >
            {sidebarOpen ? <X className="w-5 h-5 text-gray-600" /> : <Menu className="w-5 h-5 text-gray-600" />}
          </button>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.path
            return (
              <button
                key={item.name}
                onClick={() => router.push(item.path)}
                title={!sidebarOpen ? item.name : ""}
                className={`flex items-center gap-4 w-full px-4 py-3.5 rounded-2xl transition-all group ${
                  isActive
                    ? "bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg shadow-purple-500/30"
                    : "hover:bg-gray-100 text-gray-700"
                }`}
              >
                <Icon className="w-6 h-6 flex-shrink-0" />
                {sidebarOpen && (
                  <>
                    <span className="text-sm font-bold flex-1 text-left">{item.name}</span>
                    {isActive && <ChevronRight className="w-5 h-5" />}
                  </>
                )}
              </button>
            )
          })}
        </nav>

        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="flex items-center gap-4 w-full px-4 py-3.5 rounded-2xl bg-gradient-to-r from-red-500 to-rose-600 text-white hover:shadow-lg hover:shadow-red-500/30 transition-all font-bold"
            title={!sidebarOpen ? "Logout" : ""}
          >
            <LogOut className="w-6 h-6 flex-shrink-0" />
            {sidebarOpen && <span className="text-sm">Logout</span>}
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        <div className="p-10">{children}</div>
      </main>
    </div>
  )
}
