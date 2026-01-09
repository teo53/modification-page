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

// Security measures (production) + dev shortcut (always)
initializeSecurity({
  disableRightClick: false,  // UX 개선: 우클릭 허용
  disableDevToolsShortcuts: import.meta.env.PROD,  // 프로덕션에서만 차단
  detectDevTools: import.meta.env.PROD,  // 프로덕션에서만 감지
  disableTextSelection: false,
  clearConsole: false,
  debuggerTrap: false
});

// Initialize user behavior analytics
initializeAnalytics();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <DataModeProvider>
      <App />
    </DataModeProvider>
  </StrictMode>,
)
