export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-green-50 to-green-100">
      <div className="relative w-20 h-20">
        <div className="absolute inset-0 rounded-full border-4 border-green-500 border-t-transparent animate-spin"></div>
        <div className="absolute inset-2 rounded-full border-4 border-green-400 border-t-transparent animate-ping"></div>
      </div>
      <h2 className="mt-6 text-2xl font-semibold text-green-700 animate-pulse">
        Loading, please wait...
      </h2>
    </div>
  );
}
