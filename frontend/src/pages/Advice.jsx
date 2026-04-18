import { useEffect, useMemo, useRef, useState } from "react"
import { ArrowUpRight, Award, BookOpen, ExternalLink, Lightbulb, Sparkles } from "lucide-react"
import { Link } from "react-router-dom"
import Card from "../components/Card"
import { advicePosts } from "../data/advice"
import { scholarships } from "../data/scholarships"

const filterOptions = ["All", "Tips", "Guide", "Scholarship"]

const typeMeta = {
  Tips: {
    icon: BookOpen,
    color: "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
  },
  Guide: {
    icon: Lightbulb,
    color: "bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400"
  },
  Scholarship: {
    icon: Award,
    color: "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400"
  }
}

export default function Advice() {
  const [activeFilter, setActiveFilter] = useState("All")
  const [selectedArticleId, setSelectedArticleId] = useState(null)
  const detailRef = useRef(null)

  const articles = useMemo(() => {
    const resourceArticles = advicePosts.map((post) => ({
      ...post,
      ...typeMeta[post.type]
    }))

    const scholarshipArticles = scholarships.slice(0, 3).map((item) => ({
      id: `scholarship-${item.id}`,
      type: "Scholarship",
      title: item.title,
      read: "Funding opportunity",
      summary: item.description,
      body: [
        `Eligibility: ${item.eligibility}`,
        "Review the official provider page for full requirements and the latest updates.",
        "Prepare transcripts, personal statements, and supporting documents early."
      ],
      actionLabel: "View all scholarships",
      actionTo: "/scholarships",
      externalLabel: "Open funding page",
      externalHref: item.link,
      ...typeMeta.Scholarship
    }))

    return [...resourceArticles, ...scholarshipArticles]
  }, [])

  const filteredArticles = useMemo(() => {
    if (activeFilter === "All") {
      return articles
    }

    return articles.filter((article) => article.type === activeFilter)
  }, [activeFilter, articles])

  useEffect(() => {
    if (!filteredArticles.length) {
      setSelectedArticleId(null)
      return
    }

    if (!filteredArticles.some((article) => article.id === selectedArticleId)) {
      setSelectedArticleId(filteredArticles[0].id)
    }
  }, [filteredArticles, selectedArticleId])

  useEffect(() => {
    if (!selectedArticleId || !detailRef.current) {
      return
    }

    detailRef.current.scrollIntoView({
      behavior: "smooth",
      block: "start"
    })
  }, [selectedArticleId])

  const selectedArticle = filteredArticles.find((article) => article.id === selectedArticleId) || null

  const openArticle = (article) => {
    setSelectedArticleId(article.id)
  }

  return (
    <div className="space-y-6 animate-rise">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-4xl font-bold text-slate-900 dark:text-white">Advice & Funding</h1>
          <p className="mt-1 font-medium text-slate-500">Resources to help you pass exams and fund your degree</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {filterOptions.map((option) => {
          const isActive = activeFilter === option

          return (
            <button
              key={option}
              type="button"
              onClick={() => setActiveFilter(option)}
              className={`rounded-full px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] transition-colors ${
                isActive
                  ? "bg-primary text-white shadow-lg shadow-primary/20"
                  : "bg-white text-slate-500 hover:bg-primary/10 hover:text-primary dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-primary/10"
              }`}
            >
              {option}
            </button>
          )
        })}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {filteredArticles.map((article) => (
          <div key={article.id} className="group flex h-full flex-col justify-between rounded-3xl border border-slate-100 bg-white p-6 shadow-sm transition-all hover:border-primary/20 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900">
            <div>
              <div className="mb-4 flex items-start justify-between">
                <div className={`rounded-2xl p-3 ${article.color}`}>
                  <article.icon size={22} />
                </div>
                <button
                  type="button"
                  onClick={() => setActiveFilter(article.type)}
                  className="rounded-full border border-slate-200 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-slate-400 transition-colors hover:border-primary/40 hover:text-primary dark:border-slate-700"
                >
                  {article.type}
                </button>
              </div>

              <h3 className="mb-3 text-xl font-bold leading-snug text-slate-800 transition-colors group-hover:text-primary dark:text-white">
                {article.title}
              </h3>
              <p className="mb-4 text-sm leading-relaxed text-slate-500 dark:text-slate-400">{article.summary}</p>
              <p className="mb-6 text-xs font-bold text-slate-500">{article.read}</p>
            </div>

            <button
              type="button"
              onClick={() => openArticle(article)}
              className="flex w-fit items-center gap-2 rounded-xl bg-primary/5 px-4 py-2 text-sm font-bold text-primary transition-colors hover:bg-primary/10"
            >
              Read More <ArrowUpRight size={16} />
            </button>
          </div>
        ))}
      </div>

      {selectedArticle && (
        <div id="advice-detail" ref={detailRef}>
          <Card className="space-y-6 p-6 sm:p-7">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="max-w-3xl">
                <div className="flex flex-wrap items-center gap-3">
                  <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-[0.22em] ${selectedArticle.color}`}>
                    <selectedArticle.icon size={14} />
                    {selectedArticle.type}
                  </span>
                  <span className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
                    {selectedArticle.read}
                  </span>
                </div>

                <h2 className="mt-4 font-display text-3xl font-bold text-slate-900 dark:text-white">
                  {selectedArticle.title}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                  {selectedArticle.summary}
                </p>
              </div>

              <div className="rounded-2xl bg-primary/10 p-4 text-primary dark:bg-primary/15">
                <Sparkles size={24} />
              </div>
            </div>

            <div className="grid gap-3">
              {selectedArticle.body.map((point) => (
                <div
                  key={point}
                  className="flex items-start gap-3 rounded-2xl border border-slate-100 bg-slate-50/80 px-4 py-4 dark:border-slate-800 dark:bg-slate-950/50"
                >
                  <span className="mt-0.5 h-2.5 w-2.5 rounded-full bg-primary" />
                  <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">{point}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                to={selectedArticle.actionTo}
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-white shadow-lg shadow-primary/20 transition-transform hover:-translate-y-0.5"
              >
                {selectedArticle.actionLabel}
              </Link>

              {selectedArticle.externalHref && (
                <a
                  href={selectedArticle.externalHref}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-700 transition-colors hover:border-primary/30 hover:text-primary dark:border-slate-700 dark:text-slate-200"
                >
                  <ExternalLink size={16} />
                  {selectedArticle.externalLabel}
                </a>
              )}

              <button
                type="button"
                onClick={() => setActiveFilter(selectedArticle.type)}
                className="inline-flex items-center gap-2 rounded-xl bg-slate-100 px-5 py-3 text-sm font-bold text-slate-700 transition-colors hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
              >
                More {selectedArticle.type}
              </button>
            </div>
          </Card>
        </div>
      )}

      <div className="relative mt-8 overflow-hidden rounded-3xl bg-gradient-to-r from-primary to-secondary p-8 text-white shadow-xl shadow-primary/20">
        <div className="absolute right-0 top-0 -mr-8 -mt-8 rotate-12 opacity-20">
          <Award size={200} />
        </div>
        <div className="relative z-10 max-w-xl">
          <h3 className="mb-2 font-display text-2xl font-bold">Need direct guidance?</h3>
          <p className="mb-6 font-medium text-white/80">
            Start with your career quiz so the app can point you toward a realistic next step before you speak with anyone.
          </p>
          <Link to="/quiz" className="inline-block rounded-xl bg-white px-5 py-2.5 font-bold text-primary shadow-lg transition-transform hover:-translate-y-1">
            Start with Career Quiz
          </Link>
        </div>
      </div>
    </div>
  )
}
