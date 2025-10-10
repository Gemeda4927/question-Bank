'use client';
import { useState } from 'react';
import { adminService } from '@/services/adminService';

interface ProgramFormProps {
  onSubmit: () => void;
  onCancel: () => void;
  initialData?: any;
}

export default function ProgramForm({ onSubmit, onCancel, initialData }: ProgramFormProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    code: initialData?.code || '',
    departmentId: initialData?.departmentId || '',
    duration: initialData?.duration || '',
    degreeType: initialData?.degreeType || '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (initialData) {
        await adminService.updateProgram(initialData._id, formData);
      } else {
        await adminService.createProgram(formData);
      }
      onSubmit();
    } catch (error) {
      console.error('Error saving program:', error);
      alert('Error saving program');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Program Name</label>
        <input
          type="text"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700">Code</label>
        <input
          type="text"
          required
          value={formData.code}
          onChange={(e) => setFormData({ ...formData, code: e.target.value })}
          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700">Department ID</label>
        <input
          type="text"
          required
          value={formData.departmentId}
          onChange={(e) => setFormData({ ...formData, departmentId: e.target.value })}
          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700">Duration (years)</label>
        <input
          type="number"
          value={formData.duration}
          onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700">Degree Type</label>
        <select
          value={formData.degreeType}
          onChange={(e) => setFormData({ ...formData, degreeType: e.target.value })}
          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Select Degree Type</option>
          <option value="Bachelor">Bachelor</option>
          <option value="Master">Master</option>
          <option value="PhD">PhD</option>
          <option value="Diploma">Diploma</option>
        </select>
      </div>
      
      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Saving...' : initialData ? 'Update' : 'Create'}
        </button>
      </div>
    </form>
  );
}
