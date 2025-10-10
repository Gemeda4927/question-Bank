"use client"
import { useState, useEffect } from "react"
import AdminLayout from "@/components/AdminLayout"
import ProtectedRoute from "@/components/ProtectedRoute"
import DataTable from "@/components/DataTable"
import UserForm from "@/components/forms/UserForm"
import EditUserForm from "@/components/forms/EditUserForm"
import { adminService } from "@/services/adminService"
import { Users, CheckCircle2, XCircle, RefreshCw, Filter, Archive, Edit2 } from "lucide-react"

export default function UsersPage() {
  const [activeTab, setActiveTab] = useState<"all" | "active" | "deleted">("all")
  const [editUser, setEditUser] = useState<any>(null)
  const [showEditForm, setShowEditForm] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  const userColumns = [
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    {
      key: "role",
      label: "Role",
      render: (value?: string) => (
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
          value === "admin" 
            ? "bg-purple-500/20 text-purple-500" 
            : value === "instructor" 
            ? "bg-blue-500/20 text-blue-500"
            : "bg-green-500/20 text-green-500"
        }`}>
          {value ? value.charAt(0).toUpperCase() + value.slice(1) : "—"}
        </span>
      ),
    },
    {
      key: "createdAt",
      label: "Created At",
      render: (value?: string) => {
        if (!value) return <span>—</span>
        const date = new Date(value)
        if (isNaN(date.getTime())) return <span>Invalid</span>
        const formatted = `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}-${String(date.getUTCDate()).padStart(2, "0")}`
        return <span>{formatted}</span>
      },
    },
    {
      key: "isDeleted",
      label: "Status",
      render: (value?: boolean) => {
        return (
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
              value ? "bg-destructive/20 text-destructive" : "bg-emerald-500/20 text-emerald-500"
            }`}
          >
            {value ? <XCircle className="w-3 h-3" /> : <CheckCircle2 className="w-3 h-3" />}
            {value ? "Deleted" : "Active"}
          </span>
        )
      },
    },
  ]

  const handleEdit = (user: any) => {
    setEditUser(user)
    setShowEditForm(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to permanently delete this user? This action cannot be undone.")) {
      try {
        await adminService.deleteUser(id)
        setRefreshKey(prev => prev + 1) // Refresh the table
      } catch (err: any) {
        console.error("Delete failed:", err)
        alert(err.response?.data?.message || "Delete failed")
      }
    }
  }

  const handleSoftDelete = async (id: string) => {
    if (confirm("Are you sure you want to archive this user? They can be restored later.")) {
      try {
        await adminService.softDeleteUser(id)
        setRefreshKey(prev => prev + 1) // Refresh the table
      } catch (err: any) {
        console.error("Soft delete failed:", err)
        alert(err.response?.data?.message || "Archive failed")
      }
    }
  }

  const handleRestore = async (id: string) => {
    try {
      await adminService.restoreUser(id)
      setRefreshKey(prev => prev + 1) // Refresh the table
    } catch (err: any) {
      console.error("Restore failed:", err)
      alert(err.response?.data?.message || "Restore failed")
    }
  }

  const getEndpoint = () => {
    switch (activeTab) {
      case "active":
        return "getUsers" // You might need to add a filter for active users
      case "deleted":
        return "getUsers" // You might need to add a filter for deleted users
      default:
        return "getUsers"
    }
  }

  return (
    <ProtectedRoute allowedRole="admin">
      <AdminLayout>
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Users className="w-8 h-8 text-primary" />
            <h1 className="text-4xl font-bold text-foreground">Users Management</h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Manage system users, their roles and permissions
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="flex gap-1 p-1 bg-muted rounded-lg w-fit">
            {[
              { key: "all", label: "All Users" },
              { key: "active", label: "Active Users" },
              { key: "deleted", label: "Deleted Users" }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  activeTab === tab.key
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* DataTable with all user operations */}
        <DataTable
          key={refreshKey} // This forces re-render when refreshKey changes
          endpoint={getEndpoint()}
          title={`${activeTab === "all" ? "All" : activeTab === "active" ? "Active" : "Deleted"} Users`}
          columns={userColumns}
          service={adminService}
          createForm={UserForm}
          onEdit={handleEdit}
          onDelete={handleDelete}
          additionalActions={(user: any) => (
            <>
              {user.isDeleted ? (
                <button
                  onClick={() => handleRestore(user._id || user.id)}
                  className="p-2 text-emerald-600 hover:bg-emerald-500/10 rounded-lg transition-all"
                  title="Restore User"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              ) : (
                <>
                  <button
                    onClick={() => handleEdit(user)}
                    className="p-2 text-blue-600 hover:bg-blue-500/10 rounded-lg transition-all"
                    title="Edit User"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleSoftDelete(user._id || user.id)}
                    className="p-2 text-orange-600 hover:bg-orange-500/10 rounded-lg transition-all"
                    title="Archive User"
                  >
                    <Archive className="w-4 h-4" />
                  </button>
                </>
              )}
            </>
          )}
        />

        {/* Edit User Modal */}
        {showEditForm && editUser && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-card border border-border rounded-xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl">
              <div className="flex justify-between items-center p-6 border-b border-border">
                <h3 className="text-xl font-bold text-card-foreground">Edit User</h3>
                <button
                  onClick={() => {
                    setShowEditForm(false)
                    setEditUser(null)
                  }}
                  className="p-2 hover:bg-muted rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
                <EditUserForm
                  user={editUser}
                  onSubmit={() => {
                    setShowEditForm(false)
                    setEditUser(null)
                    setRefreshKey(prev => prev + 1)
                  }}
                  onCancel={() => {
                    setShowEditForm(false)
                    setEditUser(null)
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </AdminLayout>
    </ProtectedRoute>
  )
}