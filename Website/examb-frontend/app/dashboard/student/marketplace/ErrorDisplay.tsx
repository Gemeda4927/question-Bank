"use client"
import { motion } from "framer-motion"
import { AlertCircle } from "lucide-react"

interface ErrorDisplayProps {
  error: string | null
  onRetry: () => void
}

export default function ErrorDisplay({ error, onRetry }: ErrorDisplayProps) {
  if (!error) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-300 rounded-2xl p-5 shadow-lg"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="bg-red-500 p-3 rounded-2xl shadow-md">
            <AlertCircle className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-red-900 font-bold text-lg">Oops! Something went wrong</p>
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onRetry}
          className="px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl text-sm font-bold hover:shadow-lg transition-all"
        >
          Try Again
        </motion.button>
      </div>
    </motion.div>
  )
}