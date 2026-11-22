import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from '@/contexts/AuthContext'
import { ToastProvider } from '@/contexts/ToastContext'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { ReaderPrefsProvider } from '@/contexts/ReaderPrefsContext'
import { BookmarksProvider } from '@/contexts/BookmarksContext'
import { ReadingPositionProvider } from '@/contexts/ReadingPositionContext'
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
              <ReaderPrefsProvider>
                <BookmarksProvider>
                  <ReadingPositionProvider>
                    <ComingSoonProvider>
                      <AppRoutes />
                    </ComingSoonProvider>
                  </ReadingPositionProvider>
                </BookmarksProvider>
              </ReaderPrefsProvider>
            </AuthProvider>
          </ToastProvider>
        </BrowserRouter>
      ) : (
        <ConfigError />
      )}
    </ThemeProvider>
  )
}
