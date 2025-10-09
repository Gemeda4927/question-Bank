"use client";
import ProtectedRoute from "@/components/ProtectedRoute";
import StudentLayout from "@/components/StudentLayout";

export default function StudentDashboard() {
  return (
    <ProtectedRoute allowedRole="student">
      <StudentLayout>
        <h1 className="text-3xl font-bold mb-4">
          Welcome, Student!
        </h1>
        <p className="text-gray-600">
          Here you can access your exams and
          courses.
        </p>
      </StudentLayout>
    </ProtectedRoute>
  );
}
