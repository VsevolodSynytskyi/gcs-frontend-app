import { SegmentedControl, Theme } from '@radix-ui/themes'

export type MapLayer = 'Dark' | 'Street' | 'Satellite'

interface LayerSwitcherProps {
  activeLayer: MapLayer
  onLayerChange: (layer: MapLayer) => void
  appearance: 'dark' | 'light'
}

export function LayerSwitcher({ activeLayer, onLayerChange, appearance }: LayerSwitcherProps) {
  return (
    <div className="absolute bottom-3 left-3 z-[1000]">
      <Theme appearance={appearance} hasBackground={false}>
        <div className="backdrop-blur-sm bg-(--gray-a2) border border-white/10 rounded-lg shadow-lg p-1">
          <SegmentedControl.Root
            size="1"
            value={activeLayer}
            onValueChange={(value) => onLayerChange(value as MapLayer)}
          >
            <SegmentedControl.Item value="Dark">Dark</SegmentedControl.Item>
            <SegmentedControl.Item value="Street">Street</SegmentedControl.Item>
            <SegmentedControl.Item value="Satellite">Satellite</SegmentedControl.Item>
          </SegmentedControl.Root>
        </div>
      </Theme>
    </div>
  )
}
