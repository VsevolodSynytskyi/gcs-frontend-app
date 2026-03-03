import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from '@/App'
import { TelemetryProvider } from '@/context/TelemetryContext'
import { AppearanceProvider } from '@/context/AppearanceContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <TelemetryProvider>
      <AppearanceProvider>
        <App />
      </AppearanceProvider>
    </TelemetryProvider>
  </StrictMode>,
)
