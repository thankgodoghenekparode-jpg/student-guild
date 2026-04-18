import { Quote } from "lucide-react"
import Card from "./Card"

export default function QuoteCard({ quote }) {
  return (
    <Card className="bg-gradient-to-br from-primary/10 via-white/80 to-accent/25 dark:from-primary/15 dark:via-slate-900/90 dark:to-accent/10">
      <div className="flex items-start gap-4">
        <span className="rounded-2xl bg-primary/15 p-3 text-primary dark:text-primary/80">
          <Quote size={18} />
        </span>
        <div>
          <p className="font-display text-lg font-medium leading-8 text-slate-800 dark:text-slate-100">
            "{quote.text}"
          </p>
          <p className="mt-3 text-xs font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">
            {quote.author}
          </p>
        </div>
      </div>
    </Card>
  )
}
