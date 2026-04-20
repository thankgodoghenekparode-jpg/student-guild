import { BookOpen, Bot, GraduationCap, Home, MonitorPlay, Sparkles } from "lucide-react"
import { NavLink, useLocation } from "react-router-dom"

const links = [
  { to: "/", label: "Home", icon: Home },
  { to: "/practice", label: "CBT", icon: MonitorPlay },
  { to: "/quiz", label: "Quiz", icon: Sparkles },
  { to: "/courses", label: "Courses", icon: GraduationCap },
  { to: "/mentor", label: "Mentor", icon: Bot },
  { to: "/advice", label: "Guide", icon: BookOpen },
]

export default function BottomNav() {
  const location = useLocation()

  return (
    <nav className="fixed bottom-4 left-0 right-0 z-40 px-4 md:hidden">
      <div className="glass-panel mx-auto flex items-center justify-between rounded-[28px] px-3 py-2.5 shadow-2xl shadow-slate-900/10">
        {links.map(({ to, label, icon: Icon }) => {
          const isActive = location.pathname === to

          return (
            <NavLink
              key={to}
              to={to}
              className={`flex min-w-0 flex-1 flex-col items-center gap-1 rounded-2xl px-1 py-1 text-[10px] font-bold transition-all duration-300 ${
                isActive ? "text-primary scale-105" : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
              }`}
            >
              <span className={`rounded-xl p-2.5 transition-colors ${isActive ? 'bg-primary/10' : 'bg-transparent'}`}>
                <Icon size={18} />
              </span>
              <span className="truncate">{label}</span>
            </NavLink>
          )
        })}
      </div>
    </nav>
  )
}
