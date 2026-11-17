import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from '@/contexts/AuthContext'
import { ToastProvider } from '@/contexts/ToastContext'
import { AppRoutes } from '@/routes'
import { ConfigError } from '@/components/shared/ConfigError'
import { isConfigured } from '@/config/env'

export default function App() {
  if (!isConfigured) return <ConfigError />

  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  )
}
