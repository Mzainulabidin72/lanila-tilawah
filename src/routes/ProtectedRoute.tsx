import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { FullScreenLoader } from '@/components/shared/FullScreenLoader'

export function ProtectedRoute() {
  const { session, loading } = useAuth()
  const location = useLocation()

  if (loading) return <FullScreenLoader label="Memeriksa sesi…" />
  if (!session) return <Navigate to="/login" replace state={{ from: location.pathname }} />
  return <Outlet />
}

export function PublicOnlyRoute() {
  const { session, loading, isRecovery } = useAuth()

  if (loading) return <FullScreenLoader />
  if (session && !isRecovery) return <Navigate to="/" replace />
  return <Outlet />
}
