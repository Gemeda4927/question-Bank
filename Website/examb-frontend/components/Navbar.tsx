'use client';
import { getDecodedToken } from '@/lib/auth';

export default function Navbar() {
  const user = getDecodedToken();

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <header className="bg-white shadow px-6 py-4 flex justify-between items-center">
      <h1 className="text-lg font-semibold">Welcome, {user?.id ? user?.role : 'User'}</h1>
      <div className="flex items-center space-x-4">
        <span className="text-gray-700 font-medium">{user?.role}</span>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
