"use client"
import AdminLayout from "@/components/AdminLayout"
import ProtectedRoute from "@/components/ProtectedRoute"
import DataTable from "@/components/DataTable"
import { adminService } from "@/services/adminService"
import UniversityForm from "@/components/forms/UniversityForm"
import { GraduationCap, MapPin, CheckCircle2, XCircle } from "lucide-react"

export default function UniversitiesPage() {
  const universityColumns = [
    { key: "name", label: "University Name" },
    { key: "code", label: "Code" },
    {
      key: "location",
      label: "Location",
      render: (value: string) => (
        <span className="inline-flex items-center gap-1.5 text-sm">
          <MapPin className="w-4 h-4 text-muted-foreground" />
          {value}
        </span>
      ),
    },
    {
      key: "createdAt",
      label: "Created At",
      render: (value: string) => new Date(value).toLocaleDateString(),
    },
    {
      key: "isDeleted",
      label: "Status",
      render: (value: boolean) => (
        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold ${
            value ? "bg-destructive/20 text-destructive" : "bg-emerald-500/20 text-emerald-500"
          }`}
        >
          {value ? <XCircle className="w-3 h-3" /> : <CheckCircle2 className="w-3 h-3" />}
          {value ? "Deleted" : "Active"}
        </span>
      ),
    },
  ]

  return (
    <ProtectedRoute allowedRole="admin">
      <AdminLayout>
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <GraduationCap className="w-8 h-8 text-primary" />
            <h1 className="text-4xl font-bold text-foreground">Universities Management</h1>
          </div>
          <p className="text-muted-foreground text-lg">Manage universities and their information</p>
        </div>

        <DataTable
          endpoint="getUniversities"
          title="All Universities"
          columns={universityColumns}
          service={adminService}
          createForm={UniversityForm}
        />
      </AdminLayout>
    </ProtectedRoute>
  )
}
