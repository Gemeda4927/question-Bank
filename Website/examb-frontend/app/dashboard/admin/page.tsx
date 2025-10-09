'use client';
import AdminLayout from '@/components/AdminLayout';
import ProtectedRoute from '@/components/ProtectedRoute';


export default function AdminDashboard() {
  return (
    <ProtectedRoute allowedRole="admin">
      <AdminLayout>
        <h1 className="text-3xl font-bold mb-4">Welcome, Admin!</h1>
        <p className="text-gray-600">Here you can manage users, exams, and courses.</p>
      </AdminLayout>
    </ProtectedRoute>
  );
}
