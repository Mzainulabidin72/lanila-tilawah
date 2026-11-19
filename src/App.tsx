import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from '@/contexts/AuthContext'
import { ToastProvider } from '@/contexts/ToastContext'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { ComingSoonProvider } from '@/contexts/ComingSoonContext'
import { AppRoutes } from '@/routes'
import { ConfigError } from '@/components/shared/ConfigError'
import { isConfigured } from '@/config/env'

export default function App() {
  return (
    <ThemeProvider>
      {isConfigured ? (
        <BrowserRouter>
          <ToastProvider>
            <AuthProvider>
              <ComingSoonProvider>
                <AppRoutes />
              </ComingSoonProvider>
            </AuthProvider>
          </ToastProvider>
        </BrowserRouter>
      ) : (
        <ConfigError />
      )}
    </ThemeProvider>
  )
}
