import { useState } from "react"
import { CheckCircle2, Compass, Search, BookmarkCheck, BookmarkPlus } from "lucide-react"
import { Link } from "react-router-dom"
import useLocalStorage from "../hooks/useLocalStorage"

const SAVED_CAREERS_KEY = "scg-saved-careers"

const careerCatalog = [
  {
    id: "software-engineering",
    title: "Software Engineering",
    field: "Technology & Computing",
    jambSubjects: ["English", "Mathematics", "Physics", "Chemistry"],
    description: "Design, build, and maintain software applications and systems.",
    competitiveness: "Very High",
    universities: ["University of Lagos", "FUTA", "Covenant University"]
  },
  {
    id: "medicine-and-surgery",
    title: "Medicine and Surgery",
    field: "Medical & Health Sciences",
    jambSubjects: ["English", "Biology", "Chemistry", "Physics"],
    description: "Diagnose illnesses, prescribe treatments, and perform surgeries.",
    competitiveness: "Extremely High",
    universities: ["University of Ibadan", "UNILORIN", "UNN"]
  },
  {
    id: "law",
    title: "Law",
    field: "Arts & Humanities",
    jambSubjects: ["English", "Literature", "Government", "CRS/IRS"],
    description: "Study the legal system to represent clients, advise on rights, and uphold justice.",
    competitiveness: "High",
    universities: ["UNILAG", "UI", "UNN"]
  },
  {
    id: "mass-communication",
    title: "Mass Communication",
    field: "Social Sciences",
    jambSubjects: ["English", "Literature", "Government", "Any Art Subject"],
    description: "Broadcast, journal, and manage public relations for media agencies.",
    competitiveness: "Medium",
    universities: ["LASU", "UNILAG", "Babcock University"]
  },
  {
    id: "accounting",
    title: "Accounting",
    field: "Business Administration",
    jambSubjects: ["English", "Mathematics", "Economics", "Any Social Subject"],
    description: "Analyze financial records and prepare audits for organizations.",
    competitiveness: "High",
    universities: ["OAU", "UNILAG", "NOUN"]
  }
]

export default function Careers() {
  const [query, setQuery] = useState("")
  const [savedCareers, setSavedCareers] = useLocalStorage(SAVED_CAREERS_KEY, [])

  const normalizedQuery = query.trim().toLowerCase()
  const savedCareerIds = new Set(savedCareers.map((career) => career.id))

  const filteredCareers = careerCatalog.filter((career) => {
    if (!normalizedQuery) {
      return true
    }

    const haystack = [
      career.title,
      career.field,
      career.description,
      career.competitiveness,
      ...career.jambSubjects,
      ...(career.universities || [])
    ]
      .join(" ")
      .toLowerCase()

    return haystack.includes(normalizedQuery)
  })

  const toggleSavedCareer = (career) => {
    const isSaved = savedCareerIds.has(career.id)

    if (isSaved) {
      setSavedCareers((current) => current.filter((item) => item.id !== career.id))
      return
    }

    setSavedCareers((current) => [
      {
        ...career,
        savedAt: new Date().toISOString()
      },
      ...current
    ])
  }

  return (
    <div className="space-y-6 animate-rise">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl font-bold text-slate-900 dark:text-white">Explore Careers</h1>
          <p className="text-slate-500 mt-1 font-medium">Find your path and check JAMB subject requirements</p>
          <div className="mt-3 flex flex-wrap items-center gap-3 text-xs font-semibold">
            <span className="rounded-full bg-primary/10 px-3 py-1 text-primary">
              {filteredCareers.length} matches
            </span>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
              {savedCareers.length} saved to profile
            </span>
            <Link
              to="/profile"
              className="text-primary transition-colors hover:text-primary/80"
            >
              View profile saves
            </Link>
          </div>
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search professions..."
            className="pl-10 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none w-full font-medium"
          />
        </div>
      </div>

      {filteredCareers.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2">
          {filteredCareers.map((career) => {
            const isSaved = savedCareerIds.has(career.id)

            return (
              <div key={career.id} className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100 dark:border-slate-800 transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] group">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-primary">{career.field}</span>
                    <h3 className="font-display text-2xl font-bold text-slate-800 dark:text-white mt-1 group-hover:text-primary transition-colors">{career.title}</h3>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    <Compass size={20} />
                  </div>
                </div>

                <p className="text-sm text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
                  {career.description}
                </p>

                <div className="bg-slate-50 dark:bg-slate-950 rounded-2xl p-4 border border-slate-100 dark:border-slate-800">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-accent" /> Required JAMB Subjects
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {career.jambSubjects.map((subject) => (
                      <span key={subject} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 px-3 py-1 rounded-lg text-xs font-bold text-slate-700 dark:text-slate-300">
                        {subject}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-6 flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-400">Demand: <span className="text-slate-700 dark:text-slate-300">{career.competitiveness}</span></span>
                  <button
                    type="button"
                    onClick={() => toggleSavedCareer(career)}
                    className={`inline-flex items-center gap-2 font-bold text-sm px-4 py-2 rounded-xl transition-colors ${
                      isSaved
                        ? "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/15 dark:text-emerald-400"
                        : "text-primary bg-primary/10 hover:bg-primary hover:text-white"
                    }`}
                  >
                    {isSaved ? <BookmarkCheck size={16} /> : <BookmarkPlus size={16} />}
                    {isSaved ? "Saved to Profile" : "Save to Profile"}
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-10 text-center shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <p className="font-display text-2xl font-bold text-slate-800 dark:text-slate-100">
            No careers match that search.
          </p>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Try a broader keyword like Engineering, Biology, Literature, or Mathematics.
          </p>
        </div>
      )}
    </div>
  )
}
