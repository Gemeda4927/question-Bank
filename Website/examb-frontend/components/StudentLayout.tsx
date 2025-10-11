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
  CreditCard,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"

interface StudentLayoutProps {
  children: ReactNode
}

export default function StudentLayout({ children }: StudentLayoutProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(false)

  const handleLogout = () => {
    localStorage.removeItem("token")
    router.replace("/login")
  }

  const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard/student" },
    { icon: ShoppingCart, label: "Marketplace", path: "/dashboard/student/marketplace" },
    { icon: FileText, label: "My Exams", path: "/dashboard/student/exams" },
    { icon: BookOpen, label: "My Courses", path: "/dashboard/student/courses" },
    { icon: CreditCard, label: "Payments", path: "/dashboard/student/payments" },
    { icon: BarChart3, label: "Results", path: "/dashboard/student/results" },
    { icon: User, label: "Profile", path: "/dashboard/student/profile" },
  ]

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile menu button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-3 bg-white rounded-xl shadow-lg border border-gray-200 hover:bg-gray-50 transition-colors"
      >
        {sidebarOpen ? <X className="w-5 h-5 text-gray-700" /> : <Menu className="w-5 h-5 text-gray-700" />}
      </button>

      <aside
        className={`${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-40 ${
          collapsed ? "w-20" : "w-72"
        } bg-white border-r border-gray-200 flex flex-col transition-all duration-300 shadow-sm`}
      >
        {/* Header */}
        <div className={`p-6 border-b border-gray-200 ${collapsed ? "px-4" : ""}`}>
          <div className="flex items-center justify-between">
            <div className={`flex items-center gap-3 ${collapsed ? "justify-center w-full" : ""}`}>
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              {!collapsed && (
                <div>
                  <h2 className="text-xl font-bold text-gray-900">ExamB</h2>
                  <p className="text-xs text-gray-500">Student Portal</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
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
                className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg transition-all group relative ${
                  isActive ? "bg-blue-50 text-blue-600" : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                }`}
                title={collapsed ? item.label : undefined}
              >
                <Icon className={`w-5 h-5 ${isActive ? "text-blue-600" : "text-gray-500 group-hover:text-gray-700"}`} />
                {!collapsed && <span className="font-medium text-sm">{item.label}</span>}
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-blue-600 rounded-r-full" />
                )}
              </button>
            )
          })}
        </nav>

        {/* Collapse button - desktop only */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden lg:flex items-center justify-center p-3 m-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
        >
          {collapsed ? (
            <ChevronRight className="w-5 h-5 text-gray-600" />
          ) : (
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          )}
        </button>

        {/* Logout button */}
        <button
          onClick={handleLogout}
          className={`m-3 px-4 py-3 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-all flex items-center ${
            collapsed ? "justify-center" : "justify-center gap-2"
          } font-medium text-sm`}
        >
          <LogOut className="w-5 h-5" />
          {!collapsed && "Logout"}
        </button>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="lg:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-30"
        />
      )}

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <div className="p-6 lg:p-8 max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  )
}
