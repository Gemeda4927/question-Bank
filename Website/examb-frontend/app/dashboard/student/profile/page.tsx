"use client"
import { useState, useEffect } from "react"
import ProtectedRoute from "@/components/ProtectedRoute"
import StudentLayout from "@/components/StudentLayout"
import { studentService } from "@/services/studentService"
import { User, Mail, Award, Edit2, Save, X } from "lucide-react"
import { getDecodedToken } from "@/lib/auth"

export default function StudentProfilePage() {
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  })

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      setLoading(true)
      const decoded = getDecodedToken()
      const response = await studentService.getProfile()
      const data = response.data?.data || response.data || decoded
      setProfile(data)
      setFormData({
        name: data.name || "",
        email: data.email || "",
      })
    } catch (error) {
      console.error("Error fetching profile:", error)
      const decoded = getDecodedToken()
      if (decoded) {
        setProfile(decoded)
        setFormData({
          name: decoded.name || "",
          email: decoded.email || "",
        })
      }
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      await studentService.updateProfile(formData)
      setProfile({ ...profile, ...formData })
      setEditing(false)
    } catch (error) {
      console.error("Error updating profile:", error)
      alert("Failed to update profile")
    }
  }

  if (loading) {
    return (
      <ProtectedRoute allowedRole="student">
        <StudentLayout>
          <div className="flex items-center justify-center h-96">
            <div className="relative">
              <div className="w-16 h-16 rounded-full border-4 border-purple-200"></div>
              <div className="w-16 h-16 rounded-full border-4 border-purple-600 border-t-transparent animate-spin absolute top-0 left-0"></div>
            </div>
          </div>
        </StudentLayout>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute allowedRole="student">
      <StudentLayout>
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <User className="w-8 h-8 text-purple-600" />
            <div>
              <h1 className="text-4xl font-black text-gray-900">My Profile</h1>
              <p className="text-gray-600 font-medium">Manage your account information</p>
            </div>
          </div>

          {/* Profile Card */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl border-2 border-purple-100/50 shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-purple-600 to-cyan-600 p-8">
              <div className="flex items-center gap-6">
                <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white text-3xl font-black">
                  {profile?.name?.charAt(0).toUpperCase() || "S"}
                </div>
                <div className="text-white">
                  <h2 className="text-3xl font-black mb-1">{profile?.name || "Student"}</h2>
                  <p className="text-purple-100 font-medium">{profile?.email || "student@example.com"}</p>
                  <div className="inline-flex items-center gap-2 mt-2 px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-bold">
                    <Award className="w-4 h-4" />
                    Student
                  </div>
                </div>
              </div>
            </div>

            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-black text-gray-900">Personal Information</h3>
                {!editing ? (
                  <button
                    onClick={() => setEditing(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-all"
                  >
                    <Edit2 className="w-4 h-4" />
                    Edit Profile
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditing(false)
                        setFormData({
                          name: profile?.name || "",
                          email: profile?.email || "",
                        })
                      }}
                      className="flex items-center gap-2 px-4 py-2 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-100 transition-all"
                    >
                      <X className="w-4 h-4" />
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-all"
                    >
                      <Save className="w-4 h-4" />
                      Save Changes
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Full Name</label>
                  {editing ? (
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all"
                    />
                  ) : (
                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                      <User className="w-5 h-5 text-gray-600" />
                      <span className="font-medium text-gray-900">{profile?.name || "N/A"}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
                  {editing ? (
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all"
                    />
                  ) : (
                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                      <Mail className="w-5 h-5 text-gray-600" />
                      <span className="font-medium text-gray-900">{profile?.email || "N/A"}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Role</label>
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                    <Award className="w-5 h-5 text-gray-600" />
                    <span className="font-medium text-gray-900 capitalize">{profile?.role || "Student"}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </StudentLayout>
    </ProtectedRoute>
  )
}
