"use client"
import { useState, useEffect } from "react"
import ProtectedRoute from "@/components/ProtectedRoute"
import StudentLayout from "@/components/StudentLayout"
import { studentService } from "@/services/studentService"
import { User, Mail, Edit2, Save, X } from "lucide-react"

export default function StudentProfilePage() {
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({ name: "", email: "" })

  useEffect(() => { 
    studentService.getProfile().then(res => {
      const data = res.data?.data || res.data
      setProfile(data)
      setFormData({ name: data?.name || "", email: data?.email || "" })
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  const handleSave = async () => {
    setSaving(true)
    try {
      await studentService.updateProfile(formData)
      setProfile({ ...profile, ...formData })
      setEditing(false)
    } catch (error) {
      alert("Save failed")
    }
    setSaving(false)
  }

  if (loading) return (
    <ProtectedRoute allowedRole="student">
      <StudentLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600"></div>
        </div>
      </StudentLayout>
    </ProtectedRoute>
  )

  return (
    <ProtectedRoute allowedRole="student">
      <StudentLayout>
        <div className="p-4 max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Profile</h1>
          
          <div className="bg-white rounded-lg border p-6">
            <div className="flex justify-between mb-6">
              <h2 className="text-lg font-bold">Personal Info</h2>
              {!editing ? (
                <button onClick={() => setEditing(true)} className="flex items-center px-3 py-1 bg-blue-600 text-white rounded">
                  <Edit2 className="w-4 h-4 mr-1" /> Edit
                </button>
              ) : (
                <div className="flex gap-2">
                  <button onClick={() => setEditing(false)} className="flex items-center px-3 py-1 border rounded">
                    <X className="w-4 h-4 mr-1" /> Cancel
                  </button>
                  <button onClick={handleSave} disabled={saving} className="flex items-center px-3 py-1 bg-green-600 text-white rounded disabled:opacity-50">
                    <Save className="w-4 h-4 mr-1" /> {saving ? "Saving..." : "Save"}
                  </button>
                </div>
              )}
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm mb-1">Name</label>
                {editing ? (
                  <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} 
                    className="w-full p-2 border rounded" />
                ) : (
                  <div className="flex items-center p-2"><User className="w-4 h-4 mr-2" />{profile?.name}</div>
                )}
              </div>
              
              <div>
                <label className="block text-sm mb-1">Email</label>
                {editing ? (
                  <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} 
                    className="w-full p-2 border rounded" />
                ) : (
                  <div className="flex items-center p-2"><Mail className="w-4 h-4 mr-2" />{profile?.email}</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </StudentLayout>
    </ProtectedRoute>
  )
}