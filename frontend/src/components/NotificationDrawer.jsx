import Card from "./Card"

export default function NotificationDrawer({ open, notifications, onClose }) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/55 backdrop-blur-sm">
      <div className="absolute right-4 top-4 w-[92%] max-w-md">
        <Card className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-primary/70">
                Updates
              </p>
              <h3 className="mt-1 font-display text-lg font-semibold text-slate-900 dark:text-white">
                Scholarship Alerts
              </h3>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-slate-200/70 px-3 py-1.5 text-xs font-semibold text-slate-500 transition hover:border-primary/20 hover:text-primary dark:border-slate-700 dark:text-slate-300"
            >
              Close
            </button>
          </div>

          <div className="space-y-3">
            {notifications.map((note) => (
              <div
                key={note.id}
                className="rounded-3xl border border-slate-200/70 bg-white/60 p-4 dark:border-slate-700/80 dark:bg-slate-900/45"
              >
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{note.title}</p>
                <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">{note.detail}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
