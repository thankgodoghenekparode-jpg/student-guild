import { Calendar, CheckCircle, Clock, Plus, X } from "lucide-react"
import { useMemo, useState } from "react"
import useLocalStorage from "../hooks/useLocalStorage"

const STUDY_SESSIONS_KEY = "scg-study-planner-sessions"

const defaultStudySessions = [
  { id: "organic-chemistry", title: "Organic Chemistry", time: "2 Hours", day: "Today", completed: false },
  { id: "english-lexis", title: "English Lexis & Structure", time: "1 Hour", day: "Tomorrow", completed: false },
  { id: "physics-motion", title: "Physics: Motion", time: "3 Hours", day: "Wednesday", completed: false }
]

export default function Planner() {
  const milestones = [
    { title: "NIN Registration", date: "Jan 15, 2026", status: "completed", type: "Prerequisite" },
    { title: "JAMB Form Purchase", date: "Feb 10, 2026", status: "pending", type: "Important" },
    { title: "JAMB Mock Exam", date: "Mar 12, 2026", status: "upcoming", type: "Exam" },
    { title: "Main UTME Examination", date: "Apr 20, 2026", status: "upcoming", type: "Exam" }
  ]
  const [studySessions, setStudySessions] = useLocalStorage(STUDY_SESSIONS_KEY, defaultStudySessions)
  const [showComposer, setShowComposer] = useState(false)
  const [plannerMessage, setPlannerMessage] = useState("")
  const [draftSession, setDraftSession] = useState({
    title: "",
    time: "",
    day: ""
  })

  const completedCount = useMemo(
    () => studySessions.filter((session) => session.completed).length,
    [studySessions]
  )

  function handleToggleSession(sessionId) {
    let nextCompleted = false
    let nextTitle = ""

    setStudySessions((current) =>
      current.map((session) => {
        if (session.id !== sessionId) {
          return session
        }

        nextCompleted = !session.completed
        nextTitle = session.title

        return {
          ...session,
          completed: nextCompleted
        }
      })
    )

    setPlannerMessage(
      nextCompleted
        ? `${nextTitle} marked as completed.`
        : `${nextTitle} moved back into your active study list.`
    )
  }

  function handleDraftChange(field, value) {
    setDraftSession((current) => ({
      ...current,
      [field]: value
    }))
  }

  function resetComposer() {
    setDraftSession({
      title: "",
      time: "",
      day: ""
    })
  }

  function handleAddTopic(event) {
    event.preventDefault()

    const title = draftSession.title.trim()
    const time = draftSession.time.trim()
    const day = draftSession.day.trim()

    if (!title || !time || !day) {
      setPlannerMessage("Fill in the topic, study time, and study day before saving.")
      return
    }

    const nextSession = {
      id: `session-${Date.now()}`,
      title,
      time,
      day,
      completed: false
    }

    setStudySessions((current) => [nextSession, ...current])
    setPlannerMessage(`${title} added to your study plan.`)
    setShowComposer(false)
    resetComposer()
  }

  function handleToggleComposer() {
    setShowComposer((current) => !current)
    setPlannerMessage("")

    if (showComposer) {
      resetComposer()
    }
  }

  return (
    <div className="space-y-8 animate-rise">
      <div>
        <h1 className="font-display text-4xl font-bold text-slate-900 dark:text-white">Study Planner</h1>
        <p className="mt-1 font-medium text-slate-500">Keep track of your study goals and admission deadlines</p>
      </div>

      <div className="grid gap-6 md:grid-cols-[1fr_1.5fr]">
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className="flex items-center gap-2 text-lg font-bold text-slate-800 dark:text-white">
              <Clock className="text-primary" size={20} /> Upcoming Study Sessions
            </h3>
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
              {completedCount} of {studySessions.length} completed
            </span>
          </div>

          {plannerMessage ? (
            <div className="rounded-2xl border border-primary/10 bg-primary/5 px-4 py-3 text-sm font-semibold text-primary dark:border-primary/20 dark:bg-primary/10">
              {plannerMessage}
            </div>
          ) : null}

          <div className="space-y-3">
            {studySessions.map((session) => (
              <div
                key={session.id}
                className={`flex items-center justify-between rounded-2xl border bg-white p-4 shadow-sm transition-colors dark:bg-slate-900 ${
                  session.completed
                    ? "border-emerald-200/80 bg-emerald-50/70 dark:border-emerald-500/20 dark:bg-emerald-500/10"
                    : "border-slate-100 hover:border-primary/30 dark:border-slate-800"
                }`}
              >
                <div>
                  <p
                    className={`text-sm font-bold ${
                      session.completed
                        ? "text-emerald-700 line-through dark:text-emerald-300"
                        : "text-slate-800 dark:text-slate-200"
                    }`}
                  >
                    {session.title}
                  </p>
                  <p className="mt-0.5 text-xs font-medium text-slate-500">
                    {session.day} | {session.time}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => handleToggleSession(session.id)}
                  aria-pressed={session.completed}
                  className={`inline-flex h-10 min-w-[118px] items-center justify-center gap-2 rounded-full border px-4 text-xs font-bold transition-all ${
                    session.completed
                      ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-300"
                      : "border-slate-200 text-slate-500 hover:border-primary hover:bg-primary/10 hover:text-primary dark:border-slate-700 dark:text-slate-300"
                  }`}
                >
                  <CheckCircle size={16} />
                  {session.completed ? "Completed" : "Mark done"}
                </button>
              </div>
            ))}
          </div>

          {showComposer ? (
            <form
              onSubmit={handleAddTopic}
              className="space-y-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-bold text-slate-800 dark:text-slate-100">Add a study topic</p>
                <button
                  type="button"
                  onClick={handleToggleComposer}
                  className="rounded-full border border-slate-200 p-2 text-slate-400 transition-colors hover:border-primary/30 hover:text-primary dark:border-slate-700"
                  aria-label="Close study topic form"
                >
                  <X size={14} />
                </button>
              </div>

              <div className="grid gap-3">
                <input
                  value={draftSession.title}
                  onChange={(event) => handleDraftChange("title", event.target.value)}
                  placeholder="Topic title"
                  className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-primary/40 focus:bg-white focus:ring-4 focus:ring-primary/10 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                />
                <div className="grid gap-3 sm:grid-cols-2">
                  <input
                    value={draftSession.day}
                    onChange={(event) => handleDraftChange("day", event.target.value)}
                    placeholder="Day"
                    className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-primary/40 focus:bg-white focus:ring-4 focus:ring-primary/10 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                  />
                  <input
                    value={draftSession.time}
                    onChange={(event) => handleDraftChange("time", event.target.value)}
                    placeholder="Time"
                    className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-primary/40 focus:bg-white focus:ring-4 focus:ring-primary/10 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-bold text-white shadow-lg shadow-primary/20 transition-transform hover:-translate-y-0.5"
                >
                  <Plus size={16} />
                  Save Topic
                </button>
                <button
                  type="button"
                  onClick={handleToggleComposer}
                  className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold text-slate-600 transition-colors hover:border-primary/30 hover:text-primary dark:border-slate-700 dark:text-slate-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : null}

          <button
            type="button"
            onClick={handleToggleComposer}
            className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-300 py-3 text-sm font-bold text-slate-500 transition-colors hover:border-primary hover:text-primary dark:border-slate-700"
          >
            <Plus size={16} />
            {showComposer ? "Close Study Topic Form" : "Add Study Topic"}
          </button>
        </div>

        <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-6 flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
            <h3 className="flex items-center gap-2 text-lg font-bold text-slate-800 dark:text-white">
              <Calendar className="text-secondary" size={20} /> Admission Milestones
            </h3>
          </div>

          <div className="relative space-y-0 before:absolute before:inset-0 before:ml-5 before:h-full before:w-0.5 before:-translate-x-px before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent dark:before:via-slate-700 md:before:mx-auto md:before:translate-x-0">
            {milestones.map((milestone) => (
              <div key={milestone.title} className="group relative flex items-center justify-between py-4 md:justify-normal md:odd:flex-row-reverse">
                <div
                  className={`z-10 flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full border border-white shadow transition-colors dark:border-slate-900 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 ${
                    milestone.status === "completed"
                      ? "bg-primary text-white"
                      : "bg-slate-100 text-slate-500 dark:bg-slate-800"
                  }`}
                >
                  {milestone.status === "completed" ? (
                    <CheckCircle size={18} className="text-emerald-500" />
                  ) : (
                    <div className="h-3 w-3 rounded-full bg-secondary" />
                  )}
                </div>
                <div className="w-[calc(100%-4rem)] rounded-2xl border border-slate-100 bg-slate-50 p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950 md:w-[calc(50%-2.5rem)]">
                  <span className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-primary">
                    {milestone.type}
                  </span>
                  <h4 className="mb-1 text-sm font-bold text-slate-800 dark:text-slate-100">{milestone.title}</h4>
                  <span className="inline-block rounded bg-white px-2 py-1 text-xs font-bold text-slate-500 shadow-sm dark:bg-slate-900">
                    {milestone.date}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
