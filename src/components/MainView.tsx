import type { FC } from 'react'
import type { Map } from 'leaflet'
import { MapView } from '@/components/map/MapView'
import { DroneVideo } from '@/components/video/DroneVideo'
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from '@/components/ui/resizable'

interface MainViewProps {
  onMapReady: (map: Map) => void
}

export const MainView: FC<MainViewProps> = ({ onMapReady }) => {
  return (
    <ResizablePanelGroup orientation="horizontal" className="size-full gap-1">
      <ResizablePanel defaultSize={50} minSize={20}>
        <div className="size-full overflow-hidden rounded-lg">
          <MapView onMapReady={onMapReady} />
        </div>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={50} minSize={20}>
        <div className="size-full overflow-hidden rounded-lg">
          <DroneVideo />
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}
