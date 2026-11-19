import { Route, Routes } from 'react-router-dom'
import { ProtectedRoute, PublicOnlyRoute } from './ProtectedRoute'
import { AuthLayout } from '@/layouts/AuthLayout'
import { AppLayout } from '@/layouts/AppLayout'
import { LoginPage } from '@/pages/auth/LoginPage'
import { RegisterPage } from '@/pages/auth/RegisterPage'
import { ForgotPasswordPage } from '@/pages/auth/ForgotPasswordPage'
import { ResetPasswordPage } from '@/pages/auth/ResetPasswordPage'
import { HomePage } from '@/pages/home/HomePage'
import { QuranPage } from '@/pages/quran/QuranPage'
import { AudioPage } from '@/pages/audio/AudioPage'
import { LearningPage } from '@/pages/learning/LearningPage'
import { MemorizationPage } from '@/pages/memorization/MemorizationPage'
import { ProgressPage } from '@/pages/progress/ProgressPage'
import { SettingsPage } from '@/pages/settings/SettingsPage'
import { NotFoundPage } from '@/pages/errors/NotFoundPage'

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<PublicOnlyRoute />}>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        </Route>
      </Route>

      {/* Reset password sengaja di luar PublicOnlyRoute: tautan recovery membuat sesi sementara. */}
      <Route element={<AuthLayout />}>
        <Route path="/reset-password" element={<ResetPasswordPage />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route index element={<HomePage />} />
          <Route path="/quran" element={<QuranPage />} />
          <Route path="/audio" element={<AudioPage />} />
          <Route path="/belajar" element={<LearningPage />} />
          <Route path="/hafalan" element={<MemorizationPage />} />
          <Route path="/progres" element={<ProgressPage />} />
          <Route path="/profil" element={<SettingsPage />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
