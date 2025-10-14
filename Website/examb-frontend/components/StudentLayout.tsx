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
  Star,
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

  // Vibrant icon colors for each nav item
  const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard/student", color: "text-blue-500" },
    { icon: ShoppingCart, label: "Marketplace", path: "/dashboard/student/marketplace", color: "text-green-500" },
    { icon: FileText, label: "My Exams", path: "/dashboard/student/exams", color: "text-orange-500" },
    { icon: BookOpen, label: "My Courses", path: "/dashboard/student/courses", color: "text-purple-500" },
    { icon: CreditCard, label: "Payments", path: "/dashboard/student/payments", color: "text-teal-500" },
    { icon: BarChart3, label: "Results", path: "/dashboard/student/results", color: "text-pink-500" },
    { icon: User, label: "Profile", path: "/dashboard/student/profile", color: "text-indigo-500" },
  ]

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-100 to-gray-50">
      {/* Mobile menu button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-5 left-5 z-50 p-3 bg-white rounded-2xl shadow-xl border border-gray-200 hover:scale-105 transition-transform"
      >
        {sidebarOpen ? <X className="w-6 h-6 text-gray-700" /> : <Menu className="w-6 h-6 text-gray-700" />}
      </button>

      <aside
        className={`${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-40 ${
          collapsed ? "w-20" : "w-72"
        } bg-white border-r border-gray-200 flex flex-col transition-all duration-300 shadow-2xl`}
      >
        {/* Header */}
        <div className={`p-6 border-b border-gray-200 ${collapsed ? "px-4" : ""}`}>
          <div className="flex items-center justify-between">
            <div className={`flex items-center gap-3 ${collapsed ? "justify-center w-full" : ""}`}>
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                <GraduationCap className="w-7 h-7 text-white" />
              </div>
              {!collapsed && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 tracking-wide">ExamB</h2>
                  <p className="text-xs text-gray-500 uppercase tracking-widest">Student Portal</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-6 space-y-2 overflow-y-auto">
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
                className={`flex items-center gap-4 w-full px-4 py-3 rounded-xl transition-all group relative
                  ${
                    isActive
                      ? "bg-gradient-to-r from-blue-100 via-blue-50 to-white shadow-md"
                      : "hover:bg-gray-100 hover:scale-105"
                  }`}
                title={collapsed ? item.label : undefined}
              >
                <Icon
                  className={`w-5 h-5 transition-colors duration-300 ${
                    isActive ? item.color : "text-gray-500 group-hover:text-gray-700"
                  }`}
                />
                {!collapsed && <span className="font-semibold text-sm">{item.label}</span>}
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-blue-600 rounded-r-full shadow-md" />
                )}
              </button>
            )
          })}
        </nav>

        {/* Collapse button - desktop only */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden lg:flex items-center justify-center p-3 m-3 border border-gray-200 rounded-xl hover:bg-gray-50 hover:scale-105 transition-transform"
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
          className={`m-3 px-4 py-3 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl transition-all flex items-center ${
            collapsed ? "justify-center" : "justify-center gap-2"
          } font-semibold shadow-sm hover:shadow-md hover:scale-105`}
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
        <div className="p-6 lg:p-10 max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  )
}
