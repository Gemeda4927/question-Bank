"use client"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { GraduationCap, Award, Sparkles, CreditCard, FileText, ChevronDown, Loader2, CheckCircle2 } from "lucide-react"

interface SubscriptionModalProps {
  course: any | null
  showModal: boolean
  onClose: () => void
  onPurchase: (courseId: string, type: "full-course" | "exam", examId?: string) => void
  processingPayment: string | null
}

export default function SubscriptionModal({
  course,
  showModal,
  onClose,
  onPurchase,
  processingPayment,
}: SubscriptionModalProps) {
  const [selectedExamId, setSelectedExamId] = useState<string>("")

  if (!course) return null

  const exams = Array.isArray(course.exams) ? course.exams : []
  const isFree = !course.price || course.price === 0

  const calculateExamPrice = (exam: any) => {
    if (typeof exam === "object" && exam.price) {
      return exam.price
    }
    return exams.length > 0 ? Math.round((course.price || 0) / exams.length) : 0
  }

  return (
    <AnimatePresence>
      {showModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-3 rounded-2xl">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text">
                Choose Your Path
              </h3>
            </div>

            {isFree ? (
              <div className="space-y-4">
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-6 text-center">
                  <Sparkles className="w-12 h-12 mx-auto text-green-600 mb-3" />
                  <p className="text-lg font-semibold text-green-800 mb-2">This course is completely FREE! 🎉</p>
                  <p className="text-green-600 text-sm">Start learning immediately with lifetime access</p>
                </div>
                <div className="flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onPurchase(course._id, "full-course")}
                    disabled={processingPayment === course._id}
                    className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 rounded-xl font-semibold disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all"
                  >
                    {processingPayment === course._id ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" /> Enrolling...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-5 h-5" /> Enroll Now
                      </>
                    )}
                  </motion.button>
                  <button
                    onClick={onClose}
                    className="px-6 py-4 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-xl transition-all font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-5">
                {/* Full Course Option */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="border-2 border-purple-200 rounded-2xl p-5 hover:border-purple-400 hover:shadow-lg transition-all bg-gradient-to-br from-purple-50 to-pink-50"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Award className="w-5 h-5 text-purple-600" />
                      <h4 className="font-bold text-gray-900">Full Course Access</h4>
                    </div>
                    <div className="text-right">
                      <span className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text">
                        ETB {course.price}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                    <Sparkles className="w-4 h-4 text-yellow-500" />
                    <span>
                      All materials + {exams.length} exam{exams.length !== 1 ? "s" : ""} included
                    </span>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onPurchase(course._id, "full-course")}
                    disabled={processingPayment === course._id}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-xl font-semibold disabled:opacity-50 flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all"
                  >
                    {processingPayment === course._id ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" /> Processing...
                      </>
                    ) : (
                      <>
                        <CreditCard className="w-5 h-5" /> Purchase Full Course
                      </>
                    )}
                  </motion.button>
                </motion.div>

                {exams.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <FileText className="w-5 h-5 text-blue-600" />
                      <h4 className="font-bold text-gray-900">Individual Exams</h4>
                    </div>
                    <div className="space-y-3">
                      <div className="relative">
                        <select
                          value={selectedExamId}
                          onChange={(e) => setSelectedExamId(e.target.value)}
                          className="w-full px-4 py-3 pr-10 border-2 border-blue-200 rounded-xl bg-white text-gray-900 font-semibold focus:ring-4 focus:ring-blue-200 focus:border-blue-400 transition-all appearance-none cursor-pointer"
                        >
                          <option value="">Select an exam to purchase...</option>
                          {exams.map((exam, index) => {
                            const examObj = typeof exam === "object" ? exam : null
                            const examId = examObj?._id || exam
                            const examName = examObj?.name || `Exam ${index + 1}`
                            const examPrice = calculateExamPrice(exam)
                            return (
                              <option key={examId as string} value={examId as string}>
                                {examName} - ETB {examPrice}
                              </option>
                            )
                          })}
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-600 pointer-events-none" />
                      </div>

                      {selectedExamId && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-sm font-semibold text-blue-900">Selected Exam Price:</span>
                            <span className="text-2xl font-black bg-gradient-to-r from-blue-600 to-cyan-600 text-transparent bg-clip-text">
                              ETB{" "}
                              {calculateExamPrice(
                                exams.find((e: any) => (typeof e === "object" ? e._id : e) === selectedExamId),
                              )}
                            </span>
                          </div>
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => {
                              onPurchase(course._id, "exam", selectedExamId)
                              setSelectedExamId("")
                            }}
                            disabled={processingPayment === course._id}
                            className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-3 rounded-xl font-semibold disabled:opacity-50 flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all"
                          >
                            {processingPayment === course._id ? (
                              <>
                                <Loader2 className="w-5 h-5 animate-spin" /> Processing...
                              </>
                            ) : (
                              <>
                                <CreditCard className="w-5 h-5" /> Purchase Selected Exam
                              </>
                            )}
                          </motion.button>
                        </motion.div>
                      )}
                    </div>
                  </div>
                )}

                <button
                  onClick={onClose}
                  className="w-full mt-4 py-3 text-gray-600 hover:text-gray-800 hover:bg-gray-100 transition-all border-2 border-gray-200 rounded-xl font-medium"
                >
                  Maybe Later
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
