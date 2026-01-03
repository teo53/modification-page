import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { seedTestAccounts, printTestAccounts } from './utils/testAccounts'

// Development mode: Seed test accounts
if (import.meta.env.DEV) {
  seedTestAccounts();
  printTestAccounts();
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

// Build trigger Sat Jan  3 04:26:32 UTC 2026
