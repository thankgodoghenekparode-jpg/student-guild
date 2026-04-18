import { Moon, Sun } from "lucide-react"

export default function DarkModeToggle({ isDark, onToggle }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/75 px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-primary/20 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-950/70 dark:text-slate-200 dark:hover:text-white"
    >
      {isDark ? <Sun size={14} /> : <Moon size={14} />}
      {isDark ? "Light mode" : "Dark mode"}
    </button>
  )
}
