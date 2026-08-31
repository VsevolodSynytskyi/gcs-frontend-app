import {
  createContext,
  useContext,
  useEffect,
  useState,
  type FC,
  type ReactNode,
} from 'react'
import type { MapLayer } from '@/components/map/LayerSwitcher'

type Appearance = 'dark' | 'light'

interface AppearanceContextValue {
  appearance: Appearance
  mapLayer: MapLayer
  setMapLayer: (layer: MapLayer) => void
}

const AppearanceContext = createContext<AppearanceContextValue | null>(null)

const getAppearance: (layer: MapLayer) => Appearance = (layer) => {
  switch (layer) {
    case 'Street':
      return 'light'
    case 'Dark':
    case 'Satellite':
      return 'dark'
  }
}

export const AppearanceProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [mapLayer, setMapLayer] = useState<MapLayer>('Dark')
  const appearance = getAppearance(mapLayer)

  useEffect(() => {
    const root = document.documentElement
    if (appearance === 'dark') {
      root.classList.add('dark')
      root.classList.remove('light')
    } else {
      root.classList.add('light')
      root.classList.remove('dark')
    }
  }, [appearance])

  return (
    <AppearanceContext.Provider value={{ appearance, mapLayer, setMapLayer }}>
      {children}
    </AppearanceContext.Provider>
  )
}

export const useAppearance: () => AppearanceContextValue = () => {
  const ctx = useContext(AppearanceContext)
  if (!ctx)
    throw new Error('useAppearance must be used within AppearanceProvider')
  return ctx
}
