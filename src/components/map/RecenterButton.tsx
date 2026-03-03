import { useCallback } from 'react'
import { useMap } from 'react-leaflet'
import { Crosshair } from 'lucide-react'
import { Tooltip } from 'radix-ui'
import { Button } from '@/components/ui/button'

interface RecenterButtonProps {
  position: [number, number]
}

export function RecenterButton({ position }: RecenterButtonProps) {
  const map = useMap()
  const handleClick = useCallback(() => {
    map.setView(position, map.getZoom())
  }, [map, position])

  return (
    <div className="absolute right-3 top-1/2 -translate-y-1/2 z-[1000]">
      <Tooltip.Provider>
        <Tooltip.Root>
          <Tooltip.Trigger asChild>
            <Button
              size="icon"
              onClick={handleClick}
              className="backdrop-blur-sm bg-black/40 hover:bg-black/60 border border-white/10 text-white/70 hover:text-white"
            >
              <Crosshair size={18} />
            </Button>
          </Tooltip.Trigger>
          <Tooltip.Portal>
            <Tooltip.Content
              side="left"
              sideOffset={8}
              className="rounded-md bg-black/80 backdrop-blur-sm px-3 py-1.5 text-xs text-white border border-white/10 z-[1000]"
            >
              Re-center on drone
              <Tooltip.Arrow className="fill-black/80" />
            </Tooltip.Content>
          </Tooltip.Portal>
        </Tooltip.Root>
      </Tooltip.Provider>
    </div>
  )
}
