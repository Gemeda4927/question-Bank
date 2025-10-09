'use client';
import { ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.replace('/login');
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-700 text-white flex flex-col">
        <div className="p-6 text-2xl font-bold">Admin Panel</div>
        <nav className="flex-1 px-4 space-y-2">
          <button
            className="block w-full text-left px-3 py-2 rounded hover:bg-blue-600 transition"
            onClick={() => router.push('/dashboard/admin')}
          >
            Dashboard
          </button>
          <button
            className="block w-full text-left px-3 py-2 rounded hover:bg-blue-600 transition"
            onClick={() => router.push('/dashboard/admin/users')}
          >
            Users
          </button>
          <button
            className="block w-full text-left px-3 py-2 rounded hover:bg-blue-600 transition"
            onClick={() => router.push('/dashboard/admin/exams')}
          >
            Exams
          </button>
        </nav>
        <button
          onClick={handleLogout}
          className="m-4 px-3 py-2 bg-red-600 rounded hover:bg-red-700 transition"
        >
          Logout
        </button>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8 overflow-auto">
        {children}
      </main>
    </div>
  );
}
