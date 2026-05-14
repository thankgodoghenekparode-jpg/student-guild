import { useEffect, useMemo, useState } from "react"
import {
  BarChart3,
  BookMarked,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  LoaderCircle,
  MonitorPlay,
  RefreshCcw,
  Sparkles,
  Target,
  Trophy
} from "lucide-react"
import Card from "../components/Card"
import SectionHeader from "../components/SectionHeader"
import { useAuth } from "../context/AuthContext"
import { apiRequest } from "../utils/api"
import { isTransientRequestError, requestWithRetry } from "../utils/requestRetry"

const mockQuestionTargets = [40, 50, 60]

const defaultAnalytics = {
  totalAttempts: 0,
  totalDrills: 0,
  totalPastPapers: 0,
  totalMocks: 0,
  averageScore: 0,
  averageMockScore: 0,
  recentScores: [],
  examPerformance: [],
  subjectPerformance: [],
  topicTrend: []
}

const defaultStreak = {
  currentStreak: 0,
  longestStreak: 0,
  activeDays: 0,
  lastPracticeDate: null
}

const defaultLeaderboard = {
  totalParticipants: 0,
  leaders: [],
  currentUser: null
}

const examMeta = {
  JAMB: {
    label: "JAMB CBT Practice",
    subtitle: "Train speed, accuracy, and subject balance for UTME-style objective sessions.",
    accent: "from-rose-500 via-orange-500 to-amber-400"
  },
  WAEC: {
    label: "WAEC Objective Practice",
    subtitle: "Build confidence across yearly objective questions, past papers, and full mock revision drills.",
    accent: "from-emerald-500 via-teal-500 to-cyan-400"
  }
}

