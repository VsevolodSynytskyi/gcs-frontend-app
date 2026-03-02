import type { ReactNode } from 'react'

interface GlassCardProps {
  children: ReactNode
  className?: string
}

export function GlassCard({ children, className }: GlassCardProps) {
  return (
    <div
      className={`backdrop-blur-sm bg-background/40 border border-white/20 [.light_&]:border-white/50 rounded-xl shadow-sm [.light_&]:shadow-none p-4 ${className ?? ''}`}
    >
      {children}
    </div>
  )
}
