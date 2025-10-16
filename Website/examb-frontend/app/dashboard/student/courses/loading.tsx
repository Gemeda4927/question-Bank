export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 animate-gradient-bg">
      <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mb-6"></div>
      <h1 className="text-2xl md:text-4xl font-bold text-white animate-pulse">
        Loading course details...
      </h1>
      <p className="text-white mt-2 opacity-80 animate-pulse">
        Please wait while we fetch your amazing content ✨
      </p>
    </div>
  );
}
