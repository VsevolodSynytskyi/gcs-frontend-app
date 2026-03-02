import type { ReactNode } from 'react'

interface GlassCardProps {
  children: ReactNode
  className?: string
}

export function GlassCard({ children, className }: GlassCardProps) {
  return (
    <div
      className={`backdrop-blur-md bg-(--gray-a2) border border-(--gray-a6) rounded-xl shadow-lg p-4 ${className ?? ''}`}
    >
      {children}
    </div>
  )
}
