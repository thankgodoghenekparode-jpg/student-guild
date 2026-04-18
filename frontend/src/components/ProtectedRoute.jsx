import { Navigate, useLocation } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

export default function ProtectedRoute({ children }) {
  const { token, isInitializing } = useAuth()
  const location = useLocation()

  if (isInitializing) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="rounded-3xl border border-slate-200 bg-white/90 px-6 py-4 text-sm font-semibold text-slate-600 shadow-sm dark:border-slate-800 dark:bg-slate-900/90 dark:text-slate-300">
          Restoring your session...
        </div>
      </div>
    )
  }

  if (!token) {
    return <Navigate to="/auth" replace state={{ from: location.pathname }} />
  }

  return children
}
