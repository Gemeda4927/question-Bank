'use client';
import { useState } from 'react';
import { adminService } from '@/services/adminService';

interface PaymentFormProps {
  onSubmit: () => void;
  onCancel: () => void;
  initialData?: any;
}

export default function PaymentForm({ onSubmit, onCancel, initialData }: PaymentFormProps) {
  const [formData, setFormData] = useState({
    userId: initialData?.userId || '',
    amount: initialData?.amount || '',
    paymentMethod: initialData?.paymentMethod || 'card',
    status: initialData?.status || 'pending',
    description: initialData?.description || '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (initialData) {
        await adminService.updatePayment(initialData._id, formData);
      } else {
        await adminService.createPayment(formData);
      }
      onSubmit();
    } catch (error) {
      console.error('Error saving payment:', error);
      alert('Error saving payment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">User ID</label>
        <input
          type="text"
          required
          value={formData.userId}
          onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700">Amount</label>
        <input
          type="number"
          step="0.01"
          required
          value={formData.amount}
          onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) })}
          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700">Payment Method</label>
        <select
          value={formData.paymentMethod}
          onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="card">Credit Card</option>
          <option value="bank-transfer">Bank Transfer</option>
          <option value="paypal">PayPal</option>
          <option value="cash">Cash</option>
        </select>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700">Status</label>
        <select
          value={formData.status}
          onChange={(e) => setFormData({ ...formData, status: e.target.value })}
          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
          <option value="failed">Failed</option>
          <option value="refunded">Refunded</option>
        </select>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={3}
          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
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
