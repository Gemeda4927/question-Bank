'use client';
import { useState, useEffect } from 'react';

interface DataTableProps {
  endpoint: string;
  title: string;
  columns: { key: string; label: string; render?: (value: any, row: any) => React.ReactNode }[];
  service: any;
  onEdit?: (item: any) => void;
  onDelete?: (id: string) => Promise<void>;
  createForm?: React.ComponentType<any>;
}

export default function DataTable({ 
  endpoint, 
  title, 
  columns, 
  service, 
  onEdit,
  onDelete,
  createForm: CreateForm 
}: DataTableProps) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });

  const fetchData = async (page = 1) => {
    try {
      setLoading(true);
      const response = await service[endpoint]({ 
        page, 
        limit: pagination.limit 
      });
      
      setData(response.data.data || response.data);
      setPagination(prev => ({
        ...prev,
        page,
        total: response.data.totalCount || response.data.length,
        totalPages: Math.ceil((response.data.totalCount || response.data.length) / pagination.limit)
      }));
    } catch (err) {
      setError('Failed to fetch data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [endpoint]);

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this item?')) {
      try {
        if (onDelete) {
          await onDelete(id);
        } else {
          await service[`delete${endpoint.charAt(0).toUpperCase() + endpoint.slice(1)}`](id);
        }
        fetchData(pagination.page); // Refresh current page
      } catch (err) {
        console.error('Delete failed:', err);
        alert('Delete failed');
      }
    }
  };

  const handleSoftDelete = async (id: string) => {
    if (confirm('Are you sure you want to soft delete this item?')) {
      try {
        await service[`softDelete${endpoint.charAt(0).toUpperCase() + endpoint.slice(1)}`](id);
        fetchData(pagination.page);
      } catch (err) {
        console.error('Soft delete failed:', err);
      }
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );
  
  if (error) return (
    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
      {error}
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="p-6 border-b flex justify-between items-center">
        <h2 className="text-2xl font-semibold">{title}</h2>
        <button 
          onClick={() => setShowCreateForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add New
        </button>
      </div>

      {/* Create Form Modal */}
      {showCreateForm && CreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Create New</h3>
              <button 
                onClick={() => setShowCreateForm(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <CreateForm 
              onSubmit={() => {
                setShowCreateForm(false);
                fetchData(pagination.page);
              }}
              onCancel={() => setShowCreateForm(false)}
            />
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column) => (
                <th 
                  key={column.key} 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {column.label}
                </th>
              ))}
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((item: any, index: number) => (
              <tr key={item._id || item.id || index} className="hover:bg-gray-50">
                {columns.map((column) => (
                  <td key={column.key} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {column.render ? column.render(item[column.key], item) : item[column.key]}
                  </td>
                ))}
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                  {onEdit && (
                    <button 
                      onClick={() => onEdit(item)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Edit
                    </button>
                  )}
                  <button 
                    onClick={() => handleSoftDelete(item._id || item.id)}
                    className="text-yellow-600 hover:text-yellow-900"
                  >
                    Soft Delete
                  </button>
                  <button 
                    onClick={() => handleDelete(item._id || item.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="px-6 py-4 border-t flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} results
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => fetchData(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="px-3 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={() => fetchData(pagination.page + 1)}
              disabled={pagination.page === pagination.totalPages}
              className="px-3 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}