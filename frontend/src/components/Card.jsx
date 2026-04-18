export default function Card({ children, className = "" }) {
  return (
    <div
      className={`glass-panel relative overflow-hidden rounded-[28px] p-4 transition duration-300 hover:-translate-y-1 hover:shadow-glow ${className}`}
    >
      <div className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white/70 to-transparent dark:via-white/10" />
      {children}
    </div>
  )
}
