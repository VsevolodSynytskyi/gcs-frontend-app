import type { ReactNode } from 'react'

interface GlassCardProps {
  children: ReactNode
  className?: string
}

export function GlassCard({ children, className }: GlassCardProps) {
  return (
    <div
      className={`backdrop-blur-sm bg-foreground/5 border border-white/10 [.light_&]:border-black/10 rounded-xl shadow-lg [.light_&]:shadow-none p-4 ${className ?? ''}`}
    >
      {children}
    </div>
  )
}
