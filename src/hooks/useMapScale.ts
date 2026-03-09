import { useState, useCallback, useMemo } from 'react'
import { useMap, useMapEvents } from 'react-leaflet'

interface MapScale {
  label: string
  widthPx: number
}

const MAX_WIDTH_PX = 100

function getRoundNum(num: number): number {
  const pow10 = Math.pow(10, (Math.floor(num) + '').length - 1)
  const d = num / pow10
  const rounded = d >= 10 ? 10 : d >= 5 ? 5 : d >= 3 ? 3 : d >= 2 ? 2 : 1
  return pow10 * rounded
}

function formatMetric(meters: number): string {
  return meters < 1000 ? `${meters} m` : `${meters / 1000} km`
}

function computeScale(map: L.Map): MapScale {
  const y = map.getSize().y / 2
  const maxMeters = map.distance(
    map.containerPointToLatLng([0, y]),
    map.containerPointToLatLng([MAX_WIDTH_PX, y]),
  )
  const roundMeters = getRoundNum(maxMeters)
  const ratio = roundMeters / maxMeters
  return {
    label: formatMetric(roundMeters),
    widthPx: Math.round(MAX_WIDTH_PX * ratio),
  }
}

export function useMapScale(): MapScale {
  const map = useMap()
  const [scale, setScale] = useState<MapScale>(() => computeScale(map))

  const updateScale = useCallback(() => {
    setScale(computeScale(map))
  }, [map])

  useMapEvents(
    useMemo(
      () => ({
        zoomend: updateScale,
        moveend: updateScale,
      }),
      [updateScale],
    ),
  )

  return scale
}
