import { useCallback } from 'react'
import { useMap } from 'react-leaflet'
import { Crosshair } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tooltip } from '@/components/ui/tooltip'
import { GlassCard } from '@/components/ui/GlassCard.tsx'
import { useAppearance } from '@/context/AppearanceContext'

interface RecenterButtonProps {
  position: [number, number]
}

export function RecenterButton({ position }: RecenterButtonProps) {
  const map = useMap()
  const { appearance } = useAppearance()
  const handleClick = useCallback(() => {
    map.setView(position, map.getZoom())
  }, [map, position])

  return (
    <div className="absolute top-1/2 right-3 z-1000 -translate-y-1/2">
      <div
        className={`${appearance === 'dark' ? 'dark' : 'light'} text-foreground`}
      >
        <GlassCard className="p-1">
          <Tooltip content="Re-center on drone" side="left">
            <Button size="icon" onClick={handleClick}>
              <Crosshair size={18} />
            </Button>
          </Tooltip>
        </GlassCard>
      </div>
    </div>
  )
}
