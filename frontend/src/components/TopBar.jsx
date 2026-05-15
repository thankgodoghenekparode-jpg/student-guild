import { NavLink, Link } from "react-router-dom"
import DarkModeToggle from "./DarkModeToggle"
import { BookOpen, Bot, GraduationCap, MonitorPlay, Sparkles, Target } from "lucide-react"

export default function TopBar({ name, isDark, onToggle }) {
  const links = [
    { to: "/", label: "My Journey" },
    { to: "/practice", label: "Practice CBT", icon: MonitorPlay },
    { to: "/courses", label: "Explore Courses", icon: GraduationCap },
    { to: "/quiz", label: "Course Quiz", icon: Sparkles },
    { to: "/mentor", label: "AI Mentor", icon: Bot },
    { to: "/planner", label: "Goals", icon: Target },
    { to: "/advice", label: "Survival Guide", icon: BookOpen },
  ]

  return (
    <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 px-6 py-4 flex items-center justify-between shrink-0">
      <div className="flex items-center gap-8">
        <Link to="/" className="flex items-center gap-2">
           <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/30">
              <Sparkles className="text-white w-4 h-4" />
           </div>
           <span className="font-display font-bold text-lg text-slate-900 dark:text-white tracking-tight">CareerGuide</span>
        </Link>
        <nav className="hidden md:flex items-center gap-1">
          {links.map(l => (
             <NavLink 
               key={l.to} 
               to={l.to} 
               className={({ isActive }) => `px-4 py-2 text-sm font-bold rounded-full transition-colors ${isActive ? 'bg-primary/10 text-primary' : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
             >
               {l.label}
             </NavLink>
          ))}
        </nav>
      </div>

      <div className="flex items-center gap-4">
        <DarkModeToggle isDark={isDark} onToggle={onToggle} />
        
        <Link to="/profile" className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
          <div className="h-6 w-6 rounded-full bg-primary/10 overflow-hidden">
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin" alt="Avatar" className="w-full h-full object-cover" />
          </div>
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300 hidden sm:block">{name || "Student"}</span>
        </Link>
      </div>
    </header>
  )
}