function formatSeconds(totalSeconds) {
  const safeSeconds = Math.max(0, Number(totalSeconds) || 0)
  const hours = Math.floor(safeSeconds / 3600)
  const minutes = Math.floor((safeSeconds % 3600) / 60)
  const seconds = safeSeconds % 60

  if (hours > 0) {
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`
  }

  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`
}

function formatDateLabel(value) {
  if (!value) {
    return "Recently"
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return "Recently"
  }

  return new Intl.DateTimeFormat("en-NG", {
    day: "numeric",
    month: "short"
  }).format(date)
}

function getMockQuestionOptions(totalAvailable) {
  return mockQuestionTargets.filter((count) => count <= totalAvailable)
}

function buildDefaultMockSubjects(examType, subjects) {
  const subjectNames = subjects.map((item) => item.subject)

  if (examType === "JAMB") {
    const compulsorySubject = "Use of English"
    const otherSubjects = subjectNames.filter((subject) => subject !== compulsorySubject).slice(0, 3)

    if (subjectNames.includes(compulsorySubject)) {
      return [compulsorySubject, ...otherSubjects]
    }

    return subjectNames.slice(0, 4)
  }

  return subjectNames.slice(0, 4)
}

function normalizeMockSelection(examType, selectedSubjects, subjects) {
  const availableNames = subjects.map((item) => item.subject)
  const nextSubjects = Array.from(
    new Set(selectedSubjects.filter((subject) => availableNames.includes(subject)))
  )

  if (examType === "JAMB") {
    const compulsorySubject = "Use of English"
    const otherSubjects = nextSubjects.filter((subject) => subject !== compulsorySubject)
    const fallbackSubjects = availableNames.filter(
      (subject) => subject !== compulsorySubject && !otherSubjects.includes(subject)
    )

    if (availableNames.includes(compulsorySubject)) {
      return [compulsorySubject, ...[...otherSubjects, ...fallbackSubjects].slice(0, 3)]
    }

    return availableNames.slice(0, 4)
  }

  return nextSubjects.length > 0 ? nextSubjects.slice(0, 6) : availableNames.slice(0, 4)
}

function sumSelectedQuestionCount(subjectEntries, selectedSubjects) {
  return subjectEntries
    .filter((item) => selectedSubjects.includes(item.subject))
    .reduce((total, item) => total + Number(item.count || 0), 0)
}

function sumYearQuestionCount(subjectEntries, selectedSubjects, year) {
  if (!year) {
    return 0
  }

  return subjectEntries
    .filter((item) => selectedSubjects.includes(item.subject))
    .reduce((total, item) => {
      const yearEntry = (item.yearCounts || []).find((entry) => entry.year === year)
      return total + Number(yearEntry?.count || 0)
    }, 0)
}

function getScoreTone(score) {
  if (score >= 80) {
    return "text-emerald-600 dark:text-emerald-300"
  }

  if (score >= 60) {
    return "text-amber-600 dark:text-amber-300"
  }

  return "text-rose-600 dark:text-rose-300"
}

function getSessionTypeLabel(sessionType) {
  if (sessionType === "mock") {
    return "Full mock"
  }

  if (sessionType === "past-paper") {
    return "Past paper"
  }

  return "Subject drill"
}

function getPracticeLoadErrorMessage(error) {
  if (isTransientRequestError(error)) {
    return "Could not reach CBT practice yet. The backend may still be starting. Try again."
  }

  return error?.message || "Unable to load CBT practice right now."
}

export default function Practice() {
  const { token } = useAuth()
  const [catalog, setCatalog] = useState([])
  const [history, setHistory] = useState([])
  const [analytics, setAnalytics] = useState(defaultAnalytics)
  const [streakSummary, setStreakSummary] = useState(defaultStreak)
  const [leaderboard, setLeaderboard] = useState(defaultLeaderboard)
  const [mode, setMode] = useState("drill")
  const [drillConfig, setDrillConfig] = useState({
    examType: "JAMB",
    subject: "",
    year: "all",
    questionLimit: 10,
    timedMode: true,
    secondsPerQuestion: 45
  })
  const [pastPaperConfig, setPastPaperConfig] = useState({
    examType: "JAMB",
    year: "",
    subjects: [],
    timedMode: true,
    secondsPerQuestion: 60
  })
  const [mockConfig, setMockConfig] = useState({
    examType: "JAMB",
    subjects: [],
    totalQuestions: 40,
    timedMode: true,
    secondsPerQuestion: 60
  })
  const [session, setSession] = useState(null)
  const [answers, setAnswers] = useState({})
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [remainingSeconds, setRemainingSeconds] = useState(null)
  const [result, setResult] = useState(null)
  const [catalogLoading, setCatalogLoading] = useState(true)
  const [progressLoading, setProgressLoading] = useState(true)
  const [sessionLoading, setSessionLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [saveMessage, setSaveMessage] = useState("")
  const [error, setError] = useState("")
  const [reloadCount, setReloadCount] = useState(0)

  const drillExam = useMemo(
    () => catalog.find((entry) => entry.examType === drillConfig.examType) || null,
    [catalog, drillConfig.examType]
  )
  const drillSubjects = drillExam?.subjects || []
  const selectedDrillSubject =
    drillSubjects.find((item) => item.subject === drillConfig.subject) || drillSubjects[0] || null
  const drillQuestionOptions = Array.from(
    { length: selectedDrillSubject?.count || 0 },
    (_, index) => index + 1
  )
  const drillYearOptions = selectedDrillSubject?.years || []

  const pastPaperExam = useMemo(
    () => catalog.find((entry) => entry.examType === pastPaperConfig.examType) || null,
    [catalog, pastPaperConfig.examType]
  )
  const pastPaperSubjectEntries = pastPaperExam?.subjects || []
  const pastPaperYearEntries = pastPaperExam?.years || []
  const pastPaperAvailableQuestions = sumYearQuestionCount(
    pastPaperSubjectEntries,
    pastPaperConfig.subjects,
    pastPaperConfig.year
  )

  const mockExam = useMemo(
    () => catalog.find((entry) => entry.examType === mockConfig.examType) || null,
    [catalog, mockConfig.examType]
  )
  const mockSubjectEntries = mockExam?.subjects || []
  const mockAvailableQuestions = sumSelectedQuestionCount(mockSubjectEntries, mockConfig.subjects)
  const mockQuestionOptions = getMockQuestionOptions(mockAvailableQuestions)

  const currentQuestion = session?.questions?.[currentQuestionIndex] || null
  const answeredCount = session ? Object.keys(answers).length : 0
  const totalQuestionBank = catalog.reduce((total, exam) => total + Number(exam.totalQuestions || 0), 0)
  const totalSubjectCount = catalog.reduce((total, exam) => total + exam.subjects.length, 0)
  const savedMockCount = history.filter((attempt) => attempt.sessionType === "mock").length
  const canRetryInitialLoad = !session && catalog.length === 0
  const heroExamType =
    mode === "mock"
      ? mockConfig.examType
      : mode === "past-paper"
        ? pastPaperConfig.examType
        : drillConfig.examType
  const activeExamMeta = examMeta[heroExamType] || examMeta.JAMB

  const isMockConfigValid =
    mockConfig.examType === "JAMB"
      ? mockConfig.subjects.length === 4 &&
        mockConfig.subjects.includes("Use of English") &&
        mockQuestionOptions.includes(mockConfig.totalQuestions)
      : mockConfig.subjects.length >= 4 && mockQuestionOptions.includes(mockConfig.totalQuestions)

  const isPastPaperConfigValid =
    Boolean(pastPaperConfig.examType) &&
    Boolean(pastPaperConfig.year) &&
    pastPaperConfig.subjects.length > 0 &&
    pastPaperAvailableQuestions > 0

  useEffect(() => {
    let isMounted = true

    async function loadPracticeData() {
      setCatalogLoading(true)
      setProgressLoading(true)
      setError("")

      try {
        const [
          catalogResponse,
          historyResponse,
          analyticsResponse,
          streakResponse,
          leaderboardResponse
        ] = await requestWithRetry(() =>
          Promise.all([
            apiRequest("/practice/catalog"),
            token ? apiRequest("/practice/history", { token }).catch(() => ({ items: [] })) : Promise.resolve({ items: [] }),
            token ? apiRequest("/practice/analytics", { token }).catch(() => defaultAnalytics) : Promise.resolve(defaultAnalytics),
            token ? apiRequest("/practice/streak", { token }).catch(() => defaultStreak) : Promise.resolve(defaultStreak),
            token ? apiRequest("/practice/leaderboard", { token }).catch(() => defaultLeaderboard) : Promise.resolve(defaultLeaderboard)
          ])
        )

        if (!isMounted) {
          return
        }

        const catalogItems = catalogResponse?.items || []
        setCatalog(catalogItems)
        setHistory(historyResponse?.items || [])
        setAnalytics(
          analyticsResponse && typeof analyticsResponse.totalAttempts === "number"
            ? analyticsResponse
            : defaultAnalytics
        )
        setStreakSummary(
          streakResponse && typeof streakResponse.currentStreak === "number"
            ? streakResponse
            : defaultStreak
        )
        setLeaderboard(
          leaderboardResponse && Array.isArray(leaderboardResponse.leaders)
            ? leaderboardResponse
            : defaultLeaderboard
        )
        setError("")

        if (catalogItems.length > 0) {
          const defaultExam = catalogItems.find((entry) => entry.examType === "JAMB") || catalogItems[0]
          const defaultDrillSubject =
            defaultExam.subjects.find((item) => item.subject === "Use of English")?.subject ||
            defaultExam.subjects[0]?.subject ||
            ""
          const defaultDrillCount =
            defaultExam.subjects.find((item) => item.subject === defaultDrillSubject)?.count || 10
          const defaultPastPaperYear = defaultExam.years?.[0]?.year || ""
          const defaultPastPaperSubjects = defaultExam.subjects.map((item) => item.subject)
          const defaultMockSubjects = buildDefaultMockSubjects(defaultExam.examType, defaultExam.subjects)
          const defaultMockAvailable = sumSelectedQuestionCount(defaultExam.subjects, defaultMockSubjects)
          const defaultMockQuestionCount = getMockQuestionOptions(defaultMockAvailable).at(-1) || 40

          setDrillConfig((current) => ({
            ...current,
            examType: defaultExam.examType,
            subject: defaultDrillSubject,
            year: "all",
            questionLimit: Math.min(10, defaultDrillCount)
          }))

          setPastPaperConfig((current) => ({
            ...current,
            examType: defaultExam.examType,
            year: defaultPastPaperYear,
            subjects: defaultPastPaperSubjects
          }))

          setMockConfig((current) => ({
            ...current,
            examType: defaultExam.examType,
            subjects: defaultMockSubjects,
            totalQuestions: defaultMockQuestionCount
          }))
        }
      } catch (requestError) {
        if (isMounted) {
          setError(getPracticeLoadErrorMessage(requestError))
        }
      } finally {
        if (isMounted) {
          setCatalogLoading(false)
          setProgressLoading(false)
        }
      }
    }

    loadPracticeData()

    return () => {
      isMounted = false
    }
  }, [reloadCount, token])

  useEffect(() => {
    if (!drillExam || drillSubjects.length === 0) {
      return
    }

    const subjectExists = drillSubjects.some((item) => item.subject === drillConfig.subject)

    if (!subjectExists) {
      const fallbackSubject = drillSubjects[0]

      setDrillConfig((current) => ({
        ...current,
        subject: fallbackSubject.subject,
        year: "all",
        questionLimit: Math.min(current.questionLimit, fallbackSubject.count)
      }))
      return
    }

    if (selectedDrillSubject && drillConfig.questionLimit > selectedDrillSubject.count) {
      setDrillConfig((current) => ({
        ...current,
        questionLimit: selectedDrillSubject.count
      }))
    }

    if (
      selectedDrillSubject &&
      drillConfig.year !== "all" &&
      !selectedDrillSubject.years.includes(drillConfig.year)
    ) {
      setDrillConfig((current) => ({
        ...current,
        year: "all"
      }))
    }
  }, [drillConfig.questionLimit, drillConfig.subject, drillConfig.year, drillExam, drillSubjects, selectedDrillSubject])

  useEffect(() => {
    if (!pastPaperExam || pastPaperSubjectEntries.length === 0) {
      return
    }

    const validSubjects = pastPaperConfig.subjects.filter((subject) =>
      pastPaperSubjectEntries.some((item) => item.subject === subject)
    )
    const validYears = pastPaperYearEntries.map((entry) => entry.year)
    const nextYear = validYears.includes(pastPaperConfig.year) ? pastPaperConfig.year : validYears[0] || ""

    if (
      validSubjects.length !== pastPaperConfig.subjects.length ||
      nextYear !== pastPaperConfig.year
    ) {
      setPastPaperConfig((current) => ({
        ...current,
        year: nextYear,
        subjects: validSubjects.length > 0 ? validSubjects : pastPaperSubjectEntries.map((item) => item.subject)
      }))
    }
  }, [pastPaperConfig.examType, pastPaperConfig.subjects, pastPaperConfig.year, pastPaperExam, pastPaperSubjectEntries, pastPaperYearEntries])

  useEffect(() => {
    if (!mockExam || mockSubjectEntries.length === 0) {
      return
    }

    const normalizedSubjects = normalizeMockSelection(mockConfig.examType, mockConfig.subjects, mockSubjectEntries)
    const sameSubjects =
      normalizedSubjects.length === mockConfig.subjects.length &&
      normalizedSubjects.every((subject, index) => subject === mockConfig.subjects[index])

    if (!sameSubjects) {
      const normalizedAvailable = sumSelectedQuestionCount(mockSubjectEntries, normalizedSubjects)
      const normalizedQuestionCount = getMockQuestionOptions(normalizedAvailable).at(-1) || 40

      setMockConfig((current) => ({
        ...current,
        subjects: normalizedSubjects,
        totalQuestions: normalizedQuestionCount
      }))
    }
  }, [mockConfig.examType, mockExam, mockSubjectEntries])

  useEffect(() => {
    if (mockQuestionOptions.length === 0) {
      return
    }

    if (!mockQuestionOptions.includes(mockConfig.totalQuestions)) {
      setMockConfig((current) => ({
        ...current,
        totalQuestions: mockQuestionOptions.at(-1)
      }))
    }
  }, [mockConfig.totalQuestions, mockQuestionOptions])

  useEffect(() => {
    if (!session || result || !session.timedMode || remainingSeconds === null) {
      return
    }

    if (remainingSeconds <= 0) {
      void handleSubmitPractice(true)
      return
    }

    const timeoutId = window.setTimeout(() => {
      setRemainingSeconds((current) => Math.max(0, (current || 0) - 1))
    }, 1000)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [remainingSeconds, result, session])

  function handleModeChange(nextMode) {
    if (session && !result && nextMode !== mode) {
      setError("Submit or end the current session before switching to another practice view.")
      return
    }

    setError("")
    setMode(nextMode)
  }

  function handleDrillExamSwitch(examType) {
    const nextExam = catalog.find((entry) => entry.examType === examType)
    const defaultSubject = nextExam?.subjects[0]

    setDrillConfig((current) => ({
      ...current,
      examType,
      subject: defaultSubject?.subject || "",
      year: "all",
      questionLimit: Math.min(current.questionLimit, defaultSubject?.count || current.questionLimit)
    }))
  }

  function handlePastPaperExamSwitch(examType) {
    const nextExam = catalog.find((entry) => entry.examType === examType)

    setPastPaperConfig((current) => ({
      ...current,
      examType,
      year: nextExam?.years?.[0]?.year || "",
      subjects: nextExam?.subjects?.map((item) => item.subject) || []
    }))
  }

  function handleMockExamSwitch(examType) {
    const nextExam = catalog.find((entry) => entry.examType === examType)
    const defaultSubjects = buildDefaultMockSubjects(examType, nextExam?.subjects || [])
    const availableCount = sumSelectedQuestionCount(nextExam?.subjects || [], defaultSubjects)
    const defaultQuestionCount = getMockQuestionOptions(availableCount).at(-1) || 40

    setMockConfig((current) => ({
      ...current,
      examType,
      subjects: defaultSubjects,
      totalQuestions: defaultQuestionCount
    }))
  }

  function resetSessionState() {
    setSession(null)
    setResult(null)
    setAnswers({})
    setCurrentQuestionIndex(0)
    setRemainingSeconds(null)
    setError("")
  }

  async function refreshProgressData() {
    if (!token) {
      return
    }

    try {
      const [analyticsResponse, streakResponse, leaderboardResponse] = await Promise.all([
        apiRequest("/practice/analytics", { token }).catch(() => defaultAnalytics),
        apiRequest("/practice/streak", { token }).catch(() => defaultStreak),
        apiRequest("/practice/leaderboard", { token }).catch(() => defaultLeaderboard)
      ])

      setAnalytics(
        analyticsResponse && typeof analyticsResponse.totalAttempts === "number"
          ? analyticsResponse
          : defaultAnalytics
      )
      setStreakSummary(
        streakResponse && typeof streakResponse.currentStreak === "number"
          ? streakResponse
          : defaultStreak
      )
      setLeaderboard(
        leaderboardResponse && Array.isArray(leaderboardResponse.leaders)
          ? leaderboardResponse
          : defaultLeaderboard
      )
    } catch {
      // Ignore transient refresh failures.
    }
  }

  async function saveAttempt(payload) {
    if (!token) {
      return false
    }

    try {
      const response = await apiRequest("/practice/history", {
        method: "POST",
        token,
        body: JSON.stringify(payload)
      })

      if (response?.item) {
        setHistory((current) => [response.item, ...current])
      }

      await refreshProgressData()
      return true
    } catch {
      return false
    }
  }

  async function startDrillSession() {
    if (!drillConfig.examType || !drillConfig.subject) {
      setError("Choose an exam type and subject before starting.")
      return
    }

    setSessionLoading(true)
    setError("")
    setSaveMessage("")

    try {
      const yearQuery = drillConfig.year !== "all" ? `&year=${encodeURIComponent(drillConfig.year)}` : ""
      const response = await apiRequest(
        `/practice/questions?examType=${encodeURIComponent(drillConfig.examType)}&subject=${encodeURIComponent(
          drillConfig.subject
        )}&limit=${encodeURIComponent(drillConfig.questionLimit)}${yearQuery}`
      )

      const questions = response?.items || []

      setSession({
        sessionType: "drill",
        examType: drillConfig.examType,
        title: `${drillConfig.subject} subject drill`,
        subject: drillConfig.subject,
        subjects: [drillConfig.subject],
        questions,
        timedMode: drillConfig.timedMode,
        startedAt: Date.now()
      })
      setAnswers({})
      setCurrentQuestionIndex(0)
      setResult(null)
      setRemainingSeconds(drillConfig.timedMode ? questions.length * Number(drillConfig.secondsPerQuestion) : null)
    } catch (requestError) {
      setError(requestError.message || "Unable to start this subject drill.")
    } finally {
      setSessionLoading(false)
    }
  }

  async function startPastPaperSession() {
    if (!isPastPaperConfigValid) {
      setError("Choose an exam year and at least one subject before opening a past paper set.")
      return
    }

    setSessionLoading(true)
    setError("")
    setSaveMessage("")

    try {
      const response = await apiRequest("/practice/past-paper-session", {
        method: "POST",
        body: JSON.stringify({
          examType: pastPaperConfig.examType,
          year: pastPaperConfig.year,
          subjects: pastPaperConfig.subjects
        })
      })

      const questions = response?.items || []

      setSession({
        sessionType: "past-paper",
        examType: pastPaperConfig.examType,
        title: response?.title || `${pastPaperConfig.examType} ${pastPaperConfig.year} past question set`,
        subject: "",
        subjects: pastPaperConfig.subjects,
        year: pastPaperConfig.year,
        questions,
        timedMode: pastPaperConfig.timedMode,
        startedAt: Date.now()
      })
      setAnswers({})
      setCurrentQuestionIndex(0)
      setResult(null)
      setRemainingSeconds(
        pastPaperConfig.timedMode ? questions.length * Number(pastPaperConfig.secondsPerQuestion) : null
      )
    } catch (requestError) {
      setError(requestError.message || "Unable to open this past paper set.")
    } finally {
      setSessionLoading(false)
    }
  }

  async function startMockSession() {
    if (!isMockConfigValid) {
      setError(
        mockConfig.examType === "JAMB"
          ? "JAMB full mocks require Use of English plus three other subjects."
          : "WAEC full mocks require at least four selected subjects."
      )
      return
    }

    setSessionLoading(true)
    setError("")
    setSaveMessage("")

    try {
      const response = await apiRequest("/practice/mock-session", {
        method: "POST",
        body: JSON.stringify({
          examType: mockConfig.examType,
          subjects: mockConfig.subjects,
          totalQuestions: mockConfig.totalQuestions
        })
      })

      const questions = response?.items || []

      setSession({
        sessionType: "mock",
        examType: mockConfig.examType,
        title: response?.title || `${mockConfig.examType} full mock exam`,
        subject: "",
        subjects: mockConfig.subjects,
        questions,
        timedMode: mockConfig.timedMode,
        startedAt: Date.now()
      })
      setAnswers({})
      setCurrentQuestionIndex(0)
      setResult(null)
      setRemainingSeconds(mockConfig.timedMode ? questions.length * Number(mockConfig.secondsPerQuestion) : null)
    } catch (requestError) {
      setError(requestError.message || "Unable to start this full mock exam.")
    } finally {
      setSessionLoading(false)
    }
  }

  function togglePastPaperSubject(subjectName) {
    setPastPaperConfig((current) => {
      const isSelected = current.subjects.includes(subjectName)

      return {
        ...current,
        subjects: isSelected
          ? current.subjects.filter((item) => item !== subjectName)
          : [...current.subjects, subjectName]
      }
    })
  }

  function toggleMockSubject(subjectName) {
    setMockConfig((current) => {
      if (current.examType === "JAMB" && subjectName === "Use of English") {
        return current
      }

      const isSelected = current.subjects.includes(subjectName)

      if (isSelected) {
        return {
          ...current,
          subjects: current.subjects.filter((item) => item !== subjectName)
        }
      }

      const maxSubjects = current.examType === "JAMB" ? 4 : 6

      if (current.subjects.length >= maxSubjects) {
        return current
      }

      return {
        ...current,
        subjects: [...current.subjects, subjectName]
      }
    })
  }

  async function handleSubmitPractice(autoSubmit = false) {
    if (!session || submitting || result) {
      return
    }

    setSubmitting(true)
    setError("")

    try {
      const durationSeconds = session.startedAt
        ? Math.round((Date.now() - session.startedAt) / 1000)
        : 0

      const response = await apiRequest("/practice/submit", {
        method: "POST",
        body: JSON.stringify({
          sessionType: session.sessionType,
          examType: session.examType,
          title: session.title,
          subject: session.subject,
          questionIds: session.questions.map((question) => question.id),
          answers,
          durationSeconds
        })
      })

      setResult(response)
      setRemainingSeconds(0)

      const wasSaved = await saveAttempt({
        sessionType: response.sessionType,
        examType: response.examType,
        title: response.title,
        subject: response.subject,
        subjects: response.subjects,
        totalQuestions: response.totalQuestions,
        correctAnswers: response.correctAnswers,
        percentage: response.percentage,
        durationSeconds: response.durationSeconds,
        weakTopics: response.weakTopics,
        subjectBreakdown: response.subjectBreakdown,
        topicBreakdown: response.topicBreakdown
      })

      if (autoSubmit) {
        setSaveMessage(
          wasSaved
            ? "Time is up. Your attempt was submitted and saved."
            : "Time is up. Your attempt was submitted, but history could not sync right now."
        )
      } else {
        setSaveMessage(
          wasSaved
            ? "Practice result saved to your history."
            : "Practice completed. History could not be synced right now."
        )
      }
    } catch (requestError) {
      setError(requestError.message || "Unable to submit practice.")
    } finally {
      setSubmitting(false)
    }
  }

  const summaryCards = [
    { label: "Total attempts", value: analytics.totalAttempts },
    { label: "Subject drills", value: analytics.totalDrills },
    { label: "Past papers", value: analytics.totalPastPapers },
    { label: "Full mocks", value: analytics.totalMocks },
    { label: "Average score", value: `${analytics.averageScore}%` }
  ]

  const currentUserOutsideTop =
    leaderboard.currentUser &&
    !leaderboard.leaders.some((entry) => entry.userId === leaderboard.currentUser.userId)

  return (
    <div className="space-y-6 animate-rise">
      <SectionHeader
        title="JAMB & WAEC CBT Practice"
        subtitle="Run subject drills, open exam-year past paper sets, take full mock exams, and track streaks, scores, and leaderboard movement."
      />

      <div
        className={`relative overflow-hidden rounded-[32px] bg-gradient-to-r p-8 text-white shadow-xl ${activeExamMeta.accent}`}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.22),transparent_35%)]" />
        <div className="relative z-10 grid gap-6 lg:grid-cols-[1.2fr,0.8fr]">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-white/75">
              Exam readiness lab
            </p>
            <h2 className="mt-2 font-display text-4xl font-bold">{activeExamMeta.label}</h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/85">
              {activeExamMeta.subtitle} Students can now revise by year, monitor daily momentum, and compare their progress on a live practice leaderboard.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
            <div className="rounded-3xl border border-white/20 bg-white/10 p-4 backdrop-blur-sm">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/70">
                Question bank
              </p>
              <p className="mt-2 text-3xl font-bold">{totalQuestionBank}</p>
            </div>
            <div className="rounded-3xl border border-white/20 bg-white/10 p-4 backdrop-blur-sm">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/70">
                Subjects ready
              </p>
              <p className="mt-2 text-3xl font-bold">{totalSubjectCount}</p>
            </div>
            <div className="rounded-3xl border border-white/20 bg-white/10 p-4 backdrop-blur-sm">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/70">
                Saved mocks
              </p>
              <p className="mt-2 text-3xl font-bold">{savedMockCount}</p>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="flex flex-col gap-3 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-600 dark:border-red-900/40 dark:bg-red-900/10 dark:text-red-300 sm:flex-row sm:items-center sm:justify-between">
          <span>{error}</span>
          {canRetryInitialLoad && (
            <button
              type="button"
              onClick={() => setReloadCount((count) => count + 1)}
              disabled={catalogLoading || progressLoading || sessionLoading || submitting}
              className="inline-flex w-fit items-center rounded-full border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-700 transition-colors hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-70 dark:border-red-800 dark:text-red-200 dark:hover:bg-red-900/20"
            >
              {catalogLoading || progressLoading ? "Retrying..." : "Retry"}
            </button>
          )}
        </div>
      )}

      {saveMessage && (
        <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-900/10 dark:text-emerald-300">
          {saveMessage}
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {[
          { id: "drill", label: "Subject Drill", icon: Target },
          { id: "past-paper", label: "Past Papers", icon: BookMarked },
          { id: "mock", label: "Full Mock", icon: MonitorPlay },
          { id: "analytics", label: "Analytics", icon: BarChart3 }
        ].map((item) => {
          const Icon = item.icon
          const isActive = item.id === mode

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleModeChange(item.id)}
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-xs font-bold uppercase tracking-[0.2em] transition-colors ${
                isActive
                  ? "bg-primary text-white shadow-lg shadow-primary/20"
                  : "bg-white text-slate-600 hover:bg-primary/10 hover:text-primary dark:bg-slate-900 dark:text-slate-300"
              }`}
            >
              <Icon size={16} />
              {item.label}
            </button>
          )
        })}
      </div>

      {mode === "analytics" ? (
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-5">
            {summaryCards.map((item) => (
              <Card key={item.label} className="rounded-[28px] p-5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">
                  {item.label}
                </p>
                <p className="mt-3 text-3xl font-bold text-slate-900 dark:text-white">{item.value}</p>
              </Card>
            ))}
          </div>

          {progressLoading ? (
            <Card className="rounded-[28px] p-6">
              <div className="flex items-center gap-3 text-sm font-semibold text-slate-500 dark:text-slate-300">
                <LoaderCircle size={18} className="animate-spin" />
                Loading your practice analytics...
              </div>
            </Card>
          ) : analytics.totalAttempts === 0 ? (
            <Card className="rounded-[28px] p-8 text-center">
              <p className="font-display text-2xl font-semibold text-slate-900 dark:text-white">
                No analytics yet
              </p>
              <p className="mt-3 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                Complete a drill, past paper set, or full mock exam and your streak, topic trends, and leaderboard position will appear here automatically.
              </p>
            </Card>
          ) : (
            <>
              <div className="grid gap-6 xl:grid-cols-[0.8fr,1.2fr]">
                <Card className="space-y-5 p-6 sm:p-7">
                  <div className="flex items-center gap-3">
                    <span className="rounded-2xl bg-amber-100 p-3 text-amber-600 dark:bg-amber-500/10 dark:text-amber-300">
                      <Sparkles size={20} />
                    </span>
                    <div>
                      <p className="text-sm font-bold text-slate-800 dark:text-slate-100">Practice streak</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Stay consistent and build momentum day by day.
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-3">
                    <div className="rounded-3xl bg-slate-50 p-4 dark:bg-slate-900">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">
                        Current
                      </p>
                      <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
                        {streakSummary.currentStreak}
                      </p>
                    </div>
                    <div className="rounded-3xl bg-slate-50 p-4 dark:bg-slate-900">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">
                        Longest
                      </p>
                      <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
                        {streakSummary.longestStreak}
                      </p>
                    </div>
                    <div className="rounded-3xl bg-slate-50 p-4 dark:bg-slate-900">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">
                        Active days
                      </p>
                      <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
                        {streakSummary.activeDays}
                      </p>
                    </div>
                  </div>

                  <div className="rounded-3xl border border-slate-100 bg-slate-50/70 p-5 dark:border-slate-800 dark:bg-slate-900/40">
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                      Last practice day: {formatDateLabel(streakSummary.lastPracticeDate)}
                    </p>
                    <p className="mt-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                      Practice at least once a day to keep the streak alive. Past papers and full mocks count too.
                    </p>
                  </div>
                </Card>

                <Card className="space-y-5 p-6 sm:p-7">
                  <div className="flex items-center gap-3">
                    <span className="rounded-2xl bg-primary/10 p-3 text-primary">
                      <Trophy size={20} />
                    </span>
                    <div>
                      <p className="text-sm font-bold text-slate-800 dark:text-slate-100">Practice leaderboard</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Ranked by consistency, correct answers, and higher-value sessions.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {leaderboard.leaders.slice(0, 5).map((entry) => (
                      <div
                        key={entry.userId}
                        className={`flex items-center justify-between gap-3 rounded-3xl border p-4 ${
                          entry.isCurrentUser
                            ? "border-primary/30 bg-primary/5"
                            : "border-slate-100 bg-slate-50/70 dark:border-slate-800 dark:bg-slate-900/40"
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-sm font-bold text-slate-700 shadow-sm dark:bg-slate-950 dark:text-slate-200">
                            #{entry.rank}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 dark:text-white">{entry.name}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                              {entry.totalAttempts} sessions • {entry.currentStreak} day streak
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-slate-900 dark:text-white">{entry.points} pts</p>
                          <p className={`text-xs font-semibold ${getScoreTone(entry.averageScore)}`}>
                            Avg {entry.averageScore}%
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {currentUserOutsideTop && (
                    <div className="rounded-3xl border border-dashed border-slate-200 p-4 dark:border-slate-700">
                      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
                        Your position
                      </p>
                      <div className="mt-3 flex items-center justify-between gap-3">
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white">
                            #{leaderboard.currentUser.rank} {leaderboard.currentUser.name}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            {leaderboard.currentUser.totalAttempts} sessions • {leaderboard.currentUser.currentStreak} day streak
                          </p>
                        </div>
                        <p className="text-sm font-bold text-slate-900 dark:text-white">
                          {leaderboard.currentUser.points} pts
                        </p>
                      </div>
                    </div>
                  )}
                </Card>
              </div>

              <div className="grid gap-6 xl:grid-cols-[0.95fr,1.05fr]">
                <Card className="space-y-5 p-6 sm:p-7">
                  <div className="flex items-center gap-3">
                    <span className="rounded-2xl bg-primary/10 p-3 text-primary">
                      <Trophy size={20} />
                    </span>
                    <div>
                      <p className="text-sm font-bold text-slate-800 dark:text-slate-100">Exam performance</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Compare your average and best scores across JAMB and WAEC sessions.
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-4">
                    {analytics.examPerformance.map((entry) => (
                      <div
                        key={entry.examType}
                        className="rounded-3xl border border-slate-100 bg-slate-50/80 p-5 dark:border-slate-800 dark:bg-slate-900/40"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <h3 className="font-bold text-slate-900 dark:text-white">{entry.examType}</h3>
                          <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                            {entry.attempts} attempts
                          </span>
                        </div>
                        <div className="mt-4 grid gap-3 sm:grid-cols-2">
                          <div>
                            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                              Average
                            </p>
                            <p className={`mt-2 text-2xl font-bold ${getScoreTone(entry.averageScore)}`}>
                              {entry.averageScore}%
                            </p>
                          </div>
                          <div>
                            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                              Best score
                            </p>
                            <p className={`mt-2 text-2xl font-bold ${getScoreTone(entry.bestScore)}`}>
                              {entry.bestScore}%
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                <Card className="space-y-5 p-6 sm:p-7">
                  <div className="flex items-center gap-3">
                    <span className="rounded-2xl bg-secondary/10 p-3 text-secondary">
                      <Sparkles size={20} />
                    </span>
                    <div>
                      <p className="text-sm font-bold text-slate-800 dark:text-slate-100">Recent score trend</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        A quick look at how your latest sessions are moving.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {analytics.recentScores.map((entry) => (
                      <div key={entry.id}>
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                              {entry.title}
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                              {getSessionTypeLabel(entry.sessionType)} on {formatDateLabel(entry.createdAt)}
                            </p>
                          </div>
                          <span className={`text-sm font-bold ${getScoreTone(entry.percentage)}`}>
                            {entry.percentage}%
                          </span>
                        </div>
                        <div className="mt-3 h-2 rounded-full bg-slate-100 dark:bg-slate-800">
                          <div
                            className="h-2 rounded-full bg-gradient-to-r from-primary to-secondary"
                            style={{ width: `${Math.max(8, entry.percentage)}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="rounded-3xl bg-slate-50 p-5 dark:bg-slate-900">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">
                      Average mock score
                    </p>
                    <p className={`mt-2 text-3xl font-bold ${getScoreTone(analytics.averageMockScore)}`}>
                      {analytics.averageMockScore}%
                    </p>
                  </div>
                </Card>
              </div>

              <div className="grid gap-6 xl:grid-cols-[1.05fr,0.95fr]">
                <Card className="space-y-5 p-6 sm:p-7">
                  <div className="flex items-center gap-3">
                    <span className="rounded-2xl bg-emerald-100 p-3 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-300">
                      <Target size={20} />
                    </span>
                    <div>
                      <p className="text-sm font-bold text-slate-800 dark:text-slate-100">Subject performance</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Average score, latest result, and movement by subject.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {analytics.subjectPerformance.map((entry) => (
                      <div key={entry.subject} className="rounded-3xl bg-slate-50 p-4 dark:bg-slate-900">
                        <div className="flex items-center justify-between gap-3">
                          <p className="font-bold text-slate-900 dark:text-white">{entry.subject}</p>
                          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                            {entry.attempts} sessions
                          </span>
                        </div>
                        <div className="mt-3 h-2 rounded-full bg-slate-200 dark:bg-slate-800">
                          <div
                            className="h-2 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500"
                            style={{ width: `${Math.max(8, entry.averageScore)}%` }}
                          />
                        </div>
                        <div className="mt-3 grid gap-3 sm:grid-cols-3">
                          <div>
                            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                              Average
                            </p>
                            <p className={`mt-1 text-lg font-bold ${getScoreTone(entry.averageScore)}`}>
                              {entry.averageScore}%
                            </p>
                          </div>
                          <div>
                            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                              Latest
                            </p>
                            <p className={`mt-1 text-lg font-bold ${getScoreTone(entry.latestScore)}`}>
                              {entry.latestScore}%
                            </p>
                          </div>
                          <div>
                            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                              Trend
                            </p>
                            <p
                              className={`mt-1 text-lg font-bold ${
                                entry.trendDelta >= 0
                                  ? "text-emerald-600 dark:text-emerald-300"
                                  : "text-rose-600 dark:text-rose-300"
                              }`}
                            >
                              {entry.trendDelta >= 0 ? "+" : ""}
                              {entry.trendDelta}%
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                <Card className="space-y-5 p-6 sm:p-7">
                  <div className="flex items-center gap-3">
                    <span className="rounded-2xl bg-amber-100 p-3 text-amber-600 dark:bg-amber-500/10 dark:text-amber-300">
                      <BookMarked size={20} />
                    </span>
                    <div>
                      <p className="text-sm font-bold text-slate-800 dark:text-slate-100">Topic trend watch</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        These are the topics where revision will likely pay off fastest.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {analytics.topicTrend.map((entry) => (
                      <div
                        key={`${entry.subject}-${entry.topic}`}
                        className="rounded-3xl border border-slate-100 bg-slate-50/80 p-4 dark:border-slate-800 dark:bg-slate-900/40"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="font-bold text-slate-900 dark:text-white">{entry.topic}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">{entry.subject}</p>
                          </div>
                          <span className={`text-sm font-bold ${getScoreTone(entry.accuracy)}`}>
                            {entry.accuracy}%
                          </span>
                        </div>
                        <div className="mt-3 h-2 rounded-full bg-slate-200 dark:bg-slate-800">
                          <div
                            className="h-2 rounded-full bg-gradient-to-r from-amber-500 to-orange-500"
                            style={{ width: `${Math.max(8, entry.accuracy)}%` }}
                          />
                        </div>
                        <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
                          Missed {entry.misses} question{entry.misses === 1 ? "" : "s"} across {entry.attempts} tracked session
                          {entry.attempts === 1 ? "" : "s"}.
                        </p>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </>
          )}
        </div>
      ) : (
        <div className="grid gap-6 xl:grid-cols-[0.94fr,1.06fr]">
          <Card className="space-y-5 p-6 sm:p-7">
            {mode === "drill" && (
              <>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-primary/75">
                    Session setup
                  </p>
                  <h3 className="mt-2 font-display text-2xl font-semibold text-slate-900 dark:text-white">
                    Build a subject drill
                  </h3>
                </div>

                {catalogLoading ? (
                  <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-5 text-sm font-semibold text-slate-500 dark:bg-slate-800/60 dark:text-slate-300">
                    <LoaderCircle size={18} className="animate-spin" />
                    Loading practice catalog...
                  </div>
                ) : (
                  <>
                    <div className="flex flex-wrap gap-2">
                      {catalog.map((entry) => {
                        const isActive = entry.examType === drillConfig.examType

                        return (
                          <button
                            key={entry.examType}
                            type="button"
                            onClick={() => handleDrillExamSwitch(entry.examType)}
                            className={`rounded-full px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] transition-colors ${
                              isActive
                                ? "bg-primary text-white shadow-lg shadow-primary/20"
                                : "bg-slate-100 text-slate-600 hover:bg-primary/10 hover:text-primary dark:bg-slate-800 dark:text-slate-300"
                            }`}
                          >
                            {entry.examType}
                          </button>
                        )
                      })}
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      {drillSubjects.map((subject) => {
                        const isActive = subject.subject === drillConfig.subject

                        return (
                          <button
                            key={subject.subject}
                            type="button"
                            onClick={() =>
                              setDrillConfig((current) => ({
                                ...current,
                                subject: subject.subject,
                                year: "all",
                                questionLimit: Math.min(current.questionLimit, subject.count)
                              }))
                            }
                            className={`rounded-3xl border p-4 text-left transition-all ${
                              isActive
                                ? "border-primary bg-primary/5 shadow-sm"
                                : "border-slate-200 bg-white hover:border-primary/30 dark:border-slate-800 dark:bg-slate-900"
                            }`}
                          >
                            <div className="flex items-center justify-between gap-3">
                              <p className="font-bold text-slate-800 dark:text-slate-100">{subject.subject}</p>
                              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-500 dark:bg-slate-800 dark:text-slate-300">
                                {subject.count} Qs
                              </span>
                            </div>
                            <p className="mt-3 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                              Years: {subject.years.join(", ")}
                            </p>
                          </button>
                        )
                      })}
                    </div>

                    <div className="grid gap-4 sm:grid-cols-3">
                      <label className="space-y-2">
                        <span className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
                          Year filter
                        </span>
                        <select
                          value={drillConfig.year}
                          onChange={(event) =>
                            setDrillConfig((current) => ({
                              ...current,
                              year: event.target.value
                            }))
                          }
                          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 focus:border-primary/40 focus:ring-4 focus:ring-primary/10 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
                        >
                          <option value="all">All years</option>
                          {drillYearOptions.map((year) => (
                            <option key={year} value={year}>
                              {year}
                            </option>
                          ))}
                        </select>
                      </label>

                      <label className="space-y-2">
                        <span className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
                          Questions
                        </span>
                        <select
                          value={drillConfig.questionLimit}
                          onChange={(event) =>
                            setDrillConfig((current) => ({
                              ...current,
                              questionLimit: Number(event.target.value)
                            }))
                          }
                          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 focus:border-primary/40 focus:ring-4 focus:ring-primary/10 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
                        >
                          {drillQuestionOptions.map((count) => (
                            <option key={count} value={count}>
                              {count} questions
                            </option>
                          ))}
                        </select>
                      </label>

                      <label className="space-y-2">
                        <span className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
                          Seconds each
                        </span>
                        <select
                          value={drillConfig.secondsPerQuestion}
                          onChange={(event) =>
                            setDrillConfig((current) => ({
                              ...current,
                              secondsPerQuestion: Number(event.target.value)
                            }))
                          }
                          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 focus:border-primary/40 focus:ring-4 focus:ring-primary/10 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
                        >
                          {[30, 45, 60, 75].map((seconds) => (
                            <option key={seconds} value={seconds}>
                              {seconds} seconds
                            </option>
                          ))}
                        </select>
                      </label>
                    </div>

                    <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
                      <input
                        type="checkbox"
                        checked={drillConfig.timedMode}
                        onChange={(event) =>
                          setDrillConfig((current) => ({
                            ...current,
                            timedMode: event.target.checked
                          }))
                        }
                        className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary"
                      />
                      Run this subject drill in timed CBT mode
                    </label>

                    <button
                      type="button"
                      onClick={startDrillSession}
                      disabled={sessionLoading}
                      className="inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-5 py-4 text-sm font-bold text-white shadow-lg shadow-primary/20 transition-transform hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0"
                    >
                      {sessionLoading ? <LoaderCircle size={18} className="animate-spin" /> : <Target size={18} />}
                      {sessionLoading ? "Loading drill..." : "Start Subject Drill"}
                    </button>
                  </>
                )}
              </>
            )}

            {mode === "past-paper" && (
              <>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-primary/75">
                    Past paper setup
                  </p>
                  <h3 className="mt-2 font-display text-2xl font-semibold text-slate-900 dark:text-white">
                    Open an exam-year question set
                  </h3>
                </div>

                {catalogLoading ? (
                  <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-5 text-sm font-semibold text-slate-500 dark:bg-slate-800/60 dark:text-slate-300">
                    <LoaderCircle size={18} className="animate-spin" />
                    Loading past paper library...
                  </div>
                ) : (
                  <>
                    <div className="flex flex-wrap gap-2">
                      {catalog.map((entry) => {
                        const isActive = entry.examType === pastPaperConfig.examType

                        return (
                          <button
                            key={entry.examType}
                            type="button"
                            onClick={() => handlePastPaperExamSwitch(entry.examType)}
                            className={`rounded-full px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] transition-colors ${
                              isActive
                                ? "bg-primary text-white shadow-lg shadow-primary/20"
                                : "bg-slate-100 text-slate-600 hover:bg-primary/10 hover:text-primary dark:bg-slate-800 dark:text-slate-300"
                            }`}
                          >
                            {entry.examType}
                          </button>
                        )
                      })}
                    </div>

                    <div className="rounded-[28px] border border-slate-100 bg-slate-50/70 p-5 dark:border-slate-800 dark:bg-slate-900/40">
                      <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                        Pick a year and the subjects you want to revise. This loads every available question from that exam year for your selection.
                      </p>
                      <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                        Available questions for {pastPaperConfig.year || "this year"}: {pastPaperAvailableQuestions}
                      </p>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      {pastPaperYearEntries.map((yearEntry) => {
                        const isActive = yearEntry.year === pastPaperConfig.year

                        return (
                          <button
                            key={yearEntry.year}
                            type="button"
                            onClick={() =>
                              setPastPaperConfig((current) => ({
                                ...current,
                                year: yearEntry.year
                              }))
                            }
                            className={`rounded-3xl border p-4 text-left transition-all ${
                              isActive
                                ? "border-primary bg-primary/5 shadow-sm"
                                : "border-slate-200 bg-white hover:border-primary/30 dark:border-slate-800 dark:bg-slate-900"
                            }`}
                          >
                            <div className="flex items-center justify-between gap-3">
                              <p className="font-bold text-slate-800 dark:text-slate-100">{yearEntry.year}</p>
                              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-500 dark:bg-slate-800 dark:text-slate-300">
                                {yearEntry.count} Qs
                              </span>
                            </div>
                            <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
                              Past paper collection for {pastPaperConfig.examType}
                            </p>
                          </button>
                        )
                      })}
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      {pastPaperSubjectEntries.map((subject) => {
                        const isSelected = pastPaperConfig.subjects.includes(subject.subject)
                        const availableInYear = (subject.yearCounts || []).some(
                          (entry) => entry.year === pastPaperConfig.year && Number(entry.count) > 0
                        )

                        return (
                          <button
                            key={subject.subject}
                            type="button"
                            onClick={() => togglePastPaperSubject(subject.subject)}
                            className={`rounded-3xl border p-4 text-left transition-all ${
                              isSelected
                                ? "border-primary bg-primary/5 shadow-sm"
                                : "border-slate-200 bg-white hover:border-primary/30 dark:border-slate-800 dark:bg-slate-900"
                            } ${!availableInYear ? "opacity-60" : ""}`}
                          >
                            <div className="flex items-center justify-between gap-3">
                              <p className="font-bold text-slate-800 dark:text-slate-100">{subject.subject}</p>
                              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-500 dark:bg-slate-800 dark:text-slate-300">
                                {availableInYear ? "Ready" : "No set"}
                              </span>
                            </div>
                            <p className="mt-3 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                              Topics: {subject.topics.slice(0, 3).join(", ")}
                            </p>
                          </button>
                        )
                      })}
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <label className="space-y-2">
                        <span className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
                          Seconds each
                        </span>
                        <select
                          value={pastPaperConfig.secondsPerQuestion}
                          onChange={(event) =>
                            setPastPaperConfig((current) => ({
                              ...current,
                              secondsPerQuestion: Number(event.target.value)
                            }))
                          }
                          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 focus:border-primary/40 focus:ring-4 focus:ring-primary/10 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
                        >
                          {[45, 60, 75].map((seconds) => (
                            <option key={seconds} value={seconds}>
                              {seconds} seconds
                            </option>
                          ))}
                        </select>
                      </label>

                      <label className="space-y-2">
                        <span className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
                          Selection size
                        </span>
                        <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200">
                          {pastPaperConfig.subjects.length} subjects selected
                        </div>
                      </label>
                    </div>

                    <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
                      <input
                        type="checkbox"
                        checked={pastPaperConfig.timedMode}
                        onChange={(event) =>
                          setPastPaperConfig((current) => ({
                            ...current,
                            timedMode: event.target.checked
                          }))
                        }
                        className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary"
                      />
                      Run this past paper set in timed CBT mode
                    </label>

                    <button
                      type="button"
                      onClick={startPastPaperSession}
                      disabled={sessionLoading || !isPastPaperConfigValid}
                      className="inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-5 py-4 text-sm font-bold text-white shadow-lg shadow-primary/20 transition-transform hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0"
                    >
                      {sessionLoading ? <LoaderCircle size={18} className="animate-spin" /> : <BookMarked size={18} />}
                      {sessionLoading ? "Loading year set..." : "Open Past Paper Set"}
                    </button>
                  </>
                )}
              </>
            )}

            {mode === "mock" && (
              <>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-primary/75">
                    Full mock setup
                  </p>
                  <h3 className="mt-2 font-display text-2xl font-semibold text-slate-900 dark:text-white">
                    Build a 40 to 60 question mock exam
                  </h3>
                </div>

                {catalogLoading ? (
                  <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-5 text-sm font-semibold text-slate-500 dark:bg-slate-800/60 dark:text-slate-300">
                    <LoaderCircle size={18} className="animate-spin" />
                    Loading mock exam builder...
                  </div>
                ) : (
                  <>
                    <div className="flex flex-wrap gap-2">
                      {catalog.map((entry) => {
                        const isActive = entry.examType === mockConfig.examType

                        return (
                          <button
                            key={entry.examType}
                            type="button"
                            onClick={() => handleMockExamSwitch(entry.examType)}
                            className={`rounded-full px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] transition-colors ${
                              isActive
                                ? "bg-primary text-white shadow-lg shadow-primary/20"
                                : "bg-slate-100 text-slate-600 hover:bg-primary/10 hover:text-primary dark:bg-slate-800 dark:text-slate-300"
                            }`}
                          >
                            {entry.examType}
                          </button>
                        )
                      })}
                    </div>

                    <div className="rounded-[28px] border border-slate-100 bg-slate-50/70 p-5 dark:border-slate-800 dark:bg-slate-900/40">
                      <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                        {mockConfig.examType === "JAMB"
                          ? "JAMB mock rule: Use of English is compulsory, plus three other subjects."
                          : "WAEC mock rule: choose at least four subjects and up to six for a broader revision session."}
                      </p>
                      <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                        Selected subjects: {mockConfig.subjects.length}. Available question pool: {mockAvailableQuestions}.
                      </p>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      {mockSubjectEntries.map((subject) => {
                        const isSelected = mockConfig.subjects.includes(subject.subject)
                        const isLocked = mockConfig.examType === "JAMB" && subject.subject === "Use of English"

                        return (
                          <button
                            key={subject.subject}
                            type="button"
                            onClick={() => toggleMockSubject(subject.subject)}
                            className={`rounded-3xl border p-4 text-left transition-all ${
                              isSelected
                                ? "border-primary bg-primary/5 shadow-sm"
                                : "border-slate-200 bg-white hover:border-primary/30 dark:border-slate-800 dark:bg-slate-900"
                            }`}
                          >
                            <div className="flex items-center justify-between gap-3">
                              <p className="font-bold text-slate-800 dark:text-slate-100">{subject.subject}</p>
                              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-500 dark:bg-slate-800 dark:text-slate-300">
                                {subject.count} Qs
                              </span>
                            </div>
                            <p className="mt-3 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                              Topics: {subject.topics.slice(0, 3).join(", ")}
                            </p>
                            {isLocked && (
                              <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">
                                Compulsory subject
                              </p>
                            )}
                          </button>
                        )
                      })}
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <label className="space-y-2">
                        <span className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
                          Mock size
                        </span>
                        <select
                          value={mockConfig.totalQuestions}
                          onChange={(event) =>
                            setMockConfig((current) => ({
                              ...current,
                              totalQuestions: Number(event.target.value)
                            }))
                          }
                          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 focus:border-primary/40 focus:ring-4 focus:ring-primary/10 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
                        >
                          {mockQuestionOptions.length > 0 ? (
                            mockQuestionOptions.map((count) => (
                              <option key={count} value={count}>
                                {count} questions
                              </option>
                            ))
                          ) : (
                            <option value={40}>Select more subjects</option>
                          )}
                        </select>
                      </label>

                      <label className="space-y-2">
                        <span className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
                          Seconds each
                        </span>
                        <select
                          value={mockConfig.secondsPerQuestion}
                          onChange={(event) =>
                            setMockConfig((current) => ({
                              ...current,
                              secondsPerQuestion: Number(event.target.value)
                            }))
                          }
                          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 focus:border-primary/40 focus:ring-4 focus:ring-primary/10 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
                        >
                          {[45, 60, 75].map((seconds) => (
                            <option key={seconds} value={seconds}>
                              {seconds} seconds
                            </option>
                          ))}
                        </select>
                      </label>
                    </div>

                    <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
                      <input
                        type="checkbox"
                        checked={mockConfig.timedMode}
                        onChange={(event) =>
                          setMockConfig((current) => ({
                            ...current,
                            timedMode: event.target.checked
                          }))
                        }
                        className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary"
                      />
                      Run this full mock exam in timed CBT mode
                    </label>

                    <button
                      type="button"
                      onClick={startMockSession}
                      disabled={sessionLoading || !isMockConfigValid}
                      className="inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-5 py-4 text-sm font-bold text-white shadow-lg shadow-primary/20 transition-transform hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0"
                    >
                      {sessionLoading ? <LoaderCircle size={18} className="animate-spin" /> : <MonitorPlay size={18} />}
                      {sessionLoading ? "Loading mock..." : "Start Full Mock Exam"}
                    </button>
                  </>
                )}
              </>
            )}
          </Card>

          {!session ? (
            <Card className="space-y-5 p-6 sm:p-7">
              <div className="flex items-center gap-3">
                <span className="rounded-2xl bg-primary/10 p-3 text-primary">
                  {mode === "mock" ? <MonitorPlay size={20} /> : mode === "past-paper" ? <BookMarked size={20} /> : <Target size={20} />}
                </span>
                <div>
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-100">
                    {mode === "mock" ? "Mock Exam Preview" : mode === "past-paper" ? "Past Paper Preview" : "Subject Drill Preview"}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {mode === "mock"
                      ? "Create a mixed-subject CBT simulation and review each subject after scoring."
                      : mode === "past-paper"
                        ? "Open a year-based question set and revise how that exam paper feels."
                        : "Choose a subject, filter by year, and run a focused revision round."}
                  </p>
                </div>
              </div>

              {mode === "mock" ? (
                <>
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div className="rounded-3xl bg-slate-50 p-4 dark:bg-slate-900">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">
                        Exam
                      </p>
                      <p className="mt-2 text-lg font-bold text-slate-800 dark:text-slate-100">
                        {mockConfig.examType}
                      </p>
                    </div>
                    <div className="rounded-3xl bg-slate-50 p-4 dark:bg-slate-900">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">
                        Subjects
                      </p>
                      <p className="mt-2 text-lg font-bold text-slate-800 dark:text-slate-100">
                        {mockConfig.subjects.length}
                      </p>
                    </div>
                    <div className="rounded-3xl bg-slate-50 p-4 dark:bg-slate-900">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">
                        Mock size
                      </p>
                      <p className="mt-2 text-lg font-bold text-slate-800 dark:text-slate-100">
                        {mockConfig.totalQuestions}
                      </p>
                    </div>
                  </div>

                  <div className="rounded-[28px] border border-dashed border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-950">
                    <h4 className="font-display text-2xl font-semibold text-slate-900 dark:text-white">
                      What students get in full mock mode
                    </h4>
                    <div className="mt-4 grid gap-3">
                      {[
                        "40 to 60 question mixed-subject CBT simulations.",
                        "Subject-by-subject score breakdown after submission.",
                        "Weak-topic tracking for analytics and smarter revision."
                      ].map((item) => (
                        <div key={item} className="flex items-start gap-3">
                          <CheckCircle2 size={18} className="mt-0.5 text-emerald-500" />
                          <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">{item}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              ) : mode === "past-paper" ? (
                <>
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div className="rounded-3xl bg-slate-50 p-4 dark:bg-slate-900">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">
                        Exam
                      </p>
                      <p className="mt-2 text-lg font-bold text-slate-800 dark:text-slate-100">
                        {pastPaperConfig.examType}
                      </p>
                    </div>
                    <div className="rounded-3xl bg-slate-50 p-4 dark:bg-slate-900">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">
                        Year
                      </p>
                      <p className="mt-2 text-lg font-bold text-slate-800 dark:text-slate-100">
                        {pastPaperConfig.year || "Select year"}
                      </p>
                    </div>
                    <div className="rounded-3xl bg-slate-50 p-4 dark:bg-slate-900">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">
                        Questions
                      </p>
                      <p className="mt-2 text-lg font-bold text-slate-800 dark:text-slate-100">
                        {pastPaperAvailableQuestions}
                      </p>
                    </div>
                  </div>

                  <div className="rounded-[28px] border border-dashed border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-950">
                    <h4 className="font-display text-2xl font-semibold text-slate-900 dark:text-white">
                      What this past paper mode gives students
                    </h4>
                    <div className="mt-4 grid gap-3">
                      {[
                        "Year-based practice bundles across the selected subjects.",
                        "A clean bridge between quick drills and longer full mocks.",
                        "Useful for comparing strengths across different exam years."
                      ].map((item) => (
                        <div key={item} className="flex items-start gap-3">
                          <CheckCircle2 size={18} className="mt-0.5 text-emerald-500" />
                          <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">{item}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {pastPaperConfig.subjects.map((subject) => (
                      <span
                        key={subject}
                        className="rounded-full bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary"
                      >
                        {subject}
                      </span>
                    ))}
                  </div>
                </>
              ) : (
                <>
                  <div className="grid gap-4 sm:grid-cols-4">
                    <div className="rounded-3xl bg-slate-50 p-4 dark:bg-slate-900">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">
                        Exam
                      </p>
                      <p className="mt-2 text-lg font-bold text-slate-800 dark:text-slate-100">
                        {drillConfig.examType}
                      </p>
                    </div>
                    <div className="rounded-3xl bg-slate-50 p-4 dark:bg-slate-900">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">
                        Subject
                      </p>
                      <p className="mt-2 text-lg font-bold text-slate-800 dark:text-slate-100">
                        {drillConfig.subject || "Select subject"}
                      </p>
                    </div>
                    <div className="rounded-3xl bg-slate-50 p-4 dark:bg-slate-900">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">
                        Year
                      </p>
                      <p className="mt-2 text-lg font-bold text-slate-800 dark:text-slate-100">
                        {drillConfig.year === "all" ? "All" : drillConfig.year}
                      </p>
                    </div>
                    <div className="rounded-3xl bg-slate-50 p-4 dark:bg-slate-900">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">
                        Questions
                      </p>
                      <p className="mt-2 text-lg font-bold text-slate-800 dark:text-slate-100">
                        {drillConfig.questionLimit}
                      </p>
                    </div>
                  </div>

                  <div className="rounded-[28px] border border-dashed border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-950">
                    <h4 className="font-display text-2xl font-semibold text-slate-900 dark:text-white">
                      What this drill mode gives students
                    </h4>
                    <div className="mt-4 grid gap-3">
                      {[
                        "Year-based practice for targeted revision.",
                        "Timed CBT speed-building with instant scoring.",
                        "Question-by-question explanations after submission."
                      ].map((item) => (
                        <div key={item} className="flex items-start gap-3">
                          <CheckCircle2 size={18} className="mt-0.5 text-emerald-500" />
                          <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">{item}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </Card>
          ) : (
            <Card className="space-y-5 p-6 sm:p-7">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">
                      {session.examType}
                    </span>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500 dark:bg-slate-800 dark:text-slate-300">
                      {getSessionTypeLabel(session.sessionType)}
                    </span>
                    {session.year && (
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500 dark:bg-slate-800 dark:text-slate-300">
                        {session.year}
                      </span>
                    )}
                  </div>
                  <h3 className="mt-3 font-display text-2xl font-semibold text-slate-900 dark:text-white">
                    {result ? "Practice review" : session.title}
                  </h3>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="rounded-2xl bg-slate-50 px-4 py-3 text-center dark:bg-slate-900">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">
                      Progress
                    </p>
                    <p className="mt-1 text-xl font-bold text-slate-800 dark:text-slate-100">
                      {answeredCount}/{session.questions.length}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-slate-50 px-4 py-3 text-center dark:bg-slate-900">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">
                      Current
                    </p>
                    <p className="mt-1 text-xl font-bold text-slate-800 dark:text-slate-100">
                      {currentQuestionIndex + 1}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-slate-50 px-4 py-3 text-center dark:bg-slate-900">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">
                      Timer
                    </p>
                    <p className="mt-1 flex items-center justify-center gap-2 text-xl font-bold text-slate-800 dark:text-slate-100">
                      <Clock3 size={16} className="text-primary" />
                      {session.timedMode ? formatSeconds(remainingSeconds) : "Off"}
                    </p>
                  </div>
                </div>
              </div>

              {!result && currentQuestion && (
                <>
                  <div className="flex flex-wrap gap-2">
                    {session.questions.map((question, index) => {
                      const isActive = index === currentQuestionIndex
                      const isAnswered = answers[question.id] !== undefined

                      return (
                        <button
                          key={question.id}
                          type="button"
                          onClick={() => setCurrentQuestionIndex(index)}
                          className={`flex h-10 w-10 items-center justify-center rounded-xl text-xs font-bold transition-colors ${
                            isActive
                              ? "bg-primary text-white"
                              : isAnswered
                                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-300"
                                : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-300"
                          }`}
                        >
                          {index + 1}
                        </button>
                      )
                    })}
                  </div>

                  <div className="rounded-[28px] border border-slate-100 bg-slate-50/70 p-6 dark:border-slate-800 dark:bg-slate-900/40">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500 shadow-sm dark:bg-slate-900 dark:text-slate-300">
                        {currentQuestion.subject}
                      </span>
                      <span className="rounded-full bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500 shadow-sm dark:bg-slate-900 dark:text-slate-300">
                        {currentQuestion.topic}
                      </span>
                      <span className="rounded-full bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500 shadow-sm dark:bg-slate-900 dark:text-slate-300">
                        {currentQuestion.year}
                      </span>
                    </div>

                    <p className="mt-4 font-display text-2xl font-semibold leading-relaxed text-slate-900 dark:text-white">
                      {currentQuestion.prompt}
                    </p>

                    <div className="mt-6 grid gap-3">
                      {currentQuestion.options.map((option, optionIndex) => {
                        const isSelected = answers[currentQuestion.id] === optionIndex

                        return (
                          <button
                            key={`${currentQuestion.id}-${optionIndex}`}
                            type="button"
                            onClick={() =>
                              setAnswers((current) => ({
                                ...current,
                                [currentQuestion.id]: optionIndex
                              }))
                            }
                            className={`flex items-start gap-3 rounded-2xl border px-4 py-4 text-left text-sm font-semibold transition-all ${
                              isSelected
                                ? "border-primary bg-primary text-white shadow-lg shadow-primary/20"
                                : "border-slate-200 bg-white text-slate-700 hover:border-primary/30 hover:text-primary dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
                            }`}
                          >
                            <span
                              className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                                isSelected
                                  ? "bg-white/20 text-white"
                                  : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-300"
                              }`}
                            >
                              {String.fromCharCode(65 + optionIndex)}
                            </span>
                            <span>{option}</span>
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  <div className="flex flex-wrap justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => setCurrentQuestionIndex((current) => Math.max(0, current - 1))}
                      disabled={currentQuestionIndex === 0}
                      className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold text-slate-700 transition-colors hover:border-primary/30 hover:text-primary disabled:opacity-50 dark:border-slate-700 dark:text-slate-200"
                    >
                      <ChevronLeft size={16} />
                      Previous
                    </button>

                    <div className="flex flex-wrap gap-3">
                      <button
                        type="button"
                        onClick={resetSessionState}
                        className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold text-slate-700 transition-colors hover:border-rose-200 hover:text-rose-600 dark:border-slate-700 dark:text-slate-200"
                      >
                        <RefreshCcw size={16} />
                        End Session
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          setCurrentQuestionIndex((current) =>
                            Math.min(session.questions.length - 1, current + 1)
                          )
                        }
                        disabled={currentQuestionIndex === session.questions.length - 1}
                        className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold text-slate-700 transition-colors hover:border-primary/30 hover:text-primary disabled:opacity-50 dark:border-slate-700 dark:text-slate-200"
                      >
                        Next
                        <ChevronRight size={16} />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleSubmitPractice(false)}
                        disabled={submitting}
                        className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-white shadow-lg shadow-primary/20 transition-transform hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0"
                      >
                        {submitting ? <LoaderCircle size={16} className="animate-spin" /> : <Trophy size={16} />}
                        {submitting ? "Submitting..." : "Submit Practice"}
                      </button>
                    </div>
                  </div>
                </>
              )}

              {result && (
                <div className="space-y-5">
                  <div className="grid gap-4 md:grid-cols-4">
                    <div className="rounded-3xl bg-primary p-5 text-white shadow-lg shadow-primary/20">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/70">
                        Score
                      </p>
                      <p className="mt-2 text-4xl font-bold">{result.percentage}%</p>
                    </div>
                    <div className="rounded-3xl bg-slate-50 p-5 dark:bg-slate-900">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">
                        Correct
                      </p>
                      <p className="mt-2 text-3xl font-bold text-slate-800 dark:text-slate-100">
                        {result.correctAnswers}
                      </p>
                    </div>
                    <div className="rounded-3xl bg-slate-50 p-5 dark:bg-slate-900">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">
                        Wrong
                      </p>
                      <p className="mt-2 text-3xl font-bold text-slate-800 dark:text-slate-100">
                        {result.wrongAnswers}
                      </p>
                    </div>
                    <div className="rounded-3xl bg-slate-50 p-5 dark:bg-slate-900">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">
                        Duration
                      </p>
                      <p className="mt-2 text-3xl font-bold text-slate-800 dark:text-slate-100">
                        {formatSeconds(result.durationSeconds)}
                      </p>
                    </div>
                  </div>

                  <div className="rounded-[28px] border border-slate-100 bg-slate-50/70 p-5 dark:border-slate-800 dark:bg-slate-900/40">
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{result.feedback}</p>
                    {result.weakTopics.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {result.weakTopics.map((topic) => (
                          <span
                            key={topic}
                            className="rounded-full bg-amber-100 px-3 py-1.5 text-xs font-semibold text-amber-700 dark:bg-amber-500/10 dark:text-amber-300"
                          >
                            Review {topic}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {result.subjectBreakdown.length > 0 && (
                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                      {result.subjectBreakdown.map((item) => (
                        <div
                          key={item.subject}
                          className="rounded-3xl border border-slate-100 bg-slate-50/80 p-5 dark:border-slate-800 dark:bg-slate-900/40"
                        >
                          <div className="flex items-center justify-between gap-3">
                            <p className="font-bold text-slate-900 dark:text-white">{item.subject}</p>
                            <span className={`text-sm font-bold ${getScoreTone(item.percentage)}`}>
                              {item.percentage}%
                            </span>
                          </div>
                          <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
                            {item.correctAnswers}/{item.totalQuestions} correct
                          </p>
                          <div className="mt-3 h-2 rounded-full bg-slate-200 dark:bg-slate-800">
                            <div
                              className="h-2 rounded-full bg-gradient-to-r from-primary to-secondary"
                              style={{ width: `${Math.max(8, item.percentage)}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="space-y-4">
                    {result.review.map((item, index) => (
                      <div
                        key={item.questionId}
                        className={`rounded-[28px] border p-5 ${
                          item.isCorrect
                            ? "border-emerald-200 bg-emerald-50/60 dark:border-emerald-900/40 dark:bg-emerald-900/10"
                            : "border-red-200 bg-red-50/60 dark:border-red-900/40 dark:bg-red-900/10"
                        }`}
                      >
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="rounded-full bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500 shadow-sm dark:bg-slate-900 dark:text-slate-300">
                            Question {index + 1}
                          </span>
                          <span className="rounded-full bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500 shadow-sm dark:bg-slate-900 dark:text-slate-300">
                            {item.subject}
                          </span>
                          <span className="rounded-full bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500 shadow-sm dark:bg-slate-900 dark:text-slate-300">
                            {item.topic}
                          </span>
                        </div>
                        <p className="mt-4 text-base font-semibold leading-relaxed text-slate-900 dark:text-white">
                          {item.prompt}
                        </p>
                        <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
                          Your answer:{" "}
                          <span className="font-bold">
                            {item.selectedOption !== null ? item.options[item.selectedOption] : "No answer"}
                          </span>
                        </p>
                        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                          Correct answer: <span className="font-bold">{item.correctAnswer}</span>
                        </p>
                        <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                          {item.explanation}
                        </p>
                      </div>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      resetSessionState()
                      setSaveMessage("")
                    }}
                    className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-white shadow-lg shadow-primary/20 transition-transform hover:-translate-y-0.5"
                  >
                    <RefreshCcw size={16} />
                    Start Another Round
                  </button>
                </div>
              )}
            </Card>
          )}
        </div>
      )}

      <Card className="space-y-5 p-6 sm:p-7">
        <div className="flex items-center gap-3">
          <span className="rounded-2xl bg-secondary/10 p-3 text-secondary">
            <BookMarked size={20} />
          </span>
          <div>
            <p className="text-sm font-bold text-slate-800 dark:text-slate-100">Recent Practice History</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Keep an eye on saved drills, past paper sets, and mock exams so students can spot their strongest and weakest areas.
            </p>
          </div>
        </div>

        {history.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {history.slice(0, 6).map((attempt) => (
              <div
                key={attempt.id}
                className="rounded-3xl border border-slate-100 bg-slate-50/70 p-5 dark:border-slate-800 dark:bg-slate-900/40"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="rounded-full bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">
                    {attempt.examType}
                  </span>
                  <span className={`text-sm font-bold ${getScoreTone(attempt.percentage)}`}>
                    {attempt.percentage}%
                  </span>
                </div>
                <h4 className="mt-4 font-bold text-slate-800 dark:text-slate-100">
                  {attempt.title || attempt.subject || attempt.examType}
                </h4>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                  {attempt.correctAnswers}/{attempt.totalQuestions} correct in {formatSeconds(attempt.durationSeconds)}
                </p>
                <p className="mt-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                  {getSessionTypeLabel(attempt.sessionType)} / {formatDateLabel(attempt.createdAt)}
                </p>
                {attempt.subjectBreakdown?.length > 1 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {attempt.subjectBreakdown.slice(0, 3).map((item) => (
                      <span
                        key={`${attempt.id}-${item.subject}`}
                        className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                      >
                        {item.subject}: {item.percentage}%
                      </span>
                    ))}
                  </div>
                )}
                {attempt.weakTopics?.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {attempt.weakTopics.map((topic) => (
                      <span
                        key={`${attempt.id}-${topic}`}
                        className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700 dark:bg-amber-500/10 dark:text-amber-300"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-slate-200 p-6 text-center dark:border-slate-700">
            <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
              No saved practice attempts yet.
            </p>
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
              Start a subject drill, past paper set, or full mock exam and saved attempts will appear here automatically.
            </p>
          </div>
        )}
      </Card>
    </div>
  )
}
