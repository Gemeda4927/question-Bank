"use client"
import { motion } from "framer-motion"
import { Search, TrendingUp } from "lucide-react"

interface SearchAndFiltersProps {
  searchTerm: string
  setSearchTerm: (value: string) => void
  selectedLevel: string
  setSelectedLevel: (value: string) => void
  selectedSemester: string
  setSelectedSemester: (value: string) => void
  levels: string[]
  semesters: number[]
  clearFilters: () => void
  filteredCoursesLength: number
  totalCoursesLength: number
}

export default function SearchAndFilters({
  searchTerm,
  setSearchTerm,
  selectedLevel,
  setSelectedLevel,
  selectedSemester,
  setSelectedSemester,
  levels,
  semesters,
  clearFilters,
  filteredCoursesLength,
  totalCoursesLength,
}: SearchAndFiltersProps) {
  return (
    <div className="bg-white border-2 border-gray-200 rounded-3xl p-6 shadow-xl">
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1 relative group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-purple-500 transition-colors" />
          <input
            type="text"
            placeholder="🔍 Search for your next adventure..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-14 pr-5 py-4 border-2 border-gray-300 rounded-2xl text-gray-800 placeholder-gray-400 focus:ring-4 focus:ring-purple-200 focus:border-purple-500 transition-all font-medium shadow-sm"
          />
        </div>
        <div className="flex gap-3 flex-wrap">
          <select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
            className="px-5 py-4 rounded-2xl border-2 border-gray-300 bg-white focus:ring-4 focus:ring-blue-200 focus:border-blue-500 text-gray-700 font-medium cursor-pointer min-w-[150px] shadow-sm hover:shadow-md transition-all"
          >
            <option value="all">🎓 All Levels</option>
            {levels.map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>
          <select
            value={selectedSemester}
            onChange={(e) => setSelectedSemester(e.target.value)}
            className="px-5 py-4 rounded-2xl border-2 border-gray-300 bg-white focus:ring-4 focus:ring-blue-200 focus:border-blue-500 text-gray-700 font-medium cursor-pointer min-w-[170px] shadow-sm hover:shadow-md transition-all"
          >
            <option value="all">📅 All Semesters</option>
            {semesters.map((sem) => (
              <option key={sem} value={sem.toString()}>
                Semester {sem}
              </option>
            ))}
          </select>
          {(searchTerm || selectedLevel !== "all" || selectedSemester !== "all") && (
            <motion.button
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={clearFilters}
              className="px-5 py-4 text-gray-700 hover:text-gray-900 transition-all border-2 border-gray-300 rounded-2xl hover:bg-gradient-to-r hover:from-gray-100 hover:to-gray-200 font-medium whitespace-nowrap shadow-sm hover:shadow-md"
            >
              ✨ Clear Filters
            </motion.button>
          )}
        </div>
      </div>
      {(searchTerm || selectedLevel !== "all" || selectedSemester !== "all") && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="mt-5 flex items-center gap-3 text-sm flex-wrap"
        >
          <TrendingUp className="w-5 h-5 text-purple-500" />
          <span className="text-gray-600 font-medium">
            Showing <span className="text-purple-600 font-bold">{filteredCoursesLength}</span> of{" "}
            <span className="font-bold">{totalCoursesLength}</span> courses
          </span>
          {searchTerm && (
            <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-semibold">
              "{searchTerm}"
            </span>
          )}
          {selectedLevel !== "all" && (
            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold">
              {selectedLevel}
            </span>
          )}
          {selectedSemester !== "all" && (
            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
              Semester {selectedSemester}
            </span>
          )}
        </motion.div>
      )}
    </div>
  )
}