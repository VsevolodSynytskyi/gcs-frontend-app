import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from '@/App'
import { AppearanceProvider } from '@/context/AppearanceContext'
import { telemetryStore } from '@/stores/telemetryStore'

telemetryStore.start()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppearanceProvider>
      <App />
    </AppearanceProvider>
  </StrictMode>,
)
