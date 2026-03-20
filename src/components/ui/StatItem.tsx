import type { FC, ReactNode } from 'react'

interface StatItemProps {
  label: string
  children: ReactNode
}

export const StatItem: FC<StatItemProps> = ({ label, children }) => {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-muted-foreground text-xs tracking-wider uppercase">
        {label}
      </span>
      <span className="text-foreground font-mono text-base">{children}</span>
    </div>
  )
}
