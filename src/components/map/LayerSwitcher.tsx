import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { GlassCard } from '@/components/ui/GlassCard'
import { useAppearance } from '@/context/AppearanceContext'

export type MapLayer = 'Dark' | 'Street' | 'Satellite'

export function LayerSwitcher() {
  const { mapLayer, setMapLayer } = useAppearance()

  return (
    <div className="absolute bottom-3 left-3 z-1000 text-foreground">
      <GlassCard className="p-1">
          <ToggleGroup
            type="single"
            variant="outline"
            value={mapLayer}
            onValueChange={(value) => {
              if (value) setMapLayer(value as MapLayer)
            }}
          >
            <ToggleGroupItem value="Dark">Dark</ToggleGroupItem>
            <ToggleGroupItem value="Street">Street</ToggleGroupItem>
            <ToggleGroupItem value="Satellite">Satellite</ToggleGroupItem>
          </ToggleGroup>
      </GlassCard>
    </div>
  )
}
