import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { initIntelligenceSyncEngine } from './intelligence/intelligenceSyncEngine'

// ── Initialize Unified Intelligence Sync Engine ───────────────────────────────
// Called once before React renders. Registers all event listeners, seeds the
// first intelligence cycle, and connects all cross-system data flows.
// The engine's internal guard prevents duplicate initialization on hot-reload.
initIntelligenceSyncEngine('computer')

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
