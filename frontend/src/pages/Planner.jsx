import {
  Briefcase,
  CalendarClock,
  CheckCircle2,
  Flag,
  Flame,
  Gauge,
  GraduationCap,
  Plus,
  Target,
  Trash2,
  X
} from "lucide-react"
import { useMemo, useState } from "react"
import { useAuth } from "../context/AuthContext"
import useLocalStorage from "../hooks/useLocalStorage"

const TRACKER_ITEMS_KEY = "scg-smart-tracker-items"

const goalAreas = [
  "Academics",
  "JAMB / CBT",
  "Course Admission",
  "Career Prep",
  "Scholarships",
  "Personal Growth"
]

const priorities = {
  high: "High",
  medium: "Medium",
  low: "Low"
}

const categories = {
  goal: {
    label: "Semester goal",
    shortLabel: "Goals",
    icon: Target,
    color: "text-primary",
    bg: "bg-primary/10",
    border: "border-primary/20"
  },
  assignment: {
    label: "Assignment",
    shortLabel: "Assignments",
    icon: GraduationCap,
    color: "text-secondary",
    bg: "bg-secondary/10",
    border: "border-secondary/20"
  },
  internship: {
    label: "Internship application",
    shortLabel: "Internships",
    icon: Briefcase,
    color: "text-emerald-600 dark:text-emerald-300",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20"
  }
}

const defaultTrackerItems = [
  {
    id: "goal-gpa",
    type: "goal",
    title: "Reach a 4.2 semester GPA",
    detail: "Review weak topics every weekend and meet lecturers before tests.",
    deadline: "2026-07-30",
    progress: 45,
    goalArea: "Academics",
    targetMetric: "Semester GPA",
    targetValue: "4.2",
    currentValue: "3.6",
    priority: "high",
    completed: false,
    completedAt: ""
  },
  {
    id: "assignment-economics",
    type: "assignment",
    title: "Submit Economics term paper",
    detail: "Finish references, proofread, and upload before class.",
    deadline: "2026-05-22",
    progress: 70,
    completed: false,
    completedAt: ""
  },
  {
    id: "internship-bank",
    type: "internship",
    title: "Apply for summer internship",
    detail: "Update CV, write cover letter, and submit application.",
    deadline: "2026-06-05",
    progress: 30,
    completed: false,
    completedAt: ""
  }
]

const initialDraft = {
  type: "goal",
  title: "",
  detail: "",
  deadline: "",
  progress: 0,
  goalArea: "Academics",
  targetMetric: "",
  targetValue: "",
  currentValue: "",
  priority: "medium"
}

function getTodayKey() {
  return new Date().toISOString().slice(0, 10)
}

function getDateKey(value) {
  if (!value) {
    return ""
  }

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return ""
  }

  return date.toISOString().slice(0, 10)
}

function getDaysUntil(deadline) {
  if (!deadline) {
    return null
  }

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const dueDate = new Date(`${deadline}T00:00:00`)
  if (Number.isNaN(dueDate.getTime())) {
    return null
  }

  return Math.ceil((dueDate.getTime() - today.getTime()) / 86400000)
}

function getDeadlineLabel(item) {
  if (item.completed) {
    return "Completed"
  }

  const daysUntil = getDaysUntil(item.deadline)

  if (daysUntil === null) {
    return "No deadline"
  }

  if (daysUntil < 0) {
    return `${Math.abs(daysUntil)} day${Math.abs(daysUntil) === 1 ? "" : "s"} overdue`
  }

  if (daysUntil === 0) {
    return "Due today"
  }

  if (daysUntil === 1) {
    return "Due tomorrow"
  }

  return `Due in ${daysUntil} days`
}

function getDeadlineTone(item) {
  if (item.completed) {
    return "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300"
  }

  const daysUntil = getDaysUntil(item.deadline)

  if (daysUntil === null) {
    return "border-slate-200 bg-slate-50 text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
  }

  if (daysUntil < 0) {
    return "border-red-200 bg-red-50 text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300"
  }

  if (daysUntil <= 3) {
    return "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300"
  }

  return "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-500/30 dark:bg-blue-500/10 dark:text-blue-300"
}

