"use client"
import { motion } from "framer-motion"
import { RefreshCw, Flame } from "lucide-react"

interface HeaderSectionProps {
  coursesLength: number
  enrollmentsLength: number
  loading: boolean
  onRefresh: () => void
}

export default function HeaderSection({ coursesLength, enrollmentsLength, loading, onRefresh }: HeaderSectionProps) {
  return (
    <div className="flex items-center justify-between flex-wrap gap-4">
      <div>
        <motion.h1
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-5xl font-black bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 text-transparent bg-clip-text tracking-tight mb-2"
        >
          Course Marketplace
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="text-gray-600 text-lg flex items-center gap-2"
        >
          <Flame className="w-5 h-5 text-orange-500 animate-pulse" />
          Discover amazing courses and level up your skills! 🚀
        </motion.p>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onRefresh}
          disabled={loading}
          className="flex items-center gap-2 px-5 py-3 text-sm font-medium text-gray-700 hover:text-gray-900 transition-all disabled:opacity-50 border-2 border-gray-300 rounded-xl hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 shadow-sm hover:shadow-md"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </motion.button>
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl px-5 py-3 border-2 border-purple-300 shadow-lg"
        >
          <p className="text-xs text-purple-100 font-medium">Available Courses</p>
          <p className="text-2xl font-black text-white">{coursesLength}</p>
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl px-5 py-3 border-2 border-green-300 shadow-lg"
        >
          <p className="text-xs text-green-100 font-medium">Your Enrollments</p>
          <p className="text-2xl font-black text-white">{enrollmentsLength}</p>
        </motion.div>
      </div>
    </div>
  )
}