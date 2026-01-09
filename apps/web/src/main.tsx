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

// Security measures - 개발자도구 차단 비활성화
initializeSecurity({
  disableRightClick: false,
  disableDevToolsShortcuts: false,  // 비활성화
  detectDevTools: false,  // 비활성화
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
