"use client"
import { motion } from "framer-motion"
import { BookOpen, RefreshCw } from "lucide-react"

interface EmptyStateProps {
  filteredCoursesLength: number
  loading: boolean
  searchTerm: string
  selectedLevel: string
  selectedSemester: string
  clearFilters: () => void
}

export default function EmptyState({
  filteredCoursesLength,
  loading,
  searchTerm,
  selectedLevel,
  selectedSemester,
  clearFilters,
}: EmptyStateProps) {
  if (filteredCoursesLength > 0 || loading) return null

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white p-16 rounded-3xl text-center border-2 border-gray-200 shadow-xl"
    >
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}
      >
        <div className="bg-gradient-to-br from-purple-100 to-pink-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto">
          <BookOpen className="w-12 h-12 text-purple-600" />
        </div>
      </motion.div>
      <h3 className="text-3xl font-black text-gray-900 mb-3 mt-6">
        {searchTerm || selectedLevel !== "all" || selectedSemester !== "all"
          ? "No courses found 🔍"
          : "No courses available yet 📚"}
      </h3>
      <p className="text-gray-600 mb-8 max-w-md mx-auto text-lg">
        {searchTerm || selectedLevel !== "all" || selectedSemester !== "all"
          ? "Try adjusting your filters or search terms to discover more courses."
          : "New courses are coming soon! Check back later for exciting learning opportunities."}
      </p>
      {(searchTerm || selectedLevel !== "all" || selectedSemester !== "all") && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={clearFilters}
          className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl font-bold hover:shadow-xl transition-all inline-flex items-center gap-3 text-lg"
        >
          <RefreshCw className="w-5 h-5" /> Clear All Filters
        </motion.button>
      )}
    </motion.div>
  )
}