function calculateStreak(items) {
  const completedDays = new Set(
    items
      .map((item) => getDateKey(item.completedAt))
      .filter(Boolean)
  )

  let streak = 0
  const cursor = new Date()
  cursor.setHours(0, 0, 0, 0)

  while (completedDays.has(cursor.toISOString().slice(0, 10))) {
    streak += 1
    cursor.setDate(cursor.getDate() - 1)
  }

  return streak
}

function clampProgress(value) {
  const numberValue = Number(value)
  if (!Number.isFinite(numberValue)) {
    return 0
  }

  return Math.max(0, Math.min(100, Math.round(numberValue)))
}

export default function Planner() {
  const { user } = useAuth()
  const trackerStorageKey = `${TRACKER_ITEMS_KEY}-${user?.id || user?.email || "guest"}`
  const [items, setItems] = useLocalStorage(trackerStorageKey, defaultTrackerItems)
  const [draft, setDraft] = useState(initialDraft)
  const [showComposer, setShowComposer] = useState(false)
  const [filter, setFilter] = useState("all")
  const [message, setMessage] = useState("")

  const stats = useMemo(() => {
    const completedItems = items.filter((item) => item.completed)
    const activeItems = items.filter((item) => !item.completed)
    const dueSoonItems = activeItems.filter((item) => {
      const daysUntil = getDaysUntil(item.deadline)
      return daysUntil !== null && daysUntil >= 0 && daysUntil <= 3
    })
    const overdueItems = activeItems.filter((item) => {
      const daysUntil = getDaysUntil(item.deadline)
      return daysUntil !== null && daysUntil < 0
    })
    const averageProgress = items.length
      ? Math.round(items.reduce((total, item) => total + Number(item.progress || 0), 0) / items.length)
      : 0
    const goalItems = items.filter((item) => item.type === "goal")
    const activeGoals = goalItems.filter((item) => !item.completed)

    return {
      completedCount: completedItems.length,
      activeCount: activeItems.length,
      activeGoalCount: activeGoals.length,
      dueSoonCount: dueSoonItems.length,
      overdueCount: overdueItems.length,
      averageProgress,
      streak: calculateStreak(items)
    }
  }, [items])

  const categoryStats = useMemo(
    () =>
      Object.entries(categories).map(([type, category]) => {
        const categoryItems = items.filter((item) => item.type === type)
        const completedCount = categoryItems.filter((item) => item.completed).length
        const progress = categoryItems.length ? Math.round((completedCount / categoryItems.length) * 100) : 0

        return {
          type,
          ...category,
          total: categoryItems.length,
          completedCount,
          progress
        }
      }),
    [items]
  )

  const filteredItems = useMemo(() => {
    const nextItems = filter === "all" ? items : items.filter((item) => item.type === filter)

    return [...nextItems].sort((a, b) => {
      if (a.completed !== b.completed) {
        return a.completed ? 1 : -1
      }

      if (!a.deadline) {
        return 1
      }

      if (!b.deadline) {
        return -1
      }

      return a.deadline.localeCompare(b.deadline)
    })
  }, [filter, items])

  const deadlineReminders = useMemo(
    () =>
      items
        .filter((item) => !item.completed)
        .filter((item) => {
          const daysUntil = getDaysUntil(item.deadline)
          return daysUntil !== null && daysUntil <= 3
        })
        .sort((a, b) => a.deadline.localeCompare(b.deadline))
        .slice(0, 5),
    [items]
  )

  const featuredGoal = useMemo(
    () =>
      items
        .filter((item) => item.type === "goal" && !item.completed)
        .sort((a, b) => {
          const priorityOrder = { high: 0, medium: 1, low: 2 }
          const priorityDiff = (priorityOrder[a.priority] ?? 1) - (priorityOrder[b.priority] ?? 1)

          if (priorityDiff !== 0) {
            return priorityDiff
          }

          return String(a.deadline || "9999-12-31").localeCompare(String(b.deadline || "9999-12-31"))
        })[0],
    [items]
  )

  function updateDraft(field, value) {
    setDraft((current) => ({
      ...current,
      [field]: field === "progress" ? clampProgress(value) : value
    }))
  }

  function resetDraft() {
    setDraft(initialDraft)
  }

  function handleAddItem(event) {
    event.preventDefault()

    const title = draft.title.trim()
    const detail = draft.detail.trim()

    if (!title || !draft.deadline) {
      setMessage("Add a title and deadline before saving your tracker item.")
      return
    }

    const nextItem = {
      id: `tracker-${Date.now()}`,
      type: draft.type,
      title,
      detail,
      deadline: draft.deadline,
      progress: clampProgress(draft.progress),
      goalArea: draft.type === "goal" ? draft.goalArea : "",
      targetMetric: draft.type === "goal" ? draft.targetMetric.trim() : "",
      targetValue: draft.type === "goal" ? draft.targetValue.trim() : "",
      currentValue: draft.type === "goal" ? draft.currentValue.trim() : "",
      priority: draft.type === "goal" ? draft.priority : "medium",
      completed: false,
      completedAt: ""
    }

    setItems((current) => [nextItem, ...current])
    setMessage(`${title} added to your tracker.`)
    setShowComposer(false)
    resetDraft()
  }

  function handleToggleComplete(itemId) {
    let title = ""
    let completed = false

    setItems((current) =>
      current.map((item) => {
        if (item.id !== itemId) {
          return item
        }

        title = item.title
        completed = !item.completed

        return {
          ...item,
          completed,
          completedAt: completed ? new Date().toISOString() : "",
          progress: completed ? 100 : Math.min(item.progress || 0, 90)
        }
      })
    )

    setMessage(completed ? `${title} completed. Streak updated.` : `${title} moved back to active work.`)
  }

  function handleProgressChange(itemId, value) {
    setItems((current) =>
      current.map((item) => {
        if (item.id !== itemId) {
          return item
        }

        const progress = clampProgress(value)

        return {
          ...item,
          progress,
          completed: progress === 100,
          completedAt: progress === 100 ? item.completedAt || new Date().toISOString() : ""
        }
      })
    )
  }

  function handleRemoveItem(itemId) {
    setItems((current) => current.filter((item) => item.id !== itemId))
    setMessage("Tracker item removed.")
  }

  function handleToggleComposer() {
    setShowComposer((current) => !current)
    setMessage("")

    if (showComposer) {
      resetDraft()
    }
  }

  return (
    <div className="space-y-8 animate-rise">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-primary">Smart Tracker</p>
          <h1 className="mt-2 font-display text-4xl font-bold text-slate-900 dark:text-white">
            Goal Setting & Smart Tracker
          </h1>
          <p className="mt-2 max-w-2xl font-medium text-slate-500 dark:text-slate-400">
            Set measurable student goals, track assignments, manage internship applications, and keep your daily momentum visible.
          </p>
        </div>

        <button
          type="button"
          onClick={handleToggleComposer}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-white shadow-lg shadow-primary/20 transition-transform hover:-translate-y-0.5"
        >
          {showComposer ? <X size={16} /> : <Plus size={16} />}
          {showComposer ? "Close Form" : "Set New Goal"}
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Overall progress</p>
          <p className="mt-3 text-3xl font-bold text-slate-900 dark:text-white">{stats.averageProgress}%</p>
          <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
            <div className="h-full rounded-full bg-gradient-to-r from-primary to-secondary" style={{ width: `${stats.averageProgress}%` }} />
          </div>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Active goals</p>
          <p className="mt-3 text-3xl font-bold text-slate-900 dark:text-white">{stats.activeGoalCount}</p>
          <p className="mt-2 text-sm font-semibold text-emerald-600 dark:text-emerald-300">
            {stats.activeCount} active items
          </p>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Deadline reminders</p>
          <p className="mt-3 text-3xl font-bold text-slate-900 dark:text-white">{stats.dueSoonCount}</p>
          <p className={`mt-2 text-sm font-semibold ${stats.overdueCount ? "text-red-600 dark:text-red-300" : "text-slate-500"}`}>
            {stats.overdueCount} overdue
          </p>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Daily streak</p>
          <div className="mt-3 flex items-center gap-2">
            <Flame className="text-amber-500" size={28} />
            <p className="text-3xl font-bold text-slate-900 dark:text-white">{stats.streak}</p>
          </div>
          <p className="mt-2 text-sm font-semibold text-slate-500">
            {stats.streak === 1 ? "day in a row" : "days in a row"}
          </p>
        </div>
      </div>

      {showComposer ? (
        <form
          onSubmit={handleAddItem}
          className="space-y-5 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
        >
          <div className="grid gap-4 lg:grid-cols-[0.85fr_1.15fr_0.7fr_0.55fr]">
            <label className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Type</span>
              <select
                value={draft.type}
                onChange={(event) => updateDraft("type", event.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 outline-none transition focus:border-primary/40 focus:bg-white focus:ring-4 focus:ring-primary/10 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
              >
                {Object.entries(categories).map(([type, category]) => (
                  <option key={type} value={type}>
                    {category.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Title</span>
              <input
                value={draft.title}
                onChange={(event) => updateDraft("title", event.target.value)}
                placeholder="e.g. Complete GST assignment"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 outline-none transition focus:border-primary/40 focus:bg-white focus:ring-4 focus:ring-primary/10 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
              />
            </label>

            <label className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Deadline</span>
              <input
                type="date"
                value={draft.deadline}
                onChange={(event) => updateDraft("deadline", event.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 outline-none transition focus:border-primary/40 focus:bg-white focus:ring-4 focus:ring-primary/10 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
              />
            </label>

            <label className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Progress</span>
              <input
                type="number"
                min="0"
                max="100"
                value={draft.progress}
                onChange={(event) => updateDraft("progress", event.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 outline-none transition focus:border-primary/40 focus:bg-white focus:ring-4 focus:ring-primary/10 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
              />
            </label>
          </div>

          {draft.type === "goal" ? (
            <div className="grid gap-4 lg:grid-cols-[0.9fr_1fr_0.7fr_0.7fr_0.65fr]">
              <label className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Goal area</span>
                <select
                  value={draft.goalArea}
                  onChange={(event) => updateDraft("goalArea", event.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 outline-none transition focus:border-primary/40 focus:bg-white focus:ring-4 focus:ring-primary/10 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                >
                  {goalAreas.map((area) => (
                    <option key={area} value={area}>
                      {area}
                    </option>
                  ))}
                </select>
              </label>

              <label className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Measure</span>
                <input
                  value={draft.targetMetric}
                  onChange={(event) => updateDraft("targetMetric", event.target.value)}
                  placeholder="e.g. JAMB score"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 outline-none transition focus:border-primary/40 focus:bg-white focus:ring-4 focus:ring-primary/10 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                />
              </label>

              <label className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Current</span>
                <input
                  value={draft.currentValue}
                  onChange={(event) => updateDraft("currentValue", event.target.value)}
                  placeholder="e.g. 240"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 outline-none transition focus:border-primary/40 focus:bg-white focus:ring-4 focus:ring-primary/10 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                />
              </label>

              <label className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Target</span>
                <input
                  value={draft.targetValue}
                  onChange={(event) => updateDraft("targetValue", event.target.value)}
                  placeholder="e.g. 300"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 outline-none transition focus:border-primary/40 focus:bg-white focus:ring-4 focus:ring-primary/10 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                />
              </label>

              <label className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Priority</span>
                <select
                  value={draft.priority}
                  onChange={(event) => updateDraft("priority", event.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 outline-none transition focus:border-primary/40 focus:bg-white focus:ring-4 focus:ring-primary/10 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                >
                  {Object.entries(priorities).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          ) : null}

          <label className="block space-y-2">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Notes</span>
            <textarea
              value={draft.detail}
              onChange={(event) => updateDraft("detail", event.target.value)}
              rows={3}
              placeholder="Add the next step, requirement, or reminder."
              className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 outline-none transition focus:border-primary/40 focus:bg-white focus:ring-4 focus:ring-primary/10 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
            />
          </label>

          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-white shadow-lg shadow-primary/20 transition-transform hover:-translate-y-0.5"
            >
              <Plus size={16} />
              Save Goal
            </button>
            <button
              type="button"
              onClick={handleToggleComposer}
              className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-600 transition-colors hover:border-primary/30 hover:text-primary dark:border-slate-700 dark:text-slate-300"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : null}

      {message ? (
        <div className="rounded-2xl border border-primary/10 bg-primary/5 px-4 py-3 text-sm font-semibold text-primary dark:border-primary/20 dark:bg-primary/10">
          {message}
        </div>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-[1fr_0.75fr]">
        <div className="space-y-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Tracker Board</h2>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {[
                ["all", "All"],
                ...Object.entries(categories).map(([type, category]) => [type, category.shortLabel])
              ].map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setFilter(value)}
                  className={`shrink-0 rounded-full px-4 py-2 text-xs font-bold transition-colors ${
                    filter === value
                      ? "bg-primary text-white"
                      : "border border-slate-200 bg-white text-slate-500 hover:border-primary/30 hover:text-primary dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {filteredItems.length ? (
              filteredItems.map((item) => {
                const category = categories[item.type] || categories.goal
                const Icon = category.icon

                return (
                  <article
                    key={item.id}
                    className={`rounded-2xl border bg-white p-5 shadow-sm transition-colors dark:bg-slate-900 ${
                      item.completed
                        ? "border-emerald-200/80 dark:border-emerald-500/20"
                        : "border-slate-100 hover:border-primary/30 dark:border-slate-800"
                    }`}
                  >
                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] ${category.bg} ${category.color}`}>
                            <Icon size={13} />
                            {category.label}
                          </span>
                          {item.type === "goal" && item.priority ? (
                            <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300">
                              <Flag size={12} />
                              {priorities[item.priority] || "Medium"}
                            </span>
                          ) : null}
                          <span className={`rounded-full border px-3 py-1 text-[11px] font-bold ${getDeadlineTone(item)}`}>
                            {getDeadlineLabel(item)}
                          </span>
                        </div>

                        <h3 className="mt-3 text-lg font-bold text-slate-900 dark:text-white">{item.title}</h3>
                        {item.detail ? (
                          <p className="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">{item.detail}</p>
                        ) : null}
                        {item.type === "goal" && (item.goalArea || item.targetMetric || item.targetValue || item.currentValue) ? (
                          <div className="mt-4 grid gap-3 sm:grid-cols-3">
                            <div className="rounded-xl bg-slate-50 px-4 py-3 dark:bg-slate-950">
                              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">Area</p>
                              <p className="mt-1 text-sm font-bold text-slate-700 dark:text-slate-200">{item.goalArea || "General"}</p>
                            </div>
                            <div className="rounded-xl bg-slate-50 px-4 py-3 dark:bg-slate-950">
                              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">Current</p>
                              <p className="mt-1 text-sm font-bold text-slate-700 dark:text-slate-200">
                                {item.currentValue || "Not set"} {item.targetMetric ? ` ${item.targetMetric}` : ""}
                              </p>
                            </div>
                            <div className="rounded-xl bg-slate-50 px-4 py-3 dark:bg-slate-950">
                              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">Target</p>
                              <p className="mt-1 text-sm font-bold text-slate-700 dark:text-slate-200">
                                {item.targetValue || "Not set"} {item.targetMetric ? ` ${item.targetMetric}` : ""}
                              </p>
                            </div>
                          </div>
                        ) : null}
                      </div>

                      <div className="flex shrink-0 gap-2">
                        <button
                          type="button"
                          onClick={() => handleToggleComplete(item.id)}
                          className={`inline-flex h-10 items-center gap-2 rounded-xl px-4 text-xs font-bold transition-colors ${
                            item.completed
                              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-300"
                              : "bg-primary text-white"
                          }`}
                        >
                          <CheckCircle2 size={16} />
                          {item.completed ? "Done" : "Complete"}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(item.id)}
                          className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-400 transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-500 dark:border-slate-700 dark:hover:border-red-500/30 dark:hover:bg-red-500/10"
                          aria-label={`Remove ${item.title}`}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>

                    <div className="mt-5">
                      <div className="mb-2 flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400">
                        <span>Progress</span>
                        <span>{item.progress || 0}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={item.progress || 0}
                        onChange={(event) => handleProgressChange(item.id, event.target.value)}
                        className="w-full accent-primary"
                      />
                      <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-primary to-secondary transition-all"
                          style={{ width: `${item.progress || 0}%` }}
                        />
                      </div>
                    </div>
                  </article>
                )
              })
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-8 text-center dark:border-slate-700 dark:bg-slate-900">
                <p className="text-sm font-bold text-slate-700 dark:text-slate-200">No tracker items yet.</p>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Add a goal, assignment, or internship application to begin.</p>
              </div>
            )}
          </div>
        </div>

        <aside className="space-y-5">
          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-white">
              <Gauge className="text-primary" size={20} />
              Focus Goal
            </h2>
            {featuredGoal ? (
              <div className="mt-4 rounded-2xl border border-primary/10 bg-primary/5 p-4 dark:border-primary/20 dark:bg-primary/10">
                <div className="flex items-center justify-between gap-3">
                  <span className="rounded-full bg-white px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-primary dark:bg-slate-950">
                    {featuredGoal.goalArea || "Goal"}
                  </span>
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-300">
                    {featuredGoal.progress || 0}%
                  </span>
                </div>
                <p className="mt-3 text-base font-bold text-slate-900 dark:text-white">{featuredGoal.title}</p>
                <p className="mt-1 text-sm font-semibold text-slate-500 dark:text-slate-400">
                  {featuredGoal.targetMetric && featuredGoal.targetValue
                    ? `Target: ${featuredGoal.targetValue} ${featuredGoal.targetMetric}`
                    : getDeadlineLabel(featuredGoal)}
                </p>
                <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-white dark:bg-slate-950">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-primary to-secondary"
                    style={{ width: `${featuredGoal.progress || 0}%` }}
                  />
                </div>
              </div>
            ) : (
              <p className="mt-4 rounded-xl bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-500 dark:bg-slate-950 dark:text-slate-400">
                Set a goal and it will appear here as your main focus.
              </p>
            )}
          </div>

          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-white">
              <CalendarClock className="text-secondary" size={20} />
              Deadline Reminders
            </h2>
            <div className="mt-4 space-y-3">
              {deadlineReminders.length ? (
                deadlineReminders.map((item) => (
                  <div key={item.id} className={`rounded-xl border px-4 py-3 ${getDeadlineTone(item)}`}>
                    <p className="text-sm font-bold">{item.title}</p>
                    <p className="mt-1 text-xs font-semibold">{getDeadlineLabel(item)}</p>
                  </div>
                ))
              ) : (
                <p className="rounded-xl bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-500 dark:bg-slate-950 dark:text-slate-400">
                  No urgent deadlines in the next 3 days.
                </p>
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Category Progress</h2>
            <div className="mt-4 space-y-4">
              {categoryStats.map((category) => (
                <div key={category.type}>
                  <div className="mb-2 flex items-center justify-between text-sm font-bold">
                    <span className="text-slate-700 dark:text-slate-200">{category.shortLabel}</span>
                    <span className={category.color}>
                      {category.completedCount}/{category.total}
                    </span>
                  </div>
                  <div className="h-2.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                    <div
                      className={`h-full rounded-full ${category.bg.replace("/10", "")}`}
                      style={{ width: `${category.progress}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
