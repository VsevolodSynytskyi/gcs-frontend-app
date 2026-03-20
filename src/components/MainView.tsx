import type { FC } from 'react'
import type { Map } from 'leaflet'
import { MapView } from '@/components/map/MapView'
import { DroneVideo } from '@/components/video/DroneVideo'

interface MainViewProps {
  onMapReady: (map: Map) => void
}

export const MainView: FC<MainViewProps> = ({ onMapReady }) => {
  return (
    <div className="flex size-full gap-1">
      <div className="min-w-0 flex-1 overflow-hidden rounded-lg">
        <MapView onMapReady={onMapReady} />
      </div>
      <div className="min-w-0 flex-1 overflow-hidden rounded-lg">
        <DroneVideo />
      </div>
    </div>
  )
}
