import { LockKeyhole, UserRound } from "lucide-react"
import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import Card from "../components/Card"
import SectionHeader from "../components/SectionHeader"
import { useAuth } from "../context/AuthContext"
import authBg from "../assets/images/auth-bg.jpg"

export default function Auth() {
  const [mode, setMode] = useState("login")
  const [form, setForm] = useState({ name: "", email: "", password: "" })
  const { login, register, loading, error, setError, user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (user) {
      const redirectTo = location.state?.from || "/profile"
      navigate(redirectTo, { replace: true })
    }
  }, [user, location.state, navigate])

  const handleChange = (field) => (event) => {
    setForm({ ...form, [field]: event.target.value })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError("")
    try {
      if (mode === "login") {
        await login({ email: form.email, password: form.password })
      } else {
        await register({ name: form.name, email: form.email, password: form.password })
      }
      const redirectTo = location.state?.from || "/profile"
      navigate(redirectTo)
    } catch {
      // errors handled in context
    }
  }

  return (
    <div className="space-y-6 animate-rise relative">
      {/* Minimal clean background */}
      <div className="fixed inset-0 z-[-1] bg-mist dark:bg-slate-950">
        <div className="absolute inset-0 bg-cover bg-center opacity-5 dark:opacity-10" style={{ backgroundImage: `url(${authBg})` }} />
      </div>

      <SectionHeader
        title="Student Account"
        subtitle="Save your quiz results, bookmarks, and progress"
      />

      <div className="grid gap-8 lg:grid-cols-[1.2fr,0.8fr]">
        <Card className="space-y-6 border-none bg-white p-8 shadow-[0_8px_30px_rgb(0,0,0,0.06)] dark:bg-slate-900 transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.1)]">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-primary">
                Account Access
              </p>
              <h3 className="mt-1 font-display text-2xl font-bold text-slate-900 dark:text-white">
                {mode === "login" ? "Welcome back" : "Create account"}
              </h3>
            </div>
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-inner">
              <LockKeyhole size={20} />
            </span>
          </div>

          <div className="flex w-fit gap-2 rounded-2xl bg-slate-50 p-1.5 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] dark:bg-slate-800">
            {["login", "register"].map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setMode(item)}
                className={`flex-1 rounded-xl px-5 py-2 text-xs font-bold transition-all duration-300 ${
                  mode === item
                    ? "bg-white text-primary shadow-sm dark:bg-slate-950"
                    : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                }`}
              >
                {item === "login" ? "Sign In" : "Register"}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 pt-2">
            {mode === "register" && (
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600 dark:text-slate-400">Full Name</label>
                <input
                  value={form.name}
                  onChange={handleChange("name")}
                  placeholder="e.g. Jane Doe"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition-all duration-200 focus:border-primary/50 focus:bg-white focus:ring-4 focus:ring-primary/10 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:focus:bg-slate-900"
                  required
                />
              </div>
            )}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600 dark:text-slate-400">Email Address</label>
              <input
                value={form.email}
                onChange={handleChange("email")}
                placeholder="you@example.com"
                type="email"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition-all duration-200 focus:border-primary/50 focus:bg-white focus:ring-4 focus:ring-primary/10 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:focus:bg-slate-900"
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600 dark:text-slate-400">Password</label>
              <input
                value={form.password}
                onChange={handleChange("password")}
                type="password"
                placeholder="********"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition-all duration-200 focus:border-primary/50 focus:bg-white focus:ring-4 focus:ring-primary/10 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:focus:bg-slate-900"
                required
              />
            </div>

            {error && (
              <div className="rounded-xl border border-red-100 bg-red-50 p-4 dark:border-red-900/50 dark:bg-red-900/10">
                <p className="text-xs font-bold text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-6 w-full rounded-xl bg-primary px-4 py-3.5 text-sm font-bold text-white shadow-[0_4px_14px_0_rgba(79,70,229,0.39)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(79,70,229,0.23)] disabled:opacity-70 disabled:hover:translate-y-0"
            >
              {loading ? "Please wait..." : mode === "login" ? "Sign In to Account" : "Create Account"}
            </button>
          </form>
        </Card>

        <Card className="flex flex-col space-y-6 border-none bg-white p-8 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] dark:bg-slate-900">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-secondary">
                Why it matters
              </p>
              <h3 className="mt-1 font-display text-xl font-bold text-slate-900 dark:text-white">
                Track your success
              </h3>
            </div>
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary/10 text-secondary">
              <UserRound size={18} />
            </span>
          </div>

          <div className="space-y-4">
            {[
              "Save quiz results so your career recommendations stay easy to revisit.",
              "Bookmark courses and scholarships that fit your goals.",
              "Connect to the Express and MongoDB backend when configured."
            ].map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-slate-100 bg-slate-50/50 p-4 text-sm leading-relaxed text-slate-600 transition-colors hover:border-secondary/20 hover:bg-secondary/5 dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-300 dark:hover:bg-secondary/10"
              >
                {item}
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
