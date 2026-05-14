import { Route, Routes, useLocation, Navigate } from "react-router-dom"
import { Suspense, lazy } from "react"
import TopBar from "./components/TopBar"
import BottomNav from "./components/BottomNav"
import ProtectedRoute from "./components/ProtectedRoute"
import useDarkMode from "./hooks/useDarkMode"
import { useAuth } from "./context/AuthContext"

// Lazy load pages for better performance
const Dashboard = lazy(() => import("./pages/Dashboard"))
const Careers = lazy(() => import("./pages/Careers"))
const Courses = lazy(() => import("./pages/Courses"))
const Quiz = lazy(() => import("./pages/Quiz"))
const Practice = lazy(() => import("./pages/Practice"))
const Planner = lazy(() => import("./pages/Planner"))
const Advice = lazy(() => import("./pages/Advice"))
const Profile = lazy(() => import("./pages/Profile"))
const Scholarships = lazy(() => import("./pages/Scholarships"))
const Auth = lazy(() => import("./pages/Auth"))
const MentorChat = lazy(() => import("./pages/MentorChat"))

export default function App() {
  const { isDark, setIsDark } = useDarkMode()
  const location = useLocation()
  const { token, user, isInitializing } = useAuth()

  const isAuthScreen = location.pathname === "/auth"
  const isProtectedScreen = !isAuthScreen

  if (isAuthScreen && token && user && !isInitializing) {
    return <Navigate to="/" replace />
  }

  if (isProtectedScreen && isInitializing) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-6 text-slate-900 transition-colors dark:bg-slate-950 dark:text-slate-100">
        <div className="max-w-sm rounded-[28px] border border-slate-200/80 bg-white/90 px-6 py-5 text-center shadow-lg dark:border-slate-800 dark:bg-slate-900/90">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-primary">Student Career Guide</p>
          <p className="mt-3 text-sm font-medium text-slate-600 dark:text-slate-300">
            Checking your saved session...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className={`flex flex-col h-screen bg-background text-slate-900 transition-colors dark:bg-slate-950 dark:text-slate-100 overflow-hidden`}>
      {!isAuthScreen && (
        <TopBar
          name={user?.name || "Student"}
          isDark={isDark}
          onToggle={() => setIsDark(!isDark)}
        />
      )}

      <main className={`flex-1 overflow-y-auto pb-24 md:pb-8 ${isAuthScreen ? "" : "p-6 md:p-8 max-w-7xl mx-auto w-full"}`}>
        <Suspense fallback={
          <div className="flex items-center justify-center min-h-[200px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        }>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/careers" element={<ProtectedRoute><Careers /></ProtectedRoute>} />
            <Route path="/courses" element={<ProtectedRoute><Courses /></ProtectedRoute>} />
            <Route path="/quiz" element={<ProtectedRoute><Quiz /></ProtectedRoute>} />
            <Route path="/practice" element={<ProtectedRoute><Practice /></ProtectedRoute>} />
            <Route path="/mentor" element={<ProtectedRoute><MentorChat /></ProtectedRoute>} />
            <Route path="/planner" element={<ProtectedRoute><Planner /></ProtectedRoute>} />
            <Route path="/scholarships" element={<ProtectedRoute><Scholarships /></ProtectedRoute>} />
            <Route path="/advice" element={<ProtectedRoute><Advice /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </main>

      {!isAuthScreen && <BottomNav />}
    </div>
  )
}
