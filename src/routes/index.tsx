import { Route, Routes } from 'react-router-dom'
import { ProtectedRoute, PublicOnlyRoute } from './ProtectedRoute'
import { AuthLayout } from '@/layouts/AuthLayout'
import { AppLayout } from '@/layouts/AppLayout'
import { LoginPage } from '@/pages/auth/LoginPage'
import { RegisterPage } from '@/pages/auth/RegisterPage'
import { ForgotPasswordPage } from '@/pages/auth/ForgotPasswordPage'
import { ResetPasswordPage } from '@/pages/auth/ResetPasswordPage'
import { DashboardPage } from '@/pages/dashboard/DashboardPage'
import { PlaceholderPage } from '@/pages/dashboard/PlaceholderPage'
import { ProfilePage } from '@/pages/dashboard/ProfilePage'
import { NotFoundPage } from '@/pages/errors/NotFoundPage'
import { NAV_ITEMS } from '@/config/nav'

const PLACEHOLDERS = NAV_ITEMS.filter((n) => !['/', '/profil'].includes(n.path))

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
          <Route index element={<DashboardPage />} />
          {PLACEHOLDERS.map((n) => (
            <Route key={n.path} path={n.path} element={<PlaceholderPage item={n} />} />
          ))}
          <Route path="/profil" element={<ProfilePage />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
