import { useMemo, useState } from "react"
import { Briefcase, CheckCircle2, GraduationCap, Layers3, Sparkles } from "lucide-react"
import Card from "../components/Card"
import SearchBar from "../components/SearchBar"
import SectionHeader from "../components/SectionHeader"
import { courseSearchSuggestions, courses } from "../data/courses"

const typeFilters = ["All", "University", "Polytechnic"]

const quickSearches = [
  "Computer Science",
  "Nursing Science",
  "Mass Communication",
  "Electrical and Electronic Engineering Technology",
  "Business Administration and Management",
  "Architecture",
  "Aeronautical Engineering",
  "Occupational Therapy",
  "Animation and Game Art"
]

export default function Courses() {
  const [query, setQuery] = useState("")
  const [activeType, setActiveType] = useState("All")

  const counts = useMemo(
    () => ({
      total: courses.length,
      university: courses.filter((course) => course.type === "University").length,
      polytechnic: courses.filter((course) => course.type === "Polytechnic").length
    }),
    []
  )

  const filteredCourses = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()

    return courses
      .filter((course) => {
        const matchesType = activeType === "All" || course.type === activeType

        if (!matchesType) {
          return false
        }

        if (!normalizedQuery) {
          return true
        }

        const haystack = [
          course.name,
          course.type,
          course.category,
          course.overview,
          ...(course.aliases || []),
          ...course.waecSubjects,
          ...course.jambCombo,
          ...course.careers
        ]
          .join(" ")
          .toLowerCase()

        return haystack.includes(normalizedQuery)
      })
      .sort((left, right) => {
        const leftExact = left.name.toLowerCase() === normalizedQuery
        const rightExact = right.name.toLowerCase() === normalizedQuery

        if (leftExact !== rightExact) {
          return leftExact ? -1 : 1
        }

        const leftStarts = left.name.toLowerCase().startsWith(normalizedQuery)
        const rightStarts = right.name.toLowerCase().startsWith(normalizedQuery)

        if (leftStarts !== rightStarts) {
          return leftStarts ? -1 : 1
        }

        if (left.type !== right.type) {
          return left.type.localeCompare(right.type)
        }

        return left.name.localeCompare(right.name)
      })
  }, [activeType, query])

  return (
    <div className="space-y-6 animate-rise">
      <SectionHeader
        title="Explore Courses"
        subtitle="Search a broader university and polytechnic catalog, then compare WAEC focus, JAMB combinations, and likely outcomes."
      />

      <Card className="space-y-5 p-6 sm:p-7">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-primary/75">
              Course finder
            </p>
            <h3 className="mt-2 font-display text-2xl font-semibold text-slate-900 dark:text-white">
              Browse university and polytechnic options in one place
            </h3>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Search by course name, institution level, subject area, or career path. The suggestion box now helps surface likely matches faster.
            </p>
          </div>

          <div className="w-full max-w-xl">
            <SearchBar
              value={query}
              onChange={setQuery}
              placeholder="Search university or polytechnic courses..."
              suggestions={courseSearchSuggestions}
              listId="course-catalog-suggestions"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {typeFilters.map((filter) => {
            const isActive = activeType === filter

            return (
              <button
                key={filter}
                type="button"
                onClick={() => setActiveType(filter)}
                className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                  isActive
                    ? "bg-primary text-white shadow-lg shadow-primary/20"
                    : "bg-primary/10 text-primary hover:bg-primary/15 dark:bg-primary/15 dark:text-primary"
                }`}
              >
                {filter}
              </button>
            )
          })}
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          <div className="rounded-[24px] border border-slate-200/80 bg-white/70 p-4 dark:border-slate-800 dark:bg-slate-950/60">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">
              Total catalog
            </p>
            <p className="mt-2 font-display text-3xl font-semibold text-slate-900 dark:text-white">
              {counts.total}
            </p>
          </div>
          <div className="rounded-[24px] border border-slate-200/80 bg-white/70 p-4 dark:border-slate-800 dark:bg-slate-950/60">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">
              University
            </p>
            <p className="mt-2 font-display text-3xl font-semibold text-slate-900 dark:text-white">
              {counts.university}
            </p>
          </div>
          <div className="rounded-[24px] border border-slate-200/80 bg-white/70 p-4 dark:border-slate-800 dark:bg-slate-950/60">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">
              Polytechnic
            </p>
            <p className="mt-2 font-display text-3xl font-semibold text-slate-900 dark:text-white">
              {counts.polytechnic}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {quickSearches.map((term) => (
            <button
              key={term}
              type="button"
              onClick={() => setQuery(term)}
              className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
                query === term
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-slate-200 text-slate-600 hover:border-primary/30 hover:text-primary dark:border-slate-700 dark:text-slate-300"
              }`}
            >
              {term}
            </button>
          ))}
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400">
          Showing <span className="font-semibold text-slate-700 dark:text-slate-200">{filteredCourses.length}</span> of{" "}
          <span className="font-semibold text-slate-700 dark:text-slate-200">{counts.total}</span> courses. Exact subject requirements may vary by institution, so treat this as a planning guide and confirm final eligibility with JAMB/IBASS.
        </p>
      </Card>

      {filteredCourses.length > 0 ? (
        <div className="grid gap-5 lg:grid-cols-2 xl:grid-cols-3">
          {filteredCourses.map((course) => (
            <Card key={course.id} className="space-y-5 p-6 sm:p-7">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] ${
                      course.type === "University"
                        ? "bg-primary/10 text-primary dark:bg-primary/15"
                        : "bg-secondary/10 text-secondary dark:bg-secondary/15"
                    }`}>
                      {course.type}
                    </span>
                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500 dark:bg-slate-800 dark:text-slate-300">
                      {course.category}
                    </span>
                  </div>
                  <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.26em] text-primary/75">
                    {course.careers.length} career paths
                  </p>
                  <h3 className="mt-2 font-display text-2xl font-semibold text-slate-900 dark:text-white">
                    {course.name}
                  </h3>
                </div>

                <span className="rounded-2xl bg-primary/10 p-3 text-primary dark:bg-primary/15">
                  <GraduationCap size={22} />
                </span>
              </div>

              <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                {course.overview}
              </p>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-[24px] border border-slate-200/80 bg-white/70 p-4 dark:border-slate-800 dark:bg-slate-950/60">
                  <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">
                    <CheckCircle2 size={14} className="text-accent" />
                    WAEC focus
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {course.waecSubjects.map((subject) => (
                      <span
                        key={subject}
                        className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:bg-slate-900 dark:text-slate-200"
                      >
                        {subject}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="rounded-[24px] border border-slate-200/80 bg-white/70 p-4 dark:border-slate-800 dark:bg-slate-950/60">
                  <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">
                    <Sparkles size={14} className="text-primary" />
                    JAMB combination
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {course.jambCombo.map((subject) => (
                      <span
                        key={subject}
                        className="rounded-full bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary dark:bg-primary/15"
                      >
                        {subject}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="rounded-[24px] border border-slate-200/80 bg-gradient-to-r from-slate-50 to-white p-4 dark:border-slate-800 dark:from-slate-950 dark:to-slate-900">
                <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">
                  <Briefcase size={14} className="text-secondary" />
                  Possible outcomes
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {course.careers.map((career) => (
                    <span
                      key={career}
                      className="rounded-full border border-secondary/20 bg-secondary/10 px-3 py-1.5 text-xs font-semibold text-secondary dark:border-secondary/30 dark:bg-secondary/15"
                    >
                      {career}
                    </span>
                  ))}
                </div>
              </div>

              {course.aliases?.length > 0 && (
                <div className="rounded-[24px] border border-dashed border-slate-200/80 p-4 dark:border-slate-800">
                  <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">
                    <Layers3 size={14} className="text-primary" />
                    Also searchable as
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {course.aliases.map((alias) => (
                      <button
                        key={alias}
                        type="button"
                        onClick={() => setQuery(alias)}
                        className="rounded-full border border-primary/20 bg-primary/5 px-3 py-1.5 text-xs font-semibold text-primary transition-colors hover:bg-primary/10"
                      >
                        {alias}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-8 text-center">
          <p className="font-display text-2xl font-semibold text-slate-900 dark:text-white">
            No courses match that search yet.
          </p>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Try a broader course title, switch between university and polytechnic, or use one of the quick search chips above.
          </p>
        </Card>
      )}
    </div>
  )
}
