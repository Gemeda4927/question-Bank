"use client";

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-purple-100">
      {/* Spinner with gradient ring */}
      <div className="relative mb-6">
        <div className="w-24 h-24 rounded-full border-8 border-gray-200 border-t-transparent border-b-transparent animate-spin-slow shadow-lg"></div>
        <div className="absolute top-1/2 left-1/2 w-6 h-6 bg-purple-600 rounded-full transform -translate-x-1/2 -translate-y-1/2 shadow-lg animate-ping"></div>
      </div>

      {/* Loading text with playful bouncing dots */}
      <h2 className="text-3xl font-bold text-purple-700 tracking-wider flex items-center gap-2">
        Loading
        <span className="flex space-x-1">
          <span className="dot animate-bounce delay-0"></span>
          <span className="dot animate-bounce delay-200"></span>
          <span className="dot animate-bounce delay-400"></span>
        </span>
      </h2>

      {/* Subtext */}
      <p className="mt-3 text-gray-500 text-sm animate-fadeIn">
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
        @keyframes bounce {
          0%, 80%, 100% {
            transform: translateY(0);
          }
          40% {
            transform: translateY(-12px);
          }
        }
        @keyframes spin-slow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .animate-fadeIn {
          animation: fadeIn 1.5s ease-in-out infinite alternate;
        }
        .animate-bounce {
          animation: bounce 1s infinite;
        }
        .dot {
          display: inline-block;
          width: 10px;
          height: 10px;
          background-color: #7e22ce;
          border-radius: 50%;
        }
        .delay-0 { animation-delay: 0s; }
        .delay-200 { animation-delay: 0.2s; }
        .delay-400 { animation-delay: 0.4s; }
      `}</style>
    </div>
  );
}
