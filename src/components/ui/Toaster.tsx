import { useSyncExternalStore } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { CircleAlert, Info, TriangleAlert } from 'lucide-react'

export type ToastVariant = 'default' | 'info' | 'warning' | 'error'

const variantStyles: Record<ToastVariant, string> = {
  default: 'text-foreground/80',
  info: 'text-blue-400',
  warning: 'text-yellow-400',
  error: 'text-red-400',
}

const variantIcons: Record<ToastVariant, React.ReactNode> = {
  default: null,
  info: <Info size={16} className="shrink-0" />,
  warning: <TriangleAlert size={16} className="shrink-0" />,
  error: <CircleAlert size={16} className="shrink-0" />,
}

type Toast = {
  id: number
  message: string
  variant: ToastVariant
}

let toasts: Toast[] = []
let nextId = 0
const listeners = new Set<() => void>()

function emit() {
  listeners.forEach((l) => l())
}

export function addToast(message: string, variant: ToastVariant = 'default') {
  const id = nextId++
  toasts = [...toasts, { id, message, variant }]
  emit()
  setTimeout(() => {
    removeToast(id)
  }, 4000)
}

function removeToast(id: number) {
  toasts = toasts.filter((t) => t.id !== id)
  emit()
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

function getSnapshot() {
  return toasts
}

export function Toaster() {
  const items = useSyncExternalStore(subscribe, getSnapshot)

  return (
    <div className="fixed right-4 bottom-4 z-[2000] flex w-96 flex-col gap-2">
      <AnimatePresence>
        {items.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={`bg-background/40 flex w-full items-center gap-2 rounded-xl border border-white/20 px-4 py-3 font-mono text-sm shadow-sm backdrop-blur-sm ${variantStyles[toast.variant]}`}
          >
            {variantIcons[toast.variant]}
            {toast.message}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
