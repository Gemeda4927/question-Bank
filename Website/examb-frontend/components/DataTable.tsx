"use client"
import { useState, useEffect } from "react"
import type React from "react"
import { Plus, Edit2, Trash2, Archive, ChevronLeft, ChevronRight, X, FileText } from "lucide-react"

interface DataTableProps {
  endpoint: string
  title: string
  columns: { key: string; label: string; render?: (value: any, row: any) => React.ReactNode }[]
  service: any
  onEdit?: (item: any) => void
  onDelete?: (id: string) => Promise<void>
  createForm?: React.ComponentType<any>
}

export default function DataTable({
  endpoint,
  title,
  columns,
  service,
  onEdit,
  onDelete,
  createForm: CreateForm,
}: DataTableProps) {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  })

  const fetchData = async (page = 1) => {
    try {
      setLoading(true)
      console.log("🔄 Fetching data from endpoint:", endpoint)
      
      const response = await service[endpoint]({
        page,
        limit: pagination.limit,
      })

      console.log("📦 Full API response:", response)
      console.log("📦 Response data:", response.data)

      // ✅ Handle different API response structures
      let items = []
      let totalCount = 0

      if (Array.isArray(response.data)) {
        // If response.data is directly an array
        items = response.data
        totalCount = response.data.length
      } else if (Array.isArray(response.data?.data)) {
        // If response.data.data is an array
        items = response.data.data
        totalCount = response.data.totalCount || response.data.total || items.length
      } else if (Array.isArray(response.data?.users)) {
        // If response.data.users is an array
        items = response.data.users
        totalCount = response.data.totalCount || response.data.total || items.length
      } else {
        // Fallback - check if response itself is an array
        items = Array.isArray(response) ? response : []
        totalCount = items.length
      }

      console.log("📊 Extracted items:", items)
      console.log("📊 Total count:", totalCount)

      setData(items)
      setPagination((prev) => ({
        ...prev,
        page,
        total: totalCount,
        totalPages: Math.ceil(totalCount / pagination.limit),
      }))
    } catch (err: any) {
      console.error("❌ Fetch error:", err)
      setError(err.response?.data?.message || err.message || "Failed to fetch data")
      setData([]) // Ensure data is always an array
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [endpoint])

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this item?")) {
      try {
        if (onDelete) {
          await onDelete(id)
        } else {
          await service[`delete${endpoint.charAt(0).toUpperCase() + endpoint.slice(1)}`](id)
        }
        fetchData(pagination.page)
      } catch (err) {
        console.error("Delete failed:", err)
        alert("Delete failed")
      }
    }
  }

  const handleSoftDelete = async (id: string) => {
    if (confirm("Are you sure you want to soft delete this item?")) {
      try {
        await service[`softDelete${endpoint.charAt(0).toUpperCase() + endpoint.slice(1)}`](id)
        fetchData(pagination.page)
      } catch (err) {
        console.error("Soft delete failed:", err)
      }
    }
  }

  // ✅ Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="relative">
          <div className="w-12 h-12 rounded-full border-4 border-muted"></div>
          <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin absolute top-0 left-0"></div>
        </div>
      </div>
    )
  }

  // ✅ Error state
  if (error) {
    return (
      <div className="bg-destructive/10 border border-destructive/20 text-destructive px-6 py-4 rounded-lg flex items-center gap-3">
        <div className="w-2 h-2 rounded-full bg-destructive"></div>
        <span className="font-medium">{error}</span>
        <button 
          onClick={() => fetchData()} 
          className="ml-auto text-sm bg-primary text-primary-foreground px-3 py-1 rounded hover:bg-primary/90"
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className="bg-card rounded-xl border border-border shadow-lg overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-border flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-card-foreground">{title}</h2>
          <p className="text-sm text-muted-foreground mt-1">
            {pagination.total} total records
          </p>
        </div>
        {CreateForm && (
          <button
            onClick={() => setShowCreateForm(true)}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-lg hover:bg-primary/90 transition-all shadow-lg hover:shadow-xl font-medium"
          >
            <Plus className="w-4 h-4" />
            Add New
          </button>
        )}
      </div>

      {/* Create Form Modal */}
      {showCreateForm && CreateForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border rounded-xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl">
            <div className="flex justify-between items-center p-6 border-b border-border">
              <h3 className="text-xl font-bold text-card-foreground">Create New</h3>
              <button
                onClick={() => setShowCreateForm(false)}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
              <CreateForm
                onSubmit={() => {
                  setShowCreateForm(false)
                  fetchData(pagination.page)
                }}
                onCancel={() => setShowCreateForm(false)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-border">
          <thead className="bg-muted/50">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider"
                >
                  {column.label}
                </th>
              ))}
              <th className="px-6 py-4 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {/* ✅ Safe array mapping with empty state */}
            {Array.isArray(data) && data.length > 0 ? (
              data.map((item, index) => (
                <tr key={item._id || item.id || index} className="hover:bg-muted/30 transition-colors">
                  {columns.map((column) => (
                    <td key={column.key} className="px-6 py-4 text-sm text-card-foreground">
                      {column.render ? column.render(item[column.key], item) : item[column.key] || "—"}
                    </td>
                  ))}
                  <td className="px-6 py-4 text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      {onEdit && (
                        <button
                          onClick={() => onEdit(item)}
                          className="p-2 text-accent hover:bg-accent/10 rounded-lg transition-all"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => handleSoftDelete(item._id || item.id)}
                        className="p-2 text-muted-foreground hover:bg-muted hover:text-foreground rounded-lg transition-all"
                        title="Archive"
                      >
                        <Archive className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(item._id || item.id)}
                        className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-all"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              // ✅ Empty state
              <tr>
                <td 
                  colSpan={columns.length + 1} 
                  className="px-6 py-12 text-center text-muted-foreground"
                >
                  <div className="flex flex-col items-center justify-center gap-3">
                    <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                      <FileText className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-medium text-lg mb-1">No data found</p>
                      <p className="text-sm">There are no records to display.</p>
                    </div>
                    <button 
                      onClick={() => fetchData()} 
                      className="mt-2 text-sm bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90"
                    >
                      Refresh Data
                    </button>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination - Only show if we have data */}
      {Array.isArray(data) && data.length > 0 && pagination.totalPages > 1 && (
        <div className="px-6 py-4 border-t border-border flex items-center justify-between bg-muted/20">
          <div className="text-sm text-muted-foreground font-medium">
            Showing{" "}
            <span className="text-foreground font-semibold">
              {(pagination.page - 1) * pagination.limit + 1}
            </span>{" "}
            to{" "}
            <span className="text-foreground font-semibold">
              {Math.min(pagination.page * pagination.limit, pagination.total)}
            </span>{" "}
            of{" "}
            <span className="text-foreground font-semibold">{pagination.total}</span> results
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => fetchData(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-muted transition-all font-medium text-sm"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </button>
            <div className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-semibold text-sm">
              {pagination.page}
            </div>
            <button
              onClick={() => fetchData(pagination.page + 1)}
              disabled={pagination.page === pagination.totalPages}
              className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-muted transition-all font-medium text-sm"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}