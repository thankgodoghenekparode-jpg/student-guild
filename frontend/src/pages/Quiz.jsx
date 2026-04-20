import { useEffect, useMemo, useState } from "react"
import { BookmarkPlus, CheckCircle2, LoaderCircle, Sparkles } from "lucide-react"
import { Link } from "react-router-dom"
import Card from "../components/Card"
import SectionHeader from "../components/SectionHeader"
import { useAuth } from "../context/AuthContext"
import { quizQuestions as fallbackQuestions } from "../data/quizQuestions"
import { apiRequest } from "../utils/api"

export default function Quiz() {
  const { token } = useAuth()
  const [questions, setQuestions] = useState(fallbackQuestions)
  const [answers, setAnswers] = useState({})
  const [recommendations, setRecommendations] = useState([])
  const [savedCourseIds, setSavedCourseIds] = useState([])
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [savingCourseId, setSavingCourseId] = useState("")
  const [error, setError] = useState("")
  const [saveMessage, setSaveMessage] = useState("")

  useEffect(() => {
    let isMounted = true

    async function loadQuestions() {
      try {
        const response = await apiRequest("/recommendations/questions")

        if (isMounted && Array.isArray(response?.items) && response.items.length > 0) {
          setQuestions(response.items)
        }
      } catch {
        if (isMounted) {
          setQuestions(fallbackQuestions)
        }
      } finally {
        if (isMounted) {
          setIsLoadingQuestions(false)
        }
      }
    }

    loadQuestions()

    return () => {
      isMounted = false
    }
  }, [])

  useEffect(() => {
    let isMounted = true

    async function loadSavedCourses() {
      if (!token) {
        return
      }

      try {
        const response = await apiRequest("/courses/saved", { token })

        if (isMounted) {
          setSavedCourseIds((response?.items || []).map((item) => item.courseId))
        }
      } catch {
        if (isMounted) {
          setSavedCourseIds([])
        }
      }
    }

    loadSavedCourses()

    return () => {
      isMounted = false
    }
  }, [token])

  const completedCount = questions.filter((question) => answers[question.category]).length
  const isComplete = useMemo(
    () => questions.length > 0 && questions.every((question) => answers[question.category]),
    [answers, questions]
  )

  const handleSelect = (category, value) => {
    setAnswers((current) => ({
      ...current,
      [category]: value
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError("")
    setSaveMessage("")

    if (!isComplete) {
      setError("Answer all quiz questions to see your top course matches.")
      return
    }

    setIsSubmitting(true)

    try {
      const response = await apiRequest("/recommendations/quiz", {
        method: "POST",
        body: JSON.stringify({ answers })
      })

      setRecommendations(response?.items || [])
    } catch (requestError) {
      setError(requestError.message || "We could not generate your recommendations.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSaveCourse = async (course) => {
    setSavingCourseId(course.courseId)
    setSaveMessage("")

    try {
      await apiRequest(`/courses/${course.courseId}/save`, {
        method: "POST",
        token,
        body: JSON.stringify({
          matchPercentage: course.matchPercentage,
          whyFit: course.whyFit
        })
      })

      setSavedCourseIds((current) => Array.from(new Set([...current, course.courseId])))
      setSaveMessage(`${course.courseTitle} was added to your saved courses.`)
    } catch (requestError) {
      setSaveMessage(requestError.message || "Unable to save course right now.")
    } finally {
      setSavingCourseId("")
    }
  }

  return (
    <div className="relative space-y-6 animate-rise">
      <div className="fixed inset-0 z-[-1] bg-mist dark:bg-slate-950">
        <div className="absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-primary/10 to-transparent dark:from-primary/20" />
      </div>

      <SectionHeader
        title="Course Recommendation Quiz"
        subtitle="Answer a few questions and get your top 3 Nigerian course matches with why they fit."
        action={
          <div className="rounded-2xl bg-primary/10 px-4 py-3 text-right text-xs font-semibold text-primary">
            {completedCount} / {questions.length} answered
          </div>
        }
      />

      <Card className="space-y-6 border-none bg-white p-8 shadow-[0_8px_30px_rgb(0,0,0,0.06)] dark:bg-slate-900">
        {isLoadingQuestions ? (
          <div className="flex items-center justify-center gap-3 rounded-2xl bg-slate-50 p-8 text-sm font-semibold text-slate-500 dark:bg-slate-800/60 dark:text-slate-300">
            <LoaderCircle className="animate-spin" size={18} />
            Loading quiz questions...
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {questions.map((question, index) => (
              <div
                key={question.id}
                className="space-y-4 rounded-2xl border border-slate-100 bg-slate-50/60 p-6 dark:border-slate-800 dark:bg-slate-800/30"
              >
                <div className="flex gap-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-sm font-bold text-primary">
                    {index + 1}
                  </span>
                  <p className="pt-1 font-display text-lg font-bold text-slate-800 dark:text-slate-100">
                    {question.label || question.question}
                  </p>
                </div>

                <div className="grid gap-3 pl-12 sm:grid-cols-2">
                  {question.options.map((option) => {
                    const isActive = answers[question.category] === option.value

                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => handleSelect(question.category, option.value)}
                        className={`flex items-center justify-between rounded-xl border px-4 py-3.5 text-left text-sm font-bold transition-all duration-200 hover:-translate-y-0.5 ${
                          isActive
                            ? "border-primary bg-primary text-white shadow-lg shadow-primary/25"
                            : "border-slate-200 bg-white text-slate-600 shadow-sm hover:border-primary/40 hover:text-primary dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-primary/10"
                        }`}
                      >
                        <span>{option.label}</span>
                        {isActive && <CheckCircle2 size={16} />}
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}

            {error && (
              <div className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-600 dark:border-red-900/40 dark:bg-red-900/10 dark:text-red-300">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-2xl bg-primary px-4 py-4 text-sm font-bold text-white shadow-[0_4px_14px_0_rgba(79,70,229,0.39)] transition-all hover:-translate-y-1 hover:shadow-[0_6px_20px_rgba(79,70,229,0.23)] disabled:opacity-70 disabled:hover:translate-y-0"
            >
              {isSubmitting ? "Generating recommendations..." : "Show My Top 3 Courses"}
            </button>
          </form>
        )}
      </Card>

      <Card className="space-y-5 border-none bg-white p-6 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] dark:bg-slate-900">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent shadow-inner">
            <Sparkles size={20} />
          </span>
          <div>
            <p className="text-sm font-bold text-slate-800 dark:text-slate-100">Top 3 Recommended Courses</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Each result includes match score, subject requirements, careers, and side skills to develop.
            </p>
          </div>
        </div>

        {saveMessage && (
          <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-900/10 dark:text-emerald-300">
            {saveMessage}
          </div>
        )}

        {recommendations.length === 0 ? (
          <div className="rounded-2xl border border-slate-100 bg-slate-50 p-6 text-center dark:border-slate-800 dark:bg-slate-800/50">
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
              Complete the quiz to unlock your personalized course recommendations.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {recommendations.map((course, index) => {
              const isSaved = savedCourseIds.includes(course.courseId)

              return (
                <div
                  key={course.courseId}
                  className="rounded-3xl border border-slate-100 bg-slate-50/80 p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800"
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-primary px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-white">
                          #{index + 1} Match
                        </span>
                        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500 dark:bg-slate-900 dark:text-slate-300">
                          {course.institutionType}
                        </span>
                        <span className="rounded-full bg-accent/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-accent">
                          {course.matchPercentage}% match
                        </span>
                      </div>
                      <h3 className="mt-3 font-display text-2xl font-semibold text-slate-900 dark:text-white">
                        {course.courseTitle}
                      </h3>
                      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{course.summary}</p>
                    </div>

                    <div className="rounded-2xl bg-white px-4 py-3 text-center shadow-sm dark:bg-slate-900">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">
                        Cut-off mark
                      </p>
                      <p className="mt-1 text-2xl font-bold text-primary">{course.cutoffMark}</p>
                    </div>
                  </div>

                  <div className="mt-5 grid gap-4 lg:grid-cols-2">
                    <div className="rounded-[24px] bg-white p-4 shadow-sm dark:bg-slate-900">
                      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
                        Why this fits you
                      </p>
                      <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                        {course.whyFit}
                      </p>
                    </div>

                    <div className="rounded-[24px] bg-white p-4 shadow-sm dark:bg-slate-900">
                      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
                        Required subjects
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {course.requiredSubjects.map((subject) => (
                          <span
                            key={subject}
                            className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200"
                          >
                            {subject}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 grid gap-4 lg:grid-cols-3">
                    <div className="rounded-[24px] bg-white p-4 shadow-sm dark:bg-slate-900">
                      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
                        JAMB combination
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {course.jambCombination.map((subject) => (
                          <span
                            key={subject}
                            className="rounded-full bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary"
                          >
                            {subject}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-[24px] bg-white p-4 shadow-sm dark:bg-slate-900">
                      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
                        Possible careers
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {course.possibleCareers.map((career) => (
                          <span
                            key={career}
                            className="rounded-full bg-secondary/10 px-3 py-1.5 text-xs font-semibold text-secondary"
                          >
                            {career}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-[24px] bg-white p-4 shadow-sm dark:bg-slate-900">
                      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
                        Recommended tech/side skills
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {course.recommendedTechSkills.map((skill) => (
                          <span
                            key={skill}
                            className="rounded-full bg-accent/10 px-3 py-1.5 text-xs font-semibold text-accent"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={() => handleSaveCourse(course)}
                      disabled={isSaved || savingCourseId === course.courseId}
                      className={`inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-bold transition-transform ${
                        isSaved
                          ? "cursor-default bg-emerald-500/10 text-emerald-600 dark:text-emerald-300"
                          : "bg-primary text-white shadow-lg shadow-primary/20 hover:-translate-y-0.5"
                      }`}
                    >
                      <BookmarkPlus size={16} />
                      {isSaved
                        ? "Saved Course"
                        : savingCourseId === course.courseId
                          ? "Saving..."
                          : "Save Course"}
                    </button>

                    <Link
                      to="/profile"
                      className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-700 transition-colors hover:border-primary/30 hover:text-primary dark:border-slate-700 dark:text-slate-200"
                    >
                      View Saved Courses
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </Card>
    </div>
  )
}
