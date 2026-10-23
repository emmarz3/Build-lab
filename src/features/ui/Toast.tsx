/* ============================================================
   CampusFix — Toast Context (Global Notification System)
   ============================================================ */

import {
  createContext,
  useContext,
  useState,
  useCallback,
} from 'react'
import type { ReactNode } from 'react'
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react'
import { cn } from '@/lib/utils'

export type ToastType = 'success' | 'error' | 'info' | 'warning'

export interface Toast {
  id: string
  type: ToastType
  title: string
  message?: string
  duration?: number
}

interface ToastContextValue {
  toasts: Toast[]
  addToast: (toast: Omit<Toast, 'id'>) => void
  removeToast: (id: string) => void
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined)

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return ctx
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const addToast = useCallback(
    (toast: Omit<Toast, 'id'>) => {
      const id = `toast_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`
      const fullToast: Toast = {
        id,
        duration: 5000,
        ...toast,
      }
      setToasts((prev) => [...prev, fullToast])

      const duration = fullToast.duration ?? 0
      if (duration > 0) {
        setTimeout(() => removeToast(id), duration)
      }
    },
    [removeToast]
  )

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  )
}

const toastIcons: Record<ToastType, React.ElementType> = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info,
  warning: AlertCircle,
}

const toastVariantClasses: Record<ToastType, string> = {
  success: 'border-[var(--color-success-border)] bg-[var(--color-success-bg)]',
  error: 'border-[var(--color-danger-border)] bg-[var(--color-danger-bg)]',
  info: 'border-[var(--color-info-border)] bg-[var(--color-info-bg)]',
  warning: 'border-[var(--color-warning-border)] bg-[var(--color-warning-bg)]',
}

const toastIconColorClasses: Record<ToastType, string> = {
  success: 'text-[var(--color-success)]',
  error: 'text-[var(--color-danger)]',
  info: 'text-[var(--color-info)]',
  warning: 'text-[var(--color-warning)]',
}

function ToastContainer({
  toasts,
  onRemove,
}: {
  toasts: Toast[]
  onRemove: (id: string) => void
}) {
  if (toasts.length === 0) return null

  return (
    <div
      aria-live="polite"
      aria-label="Notifications"
      className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2"
    >
      {toasts.map((toast) => {
        const Icon = toastIcons[toast.type]
        return (
          <div
            key={toast.id}
            className={cn(
              'flex items-start gap-3 rounded-[var(--radius-md)] border p-4 pr-10 shadow-[var(--shadow-lg)]',
              'max-w-sm text-sm toast-enter',
              toastVariantClasses[toast.type]
            )}
            role="status"
          >
            <Icon className={cn('mt-0.5 h-5 w-5 flex-shrink-0', toastIconColorClasses[toast.type])} />
            <div className="flex-1">
              <p className="font-semibold text-[var(--color-text-primary)]">{toast.title}</p>
              {toast.message && (
                <p className="mt-1 text-sm text-[var(--color-text-secondary)]">{toast.message}</p>
              )}
            </div>
            <button
              type="button"
              onClick={() => onRemove(toast.id)}
              className="absolute top-2 right-2 rounded-full p-1 text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-strong)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-focus)]"
              aria-label="Dismiss notification"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )
      })}
    </div>
  )
}
