import { Bell } from "lucide-react"

export default function NotificationBell({ count, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="relative rounded-full border border-white/70 bg-white/75 p-2.5 text-slate-600 shadow-sm transition hover:-translate-y-0.5 hover:border-primary/20 hover:text-primary dark:border-slate-700 dark:bg-slate-950/70 dark:text-slate-200"
    >
      <Bell size={17} />
      {count > 0 && (
        <span className="absolute -right-1 -top-1 min-w-[1.2rem] rounded-full bg-primary px-1.5 py-0.5 text-center text-[9px] font-semibold text-white shadow-lg shadow-primary/30">
          {count}
        </span>
      )}
    </button>
  )
}
