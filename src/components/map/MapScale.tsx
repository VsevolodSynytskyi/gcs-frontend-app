import type { FC } from 'react'
import { useMapScale } from '@/hooks/useMapScale'

export const MapScale: FC = () => {
  const { label, widthPx } = useMapScale()

  return (
    <div className="text-foreground absolute right-3 bottom-6 z-1000">
      <div className="flex items-center gap-1.5">
        <div
          className="h-0.5 rounded-full bg-white/70"
          style={{ width: `${widthPx}px` }}
        />
        <span className="text-xs font-medium drop-shadow-sm">{label}</span>
      </div>
    </div>
  )
}
