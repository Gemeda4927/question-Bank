"use client"
import { useState, useEffect } from "react"
import type React from "react"

import { adminService } from "@/services/adminService"

interface DepartmentFormProps {
  onSubmit: () => void
  onCancel: () => void
  initialData?: any
}

export default function DepartmentForm({ onSubmit, onCancel, initialData }: DepartmentFormProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    code: initialData?.code || "",
    description: initialData?.description || "",
    universityId: initialData?.universityId || "",
  })
  const [universities, setUniversities] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchUniversities = async () => {
      try {
        const response = await adminService.getUniversities()
        const data = response.data?.data || response.data || []
        setUniversities(data)
      } catch (error) {
        console.error("Error fetching universities:", error)
      }
    }
    fetchUniversities()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (initialData) {
        await adminService.updateDepartment(initialData._id, formData)
      } else {
        await adminService.createDepartment(formData)
      }
      onSubmit()
    } catch (error) {
      console.error("Error saving department:", error)
      alert("Error saving department")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-card-foreground mb-2">Department Name</label>
        <input
          type="text"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full border-2 border-border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-background text-foreground"
          placeholder="e.g., Computer Science"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-card-foreground mb-2">Code</label>
        <input
          type="text"
          required
          value={formData.code}
          onChange={(e) => setFormData({ ...formData, code: e.target.value })}
          className="w-full border-2 border-border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-background text-foreground"
          placeholder="e.g., CS01"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-card-foreground mb-2">University</label>
        <select
          required
          value={formData.universityId}
          onChange={(e) => setFormData({ ...formData, universityId: e.target.value })}
          className="w-full border-2 border-border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-background text-foreground"
        >
          <option value="">Select a university</option>
          {universities.map((uni) => (
            <option key={uni._id} value={uni._id}>
              {uni.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-card-foreground mb-2">Description</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={3}
          className="w-full border-2 border-border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-background text-foreground"
          placeholder="Brief description of the department"
        />
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2.5 border-2 border-border rounded-lg text-sm font-semibold text-foreground hover:bg-muted transition-all"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:bg-primary/90 disabled:opacity-50 transition-all shadow-lg hover:shadow-xl"
        >
          {loading ? "Saving..." : initialData ? "Update" : "Create"}
        </button>
      </div>
    </form>
  )
}
