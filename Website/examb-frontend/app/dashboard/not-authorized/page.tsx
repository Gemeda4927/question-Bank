'use client';
import { useRouter } from 'next/navigation';

export default function NotAuthorizedPage() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50 px-4">
      <h1 className="text-5xl font-bold text-red-600 mb-4">403</h1>
      <h2 className="text-2xl font-semibold mb-4">Not Authorized</h2>
      <p className="text-gray-600 mb-8 text-center">
        You do not have permission to view this page.
      </p>
      <button
        onClick={() => router.push('/')}
        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
      >
        Go to Home
      </button>
    </div>
  );
}
