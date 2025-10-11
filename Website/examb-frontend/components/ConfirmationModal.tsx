"use client"
import { X } from "lucide-react"

interface ConfirmationModalProps {
  isOpen: boolean
  message: string
  onConfirm: () => void
  onCancel: () => void
}

export default function ConfirmationModal({
  isOpen,
  message,
  onConfirm,
  onCancel,
}: ConfirmationModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-card border border-border rounded-xl w-full max-w-sm p-6 shadow-2xl flex flex-col gap-4">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-bold text-card-foreground">Confirm Action</h3>
          <button onClick={onCancel} className="p-1 hover:bg-muted rounded transition">
            <X className="w-4 h-4" />
          </button>
        </div>
        <p className="text-sm text-foreground">{message}</p>
        <div className="flex justify-end gap-2 mt-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded bg-muted text-foreground hover:bg-muted/80 transition"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded bg-destructive text-white hover:bg-destructive/90 transition"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  )
}
