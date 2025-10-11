"use client"
import { CheckCircle2, X } from "lucide-react"

interface SuccessModalProps {
  isOpen: boolean
  message: string
  onClose: () => void
}

export default function SuccessModal({ isOpen, message, onClose }: SuccessModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-card border border-border rounded-xl w-full max-w-sm p-6 shadow-2xl flex flex-col gap-4 items-center text-center">
        <CheckCircle2 className="w-12 h-12 text-emerald-500" />
        <p className="text-lg font-semibold text-card-foreground">{message}</p>
        <button
          onClick={onClose}
          className="mt-2 px-6 py-2 rounded bg-primary text-primary-foreground hover:bg-primary/90 transition"
        >
          OK
        </button>
      </div>
    </div>
  )
}
