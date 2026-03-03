import type { ReactNode } from 'react'

interface StatItemProps {
  label: string
  children: ReactNode
}

export function StatItem({ label, children }: StatItemProps) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-muted-foreground text-xs tracking-wider uppercase">
        {label}
      </span>
      <span className="text-foreground font-mono text-base">{children}</span>
    </div>
  )
}
