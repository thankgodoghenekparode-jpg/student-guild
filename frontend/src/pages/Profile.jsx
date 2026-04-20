import { Heart, LogOut, Star, Target, Trash2 } from "lucide-react"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import useLocalStorage from "../hooks/useLocalStorage"
import { apiRequest } from "../utils/api"

const SAVED_CAREERS_KEY = "scg-saved-careers"

export default function Profile() {
  const navigate = useNavigate()
  const { token, user, logout } = useAuth()
  const [savedCareers, setSavedCareers] = useLocalStorage(SAVED_CAREERS_KEY, [])
  const [savedCourses, setSavedCourses] = useState([])
  const [loadingCourses, setLoadingCourses] = useState(true)
  const [courseError, setCourseError] = useState("")

  useEffect(() => {
    let isMounted = true

    async function loadSavedCourses() {
      if (!token) {
        setLoadingCourses(false)
        return
      }

      try {
        const response = await apiRequest("/courses/saved", { token })

        if (isMounted) {
          setSavedCourses(response?.items || [])
        }
      } catch (requestError) {
        if (isMounted) {
          setCourseError(requestError.message || "Unable to load saved courses.")
        }
      } finally {
        if (isMounted) {
          setLoadingCourses(false)
        }
      }
    }

    loadSavedCourses()

    return () => {
      isMounted = false
    }
  }, [token])

  const aspiration = savedCourses[0]?.course?.title || savedCareers[0]?.title || "Aspiring Student"

  const removeSavedCareer = (careerId) => {
    setSavedCareers((current) => current.filter((career) => career.id !== careerId))
  }

  const removeSavedCourse = async (savedCourseId) => {
    try {
      await apiRequest(`/courses/saved/${savedCourseId}`, {
        method: "DELETE",
        token
      })

      setSavedCourses((current) => current.filter((item) => item.id !== savedCourseId))
    } catch (requestError) {
      setCourseError(requestError.message || "Unable to remove saved course.")
    }
  }

  const handleSignOut = () => {
    logout()
    navigate("/auth")
  }

  return (
    <div className="space-y-6 animate-rise">
      <div className="relative overflow-hidden rounded-3xl border border-slate-100 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-r from-primary/80 to-secondary/80 mix-blend-multiply" />

        <div className="relative z-10 mt-6 flex flex-col items-center gap-6 sm:flex-row sm:items-end">
          <div className="h-24 w-24 shrink-0 rounded-full bg-white p-1.5 shadow-lg dark:bg-slate-900">
            <div className="h-full w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
              <img
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin"
                alt="Avatar"
                className="h-full w-full object-cover"
              />
            </div>
          </div>

          <div className="pb-1 text-center sm:text-left">
            <h1 className="font-display text-3xl font-bold text-slate-900 dark:text-white">
              {user?.name || "Student"}
            </h1>
            <p className="font-medium text-slate-500">{aspiration}</p>
            <p className="mt-1 text-sm text-slate-400">{user?.email || "No email available"}</p>
          </div>

          <div className="pb-1 sm:ml-auto">
            <button
              type="button"
              onClick={() => navigate("/mentor")}
              className="rounded-xl bg-primary px-4 py-2 text-sm font-bold text-white shadow-lg shadow-primary/20 transition-transform hover:-translate-y-0.5"
            >
              Ask AI Mentor
            </button>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="flex items-center gap-2 text-lg font-bold text-slate-800 dark:text-white">
              <Star size={18} className="text-secondary" /> Exam Strengths
            </h3>
          </div>
          <div className="space-y-4">
            {[
              { sub: "Mathematics", score: "82%" },
              { sub: "Physics", score: "74%" },
              { sub: "English Language", score: "68%" }
            ].map((item) => (
              <div key={item.sub} className="flex items-center justify-between">
                <span className="font-medium text-slate-700 dark:text-slate-300">{item.sub}</span>
                <span className="rounded bg-primary/10 px-2 py-0.5 text-sm font-bold text-primary">
                  {item.score}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="flex items-center gap-2 text-lg font-bold text-slate-800 dark:text-white">
              <Target size={18} className="text-primary" /> Saved Courses
            </h3>
            <span className="text-xs font-bold text-slate-400">{savedCourses.length} saved</span>
          </div>

          {courseError && (
            <div className="mb-4 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-600 dark:border-red-900/40 dark:bg-red-900/10 dark:text-red-300">
              {courseError}
            </div>
          )}

          <div className="space-y-3">
            {loadingCourses ? (
              <div className="rounded-2xl border border-dashed border-slate-200 p-5 text-center dark:border-slate-700">
                <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">Loading saved courses...</p>
              </div>
            ) : savedCourses.length > 0 ? (
              savedCourses.map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl border border-slate-100 bg-slate-50 p-4 transition-colors hover:border-primary/30 dark:border-slate-800 dark:bg-slate-950"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                        {item.course?.title || item.courseTitle}
                      </h4>
                      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                        {item.course?.category || "Recommended course"}
                      </p>
                      <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                        Match {item.matchPercentage || 0}% • {item.course?.institutionType || "Course"} • Cut-off {item.course?.cutoffMark || "N/A"}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeSavedCourse(item.id)}
                      className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-500/10"
                      aria-label={`Remove ${item.course?.title || item.courseTitle} from saved courses`}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-200 p-5 text-center dark:border-slate-700">
                <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">No saved courses yet.</p>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Use the Save Course button on the quiz results screen and your recommendations will appear here.
                </p>
              </div>
            )}

            <button
              type="button"
              onClick={() => navigate("/quiz")}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-200 py-3 text-xs font-bold text-slate-400 transition-colors hover:border-primary hover:text-primary dark:border-slate-700"
            >
              Take Quiz Again
            </button>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="flex items-center gap-2 text-lg font-bold text-slate-800 dark:text-white">
            <Heart size={18} className="text-red-500" /> Bookmarked Career Paths
          </h3>
          <span className="text-xs font-bold text-slate-400">{savedCareers.length} saved</span>
        </div>

        <div className="space-y-3">
          {savedCareers.length > 0 ? (
            savedCareers.map((career) => (
              <div
                key={career.id}
                className="group rounded-2xl border border-slate-100 bg-slate-50 p-4 transition-colors hover:border-primary/30 dark:border-slate-800 dark:bg-slate-950"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h4 className="mb-1 text-sm font-bold text-slate-800 dark:text-slate-200">{career.title}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{career.field}</p>
                    <p className="mt-2 flex items-center gap-1 text-xs text-slate-500">
                      <Target size={12} /> {(career.universities || []).join(", ") || "Universities coming soon"}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeSavedCareer(career.id)}
                    className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-500/10"
                    aria-label={`Remove ${career.title} from saved careers`}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-200 p-5 text-center dark:border-slate-700">
              <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">No careers saved yet.</p>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Use the Save to Profile button on the careers page and your picks will appear here.
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="mt-8 flex justify-center">
        <button
          type="button"
          onClick={handleSignOut}
          className="flex items-center gap-2 text-sm font-bold text-red-500 transition-colors hover:text-red-600 hover:underline"
        >
          <LogOut size={16} /> Sign out of account
        </button>
      </div>
    </div>
  )
}
