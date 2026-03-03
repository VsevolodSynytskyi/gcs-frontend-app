import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { useAppearance } from '../../context/AppearanceContext'

export type MapLayer = 'Dark' | 'Street' | 'Satellite'

export function LayerSwitcher() {
  const { appearance, mapLayer, setMapLayer } = useAppearance()

  return (
    <div className="absolute bottom-3 left-3 z-[1000]">
      <div className={appearance === 'dark' ? 'dark' : 'light'}>
        <div className="backdrop-blur-sm bg-background/40 border border-white/20 [.light_&]:border-white/50 rounded-xl shadow-sm [.light_&]:shadow-none p-1">
          <ToggleGroup
            type="single"
            value={mapLayer}
            onValueChange={(value) => { if (value) setMapLayer(value as MapLayer) }}
            className="gap-0"
          >
            <ToggleGroupItem value="Dark" className="text-xs px-3 py-1 h-7 rounded-md text-muted-foreground hover:bg-foreground/5 hover:text-foreground data-[state=on]:bg-background data-[state=on]:text-foreground">
              Dark
            </ToggleGroupItem>
            <ToggleGroupItem value="Street" className="text-xs px-3 py-1 h-7 rounded-md text-muted-foreground hover:bg-foreground/5 hover:text-foreground data-[state=on]:bg-background data-[state=on]:text-foreground">
              Street
            </ToggleGroupItem>
            <ToggleGroupItem value="Satellite" className="text-xs px-3 py-1 h-7 rounded-md text-muted-foreground hover:bg-foreground/5 hover:text-foreground data-[state=on]:bg-background data-[state=on]:text-foreground">
              Satellite
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      </div>
    </div>
  )
}
