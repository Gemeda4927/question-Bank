"use client"
import { type ReactNode, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import {
  BookOpen,
  LayoutDashboard,
  FileText,
  GraduationCap,
  BarChart3,
  LogOut,
  Menu,
  X,
  User,
  ShoppingCart,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"

interface StudentLayoutProps {
  children: ReactNode
}

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard/student", color: "text-blue-500" },
  { icon: ShoppingCart, label: "Marketplace", path: "/dashboard/student/marketplace", color: "text-green-500" },
  { icon: FileText, label: "My Exams", path: "/dashboard/student/exams", color: "text-orange-500" },
  { icon: BookOpen, label: "My Courses", path: "/dashboard/student/courses", color: "text-purple-500" },
  { icon: BarChart3, label: "Results", path: "/dashboard/student/results", color: "text-pink-500" },
  { icon: User, label: "Profile", path: "/dashboard/student/profile", color: "text-indigo-500" },
]

export default function StudentLayout({ children }: StudentLayoutProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(false)

  const handleLogout = () => {
    localStorage.removeItem("token")
    router.replace("/login")
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile menu button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow border border-gray-200"
      >
        {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-40 ${
          collapsed ? "w-16" : "w-64"
        } bg-white border-r border-gray-200 flex flex-col transition-all duration-300`}
      >
        {/* Header */}
        <div className={`p-4 border-b border-gray-200 ${collapsed ? "px-3" : ""}`}>
          <div className={`flex items-center ${collapsed ? "justify-center" : "gap-3"}`}>
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            {!collapsed && (
              <div>
                <h2 className="text-lg font-bold text-gray-900">ExamB</h2>
                <p className="text-xs text-gray-500">Student Portal</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.path
            return (
              <button
                key={item.path}
                onClick={() => {
                  router.push(item.path)
                  setSidebarOpen(false)
                }}
                className={`flex items-center gap-3 w-full p-3 rounded-lg transition-colors ${
                  isActive ? "bg-blue-50 text-blue-700" : "text-gray-600 hover:bg-gray-100"
                } ${collapsed ? "justify-center" : ""}`}
                title={collapsed ? item.label : undefined}
              >
                <Icon className={`w-5 h-5 ${isActive ? item.color : "text-gray-500"}`} />
                {!collapsed && <span className="font-medium">{item.label}</span>}
              </button>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="p-3 border-t border-gray-200 space-y-2">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex items-center justify-center w-full p-2 border border-gray-200 rounded-lg hover:bg-gray-50"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>

          <button
            onClick={handleLogout}
            className={`flex items-center gap-3 w-full p-3 text-red-600 rounded-lg hover:bg-red-50 transition-colors ${
              collapsed ? "justify-center" : ""
            }`}
          >
            <LogOut className="w-5 h-5" />
            {!collapsed && <span className="font-medium">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="lg:hidden fixed inset-0 bg-black/20 z-30"
        />
      )}

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <div className="p-6 max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  )
}