import { useEffect, useMemo, useRef, useState } from "react"
import { ArrowUpRight, ExternalLink, GraduationCap, Lightbulb, Sparkles } from "lucide-react"
import { Link } from "react-router-dom"
import Card from "../components/Card"
import { articleCategories } from "../data/articleCategories"
import { apiRequest, resolveAssetUrl } from "../utils/api"
import { isTransientRequestError, requestWithRetry } from "../utils/requestRetry"
import authBg from "../assets/images/auth-bg.jpg"
import courseThumb from "../assets/images/course-thumb.jpg"
import coursesBg from "../assets/images/courses-bg.jpg"
import dashboardHero from "../assets/images/dashboard-hero.jpg"
import profileHeader from "../assets/images/profile-header.jpg"

const filterOptions = ["All", ...articleCategories]

const categoryImages = {
  "Financial discipline": dashboardHero,
  "Avoiding bad influence": profileHeader,
  "Study techniques": coursesBg,
  "Skill development": courseThumb,
  "Internship preparation": authBg
}

function getArticleLoadErrorMessage(error) {
  if (isTransientRequestError(error)) {
    return "Could not reach the survival guide yet. The backend may still be starting. Try again."
  }

  return error?.message || "Unable to load survival guide articles."
}

function getArticleImageUrl(article) {
  return resolveAssetUrl(article.imageUrl) || categoryImages[article.category] || dashboardHero
}

function ArticleImage({ article }) {
  const fallbackImage = categoryImages[article.category] || dashboardHero
  const [src, setSrc] = useState(() => getArticleImageUrl(article))

  useEffect(() => {
    setSrc(getArticleImageUrl(article))
  }, [article])

  return (
    <img
      src={src}
      alt={article.title}
      className="h-48 w-full object-cover"
      onError={() => {
        if (src !== fallbackImage) {
          setSrc(fallbackImage)
        }
      }}
    />
  )
}

export default function Advice() {
  const [activeFilter, setActiveFilter] = useState("All")
  const [selectedArticleId, setSelectedArticleId] = useState(null)
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [reloadCount, setReloadCount] = useState(0)
  const detailRef = useRef(null)

  useEffect(() => {
    let isMounted = true

    async function loadArticles() {
      setLoading(true)
      setError("")

      try {
        const response = await requestWithRetry(() => apiRequest("/articles"))

        if (isMounted) {
          setArticles(response?.items || [])
          setError("")
        }
      } catch (requestError) {
        if (isMounted) {
          setError(getArticleLoadErrorMessage(requestError))
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    loadArticles()

    return () => {
      isMounted = false
    }
  }, [reloadCount])

  const filteredArticles = useMemo(() => {
    if (activeFilter === "All") {
      return articles
    }

    return articles.filter((article) => article.category === activeFilter)
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

  const handleSelectArticle = (articleId) => {
    if (selectedArticleId === articleId) {
      detailRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start"
      })
      return
    }

    setSelectedArticleId(articleId)
  }

  return (
    <div className="space-y-6 animate-rise">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-4xl font-bold text-slate-900 dark:text-white">Student Survival Guide</h1>
          <p className="mt-1 font-medium text-slate-500">
            Read admin-managed articles on money, discipline, study methods, skill growth, and internship readiness.
          </p>
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

      {error && (
        <div className="flex flex-col gap-3 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-600 dark:border-red-900/40 dark:bg-red-900/10 dark:text-red-300 sm:flex-row sm:items-center sm:justify-between">
          <span>{error}</span>
          <button
            type="button"
            onClick={() => setReloadCount((count) => count + 1)}
            disabled={loading}
            className="inline-flex w-fit items-center rounded-full border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-700 transition-colors hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-70 dark:border-red-800 dark:text-red-200 dark:hover:bg-red-900/20"
          >
            {loading ? "Retrying..." : "Retry"}
          </button>
        </div>
      )}

      {loading ? (
        <Card className="p-8 text-center">
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Loading survival guide articles...</p>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {filteredArticles.map((article) => {
            return (
              <div
                key={article.id}
                className="group flex h-full flex-col overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm transition-all hover:border-primary/20 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900"
              >
                <ArticleImage article={article} />

                <div className="flex flex-1 flex-col justify-between p-6">
                  <div>
                    <div className="mb-4 flex items-start justify-between gap-3">
                      <span className="rounded-full bg-primary/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-primary">
                        {article.category}
                      </span>
                      <span className="text-xs font-semibold text-slate-400">{article.readTimeMinutes} min read</span>
                    </div>

                    <h3 className="mb-3 text-xl font-bold leading-snug text-slate-800 transition-colors group-hover:text-primary dark:text-white">
                      {article.title}
                    </h3>
                    <p className="mb-6 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                      {article.summary}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleSelectArticle(article.id)}
                    aria-controls="guide-detail"
                    aria-expanded={selectedArticleId === article.id}
                    className="flex w-fit items-center gap-2 rounded-xl bg-primary/5 px-4 py-2 text-sm font-bold text-primary transition-colors hover:bg-primary/10"
                  >
                    {selectedArticleId === article.id ? "Jump to Guide" : "Read More"} <ArrowUpRight size={16} />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {filteredArticles.length === 0 && !loading && !error && (
        <Card className="p-8 text-center">
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
            No articles found in this category. Try a different filter.
          </p>
        </Card>
      )}

      {selectedArticle && (
        <div id="guide-detail" ref={detailRef}>
          <Card className="space-y-6 p-6 sm:p-7">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="max-w-3xl">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.22em] text-primary">
                    <Lightbulb size={14} />
                    {selectedArticle.category}
                  </span>
                  <span className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
                    {selectedArticle.readTimeMinutes} minute read
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
              {selectedArticle.content.map((point) => (
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
                to="/quiz"
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-white shadow-lg shadow-primary/20 transition-transform hover:-translate-y-0.5"
              >
                <GraduationCap size={16} />
                Take Course Quiz
              </Link>

              <Link
                to="/mentor"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-700 transition-colors hover:border-primary/30 hover:text-primary dark:border-slate-700 dark:text-slate-200"
              >
                <ExternalLink size={16} />
                Ask AI Mentor
              </Link>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
