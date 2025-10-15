"use client"
import { useState, useEffect } from "react"
import type React from "react"
import { Plus, Edit2, Trash2, Archive, ChevronLeft, ChevronRight, X, FileText } from "lucide-react"
import ConfirmationModal from "./ConfirmationModal"
import SuccessModal from "./SuccessModal"

interface DataTableProps {
  endpoint: string | { method: string; params?: any }
  title: string
  columns: {
    key: string
    label: string
    render?: (value: any, row: any) => React.ReactNode
  }[]
  service: any
  onEdit?: (item: any) => void
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

  const [modalOpen, setModalOpen] = useState(false)
  const [modalMessage, setModalMessage] = useState("")
  const [modalConfirmAction, setModalConfirmAction] = useState<() => void>(() => {})

  const [successOpen, setSuccessOpen] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")

  const fetchData = async (page = 1) => {
    try {
      setLoading(true)
      const method = typeof endpoint === "string" ? endpoint : endpoint.method
      const params = typeof endpoint === "string" ? {} : endpoint.params || {}
      const response = await service[method]({ page, limit: pagination.limit, ...params })

      let items: any[] = []
      let totalCount = 0
      if (Array.isArray(response.data)) {
        items = response.data
        totalCount = response.data.length
      } else if (Array.isArray(response.data?.data)) {
        items = response.data.data
        totalCount = response.data.totalCount || items.length
      } else if (Array.isArray(response.data?.users)) {
        items = response.data.users
        totalCount = response.data.totalCount || items.length
      }

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
      setData([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [endpoint])

  // ✅ Delete with confirmation
  const handleDelete = (id: string) => {
    setModalMessage("Are you sure you want to permanently delete this item?")
    setModalConfirmAction(() => async () => {
      try {
        if (onDelete) {
          await onDelete(id)
        } else {
          const methodName =
            typeof endpoint === "string"
              ? `delete${endpoint.charAt(0).toUpperCase() + endpoint.slice(1)}`
              : `delete${endpoint.method.charAt(0).toUpperCase() + endpoint.method.slice(1)}`
          await service[methodName](id)
        }
        fetchData(pagination.page)
        setSuccessMessage("Item has been permanently deleted!")
        setSuccessOpen(true)
      } catch (err) {
        console.error("Delete failed:", err)
      } finally {
        setModalOpen(false)
      }
    })
    setModalOpen(true)
  }

  // ✅ Soft delete
  const handleSoftDelete = (id: string) => {
    setModalMessage("Are you sure you want to archive this item?")
    setModalConfirmAction(() => async () => {
      try {
        const methodName =
          typeof endpoint === "string"
            ? `softDelete${endpoint.charAt(0).toUpperCase() + endpoint.slice(1)}`
            : `softDelete${endpoint.method.charAt(0).toUpperCase() + endpoint.method.slice(1)}`
        await service[methodName](id)
        fetchData(pagination.page)
        setSuccessMessage("Item has been archived successfully!")
        setSuccessOpen(true)
      } catch (err) {
        console.error("Soft delete failed:", err)
      } finally {
        setModalOpen(false)
      }
    })
    setModalOpen(true)
  }

  if (loading)
    return (
      <div className="flex justify-center items-center h-96">
        <div className="relative">
          <div className="w-16 h-16 rounded-full border-4 border-gray-200"></div>
          <div className="w-16 h-16 rounded-full border-4 border-primary border-t-transparent animate-spin absolute top-0 left-0"></div>
        </div>
      </div>
    )

  if (error)
    return (
      <div className="bg-red-50 border-2 border-red-200 text-red-700 px-8 py-6 rounded-2xl flex items-center gap-4 shadow-sm">
        <div className="w-3 h-3 rounded-full bg-red-500"></div>
        <span className="font-semibold text-lg">{error}</span>
        <button
          onClick={() => fetchData()}
          className="ml-auto text-sm bg-red-600 text-white px-5 py-2.5 rounded-xl hover:bg-red-700 font-bold shadow-md"
        >
          Retry
        </button>
      </div>
    )

  return (
    <div className="bg-white rounded-3xl border border-gray-200 shadow-xl overflow-hidden">
      <div className="p-8 border-b border-gray-200 flex justify-between items-center bg-gradient-to-r from-gray-50 to-white">
        <div>
          <h2 className="text-3xl font-black text-gray-900">{title}</h2>
          <p className="text-sm text-gray-600 mt-2 font-medium">{pagination.total} total records</p>
        </div>
        {CreateForm && (
          <button
            onClick={() => setShowCreateForm(true)}
            className="flex items-center gap-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3.5 rounded-2xl hover:shadow-xl transition-all font-bold text-lg shadow-lg"
          >
            <Plus className="w-5 h-5" /> Add New
          </button>
        )}
      </div>

      {/* Create Form Modal */}
      {showCreateForm && CreateForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-gray-200 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl">
            <div className="flex justify-between items-center p-8 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
              <h3 className="text-2xl font-black text-gray-900">Create New</h3>
              <button
                onClick={() => setShowCreateForm(false)}
                className="p-2.5 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-8 overflow-y-auto max-h-[calc(90vh-100px)]">
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

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="px-8 py-5 text-left text-xs font-black text-gray-700 uppercase tracking-wider"
                >
                  {column.label}
                </th>
              ))}
              <th className="px-8 py-5 text-right text-xs font-black text-gray-700 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {Array.isArray(data) && data.length > 0 ? (
              data.map((item, index) => (
                <tr key={item._id || item.id || index} className="hover:bg-gray-50 transition-colors">
                  {columns.map((column) => (
                    <td key={column.key} className="px-8 py-5 text-sm text-gray-900 font-medium">
                      {column.render ? column.render(item[column.key], item) : item[column.key] || "—"}
                    </td>
                  ))}
                  <td className="px-8 py-5 text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-3">
                      {onEdit && (
                        <button
                          onClick={() => onEdit(item)}
                          className="p-2.5 text-blue-600 hover:bg-blue-50 rounded-xl transition-all shadow-sm"
                          title="Edit"
                        >
                          <Edit2 className="w-5 h-5" />
                        </button>
                      )}
                      <button
                        onClick={() => handleSoftDelete(item._id || item.id)}
                        className="p-2.5 text-gray-600 hover:bg-gray-100 rounded-xl transition-all shadow-sm"
                        title="Archive"
                      >
                        <Archive className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(item._id || item.id)}
                        className="p-2.5 text-red-600 hover:bg-red-50 rounded-xl transition-all shadow-sm"
                        title="Delete"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length + 1} className="px-8 py-16 text-center text-gray-600">
                  <div className="flex flex-col items-center justify-center gap-4">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
                      <FileText className="w-10 h-10 text-gray-400" />
                    </div>
                    <div>
                      <p className="font-black text-xl mb-2 text-gray-900">No data found</p>
                      <p className="text-sm text-gray-600">There are no records to display.</p>
                    </div>
                    <button
                      onClick={() => fetchData()}
                      className="mt-3 text-sm bg-purple-600 text-white px-6 py-3 rounded-xl hover:bg-purple-700 font-bold shadow-md"
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

      {Array.isArray(data) && data.length > 0 && pagination.totalPages > 1 && (
        <div className="px-8 py-6 border-t border-gray-200 flex items-center justify-between bg-gradient-to-r from-gray-50 to-white">
          <div className="text-sm text-gray-600 font-semibold">
            Showing <span className="text-gray-900 font-black">{(pagination.page - 1) * pagination.limit + 1}</span> to{" "}
            <span className="text-gray-900 font-black">
              {Math.min(pagination.page * pagination.limit, pagination.total)}
            </span>{" "}
            of <span className="text-gray-900 font-black">{pagination.total}</span> results
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => fetchData(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="flex items-center gap-2 px-5 py-3 border-2 border-gray-200 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-all font-bold text-sm shadow-sm"
            >
              <ChevronLeft className="w-5 h-5" /> Previous
            </button>
            <div className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-black text-sm shadow-md">
              {pagination.page}
            </div>
            <button
              onClick={() => fetchData(pagination.page + 1)}
              disabled={pagination.page === pagination.totalPages}
              className="flex items-center gap-2 px-5 py-3 border-2 border-gray-200 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-all font-bold text-sm shadow-sm"
            >
              Next <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* ✅ Modals */}
      <ConfirmationModal
        isOpen={modalOpen}
        message={modalMessage}
        onConfirm={modalConfirmAction}
        onCancel={() => setModalOpen(false)}
      />
      <SuccessModal isOpen={successOpen} message={successMessage} onClose={() => setSuccessOpen(false)} />
    </div>
  )
}
