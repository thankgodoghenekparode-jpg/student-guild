import { useState } from "react"
import { ExternalLink, Star } from "lucide-react"
import Card from "../components/Card"
import SearchBar from "../components/SearchBar"
import SectionHeader from "../components/SectionHeader"
import { scholarships as fallback } from "../data/scholarships"

const categories = [
  "Local scholarships",
  "International scholarships",
  "Skill programs",
  "Internship opportunities"
]

export default function Scholarships() {
  const [query, setQuery] = useState("")

  const normalizedQuery = query.trim().toLowerCase()
  const items = fallback.filter(({ title, description, eligibility }) => {
    if (!normalizedQuery) {
      return true
    }

    return [title, description, eligibility].join(" ").toLowerCase().includes(normalizedQuery)
  })

  return (
    <div className="space-y-6 animate-rise">
      <SectionHeader
        title="Scholarships & Opportunities"
        subtitle="Stay updated on funding, internships, and skill-building programs."
      />

      <Card className="space-y-5 p-6 sm:p-7">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-primary/75">
              Opportunity tracker
            </p>
            <h3 className="mt-2 font-display text-2xl font-semibold text-slate-900 dark:text-white">
              Search opportunities that match your current stage
            </h3>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Filter by scholarship name, eligibility, or the kind of program you want next.
            </p>
          </div>

          <div className="w-full max-w-xl">
            <SearchBar
              value={query}
              onChange={setQuery}
              placeholder="Search scholarships, internships, or eligibility..."
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <span
              key={category}
              className="rounded-full bg-accent/20 px-3 py-1.5 text-xs font-semibold text-slate-600 dark:bg-accent/10 dark:text-slate-200"
            >
              {category}
            </span>
          ))}
        </div>
      </Card>

      {items.length > 0 ? (
        <div className="space-y-4">
          {items.map((item) => (
            <Card key={item.id || item._id} className="space-y-3 p-6 sm:p-7">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-primary/75">
                    Funding match
                  </p>
                  <p className="mt-2 text-lg font-semibold text-slate-800 dark:text-slate-100">
                    {item.title}
                  </p>
                </div>

                <span className="rounded-full bg-primary/10 p-2 text-primary dark:bg-primary/15">
                  <Star size={14} />
                </span>
              </div>

              <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                {item.description}
              </p>

              <div className="rounded-[24px] border border-slate-200/80 bg-slate-50/80 p-4 dark:border-slate-800 dark:bg-slate-950/60">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">
                  Eligibility
                </p>
                <p className="mt-2 text-sm font-medium text-slate-700 dark:text-slate-200">
                  {item.eligibility}
                </p>
              </div>

              <a
                href={item.link}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-primary/80"
              >
                <ExternalLink size={14} />
                Open application link
              </a>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-8 text-center">
          <p className="font-display text-2xl font-semibold text-slate-900 dark:text-white">
            No opportunities match that search yet.
          </p>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Try a broader keyword like scholarship, internship, CGPA, or graduate.
          </p>
        </Card>
      )}
    </div>
  )
}
