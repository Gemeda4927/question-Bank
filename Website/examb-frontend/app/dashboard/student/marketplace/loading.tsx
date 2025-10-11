"use client";

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-purple-50 via-white to-purple-100">
      {/* Spinner */}
      <div className="relative mb-6">
        <div className="w-20 h-20 border-4 border-purple-200 rounded-full"></div>
        <div className="absolute top-0 left-0 w-20 h-20 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
        {/* Glowing center dot */}
        <div className="absolute top-1/2 left-1/2 w-4 h-4 bg-purple-600 rounded-full transform -translate-x-1/2 -translate-y-1/2 animate-ping"></div>
      </div>

      {/* Loading text with animation */}
      <h2 className="text-2xl font-semibold text-purple-700 animate-bounce tracking-wide">
        Loading<span className="animate-pulse">...</span>
      </h2>

      {/* Subtext with soft fade */}
      <p className="mt-2 text-gray-500 text-sm animate-fadeIn">
        Please wait a moment ✨
      </p>

      {/* Keyframe styles */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 1.5s ease-in-out infinite alternate;
        }
      `}</style>
    </div>
  );
}
