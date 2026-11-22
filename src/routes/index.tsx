import { lazy } from 'react'
import { Route, Routes } from 'react-router-dom'
import { ProtectedRoute, PublicOnlyRoute } from './ProtectedRoute'
import { AuthLayout } from '@/layouts/AuthLayout'
import { AppLayout } from '@/layouts/AppLayout'
import { LoginPage } from '@/pages/auth/LoginPage'
import { RegisterPage } from '@/pages/auth/RegisterPage'
import { ForgotPasswordPage } from '@/pages/auth/ForgotPasswordPage'
import { ResetPasswordPage } from '@/pages/auth/ResetPasswordPage'
import { NotFoundPage } from '@/pages/errors/NotFoundPage'

// Halaman dimuat on-demand; fallback = PageSkeleton di AppLayout.
const HomePage = lazy(() => import('@/pages/home/HomePage').then((m) => ({ default: m.HomePage })))
const QuranPage = lazy(() => import('@/pages/quran/QuranPage').then((m) => ({ default: m.QuranPage })))
const ReaderPage = lazy(() => import('@/pages/quran/ReaderPage').then((m) => ({ default: m.ReaderPage })))
const BookmarksPage = lazy(() => import('@/pages/quran/BookmarksPage').then((m) => ({ default: m.BookmarksPage })))
const AudioPage = lazy(() => import('@/pages/audio/AudioPage').then((m) => ({ default: m.AudioPage })))
const LearningPage = lazy(() => import('@/pages/learning/LearningPage').then((m) => ({ default: m.LearningPage })))
const MemorizationPage = lazy(() => import('@/pages/memorization/MemorizationPage').then((m) => ({ default: m.MemorizationPage })))
const ProgressPage = lazy(() => import('@/pages/progress/ProgressPage').then((m) => ({ default: m.ProgressPage })))
const SettingsPage = lazy(() => import('@/pages/settings/SettingsPage').then((m) => ({ default: m.SettingsPage })))

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

      {/* Membaca Al-Qur'an tidak memerlukan login; fitur lain tetap terproteksi. */}
      <Route element={<AppLayout />}>
        <Route path="/quran" element={<QuranPage />} />
        <Route path="/quran/penanda" element={<BookmarksPage />} />
        <Route path="/quran/:surahId" element={<ReaderPage />} />

        <Route element={<ProtectedRoute />}>
          <Route index element={<HomePage />} />
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
