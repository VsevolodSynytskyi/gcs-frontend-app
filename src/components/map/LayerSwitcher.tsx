import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'

export type MapLayer = 'Dark' | 'Street' | 'Satellite'

interface LayerSwitcherProps {
  activeLayer: MapLayer
  onLayerChange: (layer: MapLayer) => void
  appearance: 'dark' | 'light'
}

export function LayerSwitcher({ activeLayer, onLayerChange, appearance }: LayerSwitcherProps) {
  return (
    <div className="absolute bottom-3 left-3 z-[1000]">
      <div className={appearance === 'dark' ? 'dark' : 'light'}>
        <div className="backdrop-blur-sm bg-foreground/5 border border-white/10 rounded-lg shadow-lg p-1">
          <ToggleGroup
            type="single"
            value={activeLayer}
            onValueChange={(value) => { if (value) onLayerChange(value as MapLayer) }}
            className="gap-0"
          >
            <ToggleGroupItem value="Dark" className="text-xs px-3 py-1 h-7 rounded-md data-[state=on]:bg-background data-[state=on]:text-foreground">
              Dark
            </ToggleGroupItem>
            <ToggleGroupItem value="Street" className="text-xs px-3 py-1 h-7 rounded-md data-[state=on]:bg-background data-[state=on]:text-foreground">
              Street
            </ToggleGroupItem>
            <ToggleGroupItem value="Satellite" className="text-xs px-3 py-1 h-7 rounded-md data-[state=on]:bg-background data-[state=on]:text-foreground">
              Satellite
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      </div>
    </div>
  )
}
