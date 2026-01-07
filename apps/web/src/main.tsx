import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { seedTestAccounts, printTestAccounts } from './utils/testAccounts'
import { DataModeProvider } from './contexts/DataModeContext'
import { initializeAnalytics } from './utils/analytics'
import { migratePasswords } from './utils/auth'
import { initializeSecurity } from './utils/security'

// Migrate any existing plain text passwords to hashed
migratePasswords();

// Development mode: Seed test accounts
if (import.meta.env.DEV) {
  seedTestAccounts();
  printTestAccounts();
}

// Production mode: Enable security measures
if (import.meta.env.PROD) {
  initializeSecurity({
    disableRightClick: false,  // UX 개선: 우클릭 허용
    disableDevToolsShortcuts: true,
    detectDevTools: true,
    disableTextSelection: false,
    clearConsole: false,
    debuggerTrap: false
  });
}

// Initialize user behavior analytics
initializeAnalytics();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <DataModeProvider>
      <App />
    </DataModeProvider>
  </StrictMode>,
)
