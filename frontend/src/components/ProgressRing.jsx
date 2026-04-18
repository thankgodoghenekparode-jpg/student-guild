export default function ProgressRing({ value }) {
  return (
    <div className="relative h-20 w-20">
      <svg className="h-full w-full -rotate-90" viewBox="0 0 86 86">
        <circle cx="43" cy="43" r="40" stroke="#E2E8F0" strokeWidth="6" fill="none" />
        <circle
          cx="43"
          cy="43"
          r="40"
          stroke="#4F46E5"
          strokeWidth="6"
          fill="none"
          className="progress-ring"
          style={{ "--progress": value }}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{value}%</span>
      </div>
    </div>
  )
}
