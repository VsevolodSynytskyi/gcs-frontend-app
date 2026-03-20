import type { FC } from 'react'
import { MapView } from '@/components/map/MapView'
import { DroneVideo } from '@/components/video/DroneVideo'
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from '@/components/ui/resizable'

export const MainView: FC = () => {
  return (
    <ResizablePanelGroup orientation="horizontal" className="size-full gap-1">
      <ResizablePanel defaultSize={50} minSize={20}>
        <div className="size-full overflow-hidden rounded-lg">
          <MapView />
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
