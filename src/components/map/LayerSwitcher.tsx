import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { GlassCard } from '@/components/ui/GlassCard'
import { useAppearance } from '@/context/AppearanceContext'

export type MapLayer = 'Dark' | 'Street' | 'Satellite'

export function LayerSwitcher() {
  const { appearance, mapLayer, setMapLayer } = useAppearance()

  return (
    <div className="absolute bottom-3 left-3 z-[1000]">
      <div className={appearance === 'dark' ? 'dark' : 'light'}>
        <GlassCard className="p-1">
          <ToggleGroup
            type="single"
            value={mapLayer}
            onValueChange={(value) => {
              if (value) setMapLayer(value as MapLayer)
            }}
            className="gap-0"
          >
            <ToggleGroupItem
              value="Dark"
              className="text-muted-foreground hover:bg-foreground/5 hover:text-foreground data-[state=on]:bg-background data-[state=on]:text-foreground h-7 rounded-md px-3 py-1 text-xs"
            >
              Dark
            </ToggleGroupItem>
            <ToggleGroupItem
              value="Street"
              className="text-muted-foreground hover:bg-foreground/5 hover:text-foreground data-[state=on]:bg-background data-[state=on]:text-foreground h-7 rounded-md px-3 py-1 text-xs"
            >
              Street
            </ToggleGroupItem>
            <ToggleGroupItem
              value="Satellite"
              className="text-muted-foreground hover:bg-foreground/5 hover:text-foreground data-[state=on]:bg-background data-[state=on]:text-foreground h-7 rounded-md px-3 py-1 text-xs"
            >
              Satellite
            </ToggleGroupItem>
          </ToggleGroup>
        </GlassCard>
      </div>
    </div>
  )
}
