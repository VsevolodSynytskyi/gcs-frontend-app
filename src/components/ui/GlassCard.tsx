import type { FC, ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface GlassCardProps {
  children: ReactNode
  className?: string
}

export const GlassCard: FC<GlassCardProps> = ({
  children,
  className,
}) => {
  return (
    <div
      className={cn(
        'bg-background/40 rounded-xl border border-white/20 p-4 shadow-sm backdrop-blur-sm [.light_&]:border-white/50 [.light_&]:shadow-none',
        className,
      )}
    >
      {children}
    </div>
  )
}
