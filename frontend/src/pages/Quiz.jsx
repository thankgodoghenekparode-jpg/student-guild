import { useEffect, useMemo, useState } from "react"
import { Sparkles } from "lucide-react"
import Card from "../components/Card"
import SectionHeader from "../components/SectionHeader"
import { quizQuestions } from "../data/quizQuestions"
import { getCareerRecommendations } from "../utils/recommendation"
import useLocalStorage from "../hooks/useLocalStorage"

export default function Quiz() {
  const [answers, setAnswers] = useState({})
  const [savedLocal, setSavedLocal] = useLocalStorage("scg-quiz-results", [])
  const [savedResults, setSavedResults] = useState(savedLocal)
  const [recommendations, setRecommendations] = useState([])
  const [loadingRec, setLoadingRec] = useState(false)

  const completed = quizQuestions.every((q) => answers[q.id])

  useEffect(() => {
    if (!completed) return
    const loadRecommendations = async () => {
      setLoadingRec(true)
      try {
        await new Promise(r => setTimeout(r, 600)) // Compute delay
        setRecommendations(getCareerRecommendations(Object.values(answers)))
      } finally {
        setLoadingRec(false)
      }
    }
    loadRecommendations()
  }, [answers, completed])

  useEffect(() => {
    // Only load local storage now
    setSavedResults(savedLocal)
  }, [savedLocal])

  const handleSave = () => {
    if (!completed || recommendations.length === 0) return
    const entry = {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      answers,
      recommendations
    }
    const next = [entry, ...savedLocal].slice(0, 5)
    setSavedLocal(next)
    setSavedResults(next)
  }

  const displayedRecommendations = useMemo(() => recommendations, [recommendations])

  return (
    <div className="space-y-6 animate-rise relative">
      <div className="fixed inset-0 z-[-1] bg-mist dark:bg-slate-950">
        <div className="absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-primary/10 to-transparent dark:from-primary/20" />
      </div>

      <SectionHeader
        title="Career Recommendation Quiz"
        subtitle="Answer a few questions to get AI-powered suggestions"
      />

      <Card className="space-y-6 border-none bg-white p-8 shadow-[0_8px_30px_rgb(0,0,0,0.06)] dark:bg-slate-900 transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.1)]">
        {quizQuestions.map((question, index) => (
          <div key={question.id} className="space-y-4 rounded-2xl border border-slate-100 bg-slate-50/50 p-6 dark:border-slate-800 dark:bg-slate-800/30">
            <div className="flex gap-4">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-sm font-bold text-primary">
                {index + 1}
              </span>
              <p className="pt-1 font-display text-lg font-bold text-slate-800 dark:text-slate-100">
                {question.question}
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 pl-12">
              {question.options.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setAnswers({ ...answers, [question.id]: option })}
                  className={`flex w-full items-center justify-center rounded-xl border px-4 py-3.5 text-sm font-bold transition-all duration-200 hover:-translate-y-0.5 ${
                    answers[question.id] === option
                      ? "border-primary bg-primary text-white shadow-lg shadow-primary/25"
                      : "border-slate-200 bg-white text-slate-600 shadow-sm hover:border-primary/40 hover:text-primary dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-primary/10"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        ))}
      </Card>

      <Card className="space-y-5 border-none shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] bg-white p-6 dark:bg-slate-900">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent shadow-inner">
            <Sparkles size={20} />
          </span>
          <div>
            <p className="text-sm font-bold text-slate-800 dark:text-slate-100">AI Recommendations</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Personalized matches computed from your signals
            </p>
          </div>
        </div>

        {!completed && (
          <div className="rounded-2xl border border-slate-100 bg-slate-50 p-6 text-center dark:border-slate-800 dark:bg-slate-800/50">
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
              Unlock your career paths by answering all questions above.
            </p>
          </div>
        )}

        {completed && loadingRec && (
          <div className="flex items-center justify-center rounded-2xl border border-primary/20 bg-primary/5 p-8 dark:border-primary/30 dark:bg-primary/10">
            <p className="animate-pulse text-sm font-bold text-primary">Computing optimal pathways...</p>
          </div>
        )}

        {completed && !loadingRec && displayedRecommendations.length > 0 && (
          <div className="space-y-4">
            {displayedRecommendations.map((career) => (
              <div key={career.id || career.title} className="rounded-3xl border border-slate-100 bg-slate-50/80 p-5 shadow-sm transition-transform hover:-translate-y-1 dark:border-slate-700 dark:bg-slate-800">
                <p className="font-display text-lg font-bold text-slate-800 dark:text-slate-100">{career.title}</p>
                <p className="mt-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400">{career.description}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {(career.skills || []).map((skill) => (
                    <span
                      key={skill}
                      className="rounded-lg bg-white px-3 py-1.5 text-xs font-bold text-slate-600 shadow-sm dark:bg-slate-900 dark:text-slate-300"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
                <div className="mt-4 space-y-1.5 rounded-2xl bg-white p-4 text-xs text-slate-600 shadow-sm dark:bg-slate-900 dark:text-slate-300">
                  <p><span className="font-bold text-slate-400">Universities:</span> {(career.universities || []).join(", ")}</p>
                  <p><span className="font-bold text-slate-400">Opportunities:</span> {(career.opportunities || []).join(", ")}</p>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={handleSave}
              className="w-full rounded-2xl bg-primary px-4 py-4 text-sm font-bold text-white shadow-[0_4px_14px_0_rgba(79,70,229,0.39)] transition-all hover:-translate-y-1 hover:shadow-[0_6px_20px_rgba(79,70,229,0.23)]"
            >
              Save Results to Dashboard
            </button>
          </div>
        )}
      </Card>

      {savedResults.length > 0 && (
        <Card className="space-y-3">
          <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">Saved Results</p>
          {savedResults.map((result) => (
            <div key={result._id || result.id} className="rounded-2xl border border-slate-200 p-3 text-xs dark:border-slate-700">
              <p className="text-slate-500 dark:text-slate-400">
                {new Date(result.createdAt).toLocaleDateString()} - {(result.recommendations[0]?.title || result.recommendations[0])}
              </p>
            </div>
          ))}
        </Card>
      )}
    </div>
  )
}
