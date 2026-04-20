import { useEffect, useMemo, useState } from "react"
import ArticleForm from "./components/ArticleForm"
import CourseForm from "./components/CourseForm"
import PracticeImportPanel from "./components/PracticeImportPanel"
import PracticeQuestionForm from "./components/PracticeQuestionForm"
import StatCard from "./components/StatCard"
import { apiDownload, apiRequest, resolveAssetUrl } from "./utils/api"

const TOKEN_KEY = "scg-admin-token"
const USER_KEY = "scg-admin-user"

const tabs = [
  { id: "overview", label: "Overview" },
  { id: "courses", label: "Courses" },
  { id: "articles", label: "Articles" },
  { id: "practice", label: "Practice Bank" }
]

function splitList(value) {
  return String(value || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)
}

function splitLines(value) {
  return String(value || "")
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean)
}

function createEmptyCourseForm() {
  return {
    title: "",
    institutionType: "University",
    category: "",
    summary: "",
    overview: "",
    cutoffMark: "180",
    requiredSubjects: "",
    jambCombination: "",
    careers: "",
    sideSkills: "",
    tags: "",
    strengths: "",
    interests: "",
    workStyles: "",
    goals: "",
    studyPreferences: ""
  }
}

function createEmptyArticleForm() {
  return {
    title: "",
    category: "Financial discipline",
    summary: "",
    content: "",
    readTimeMinutes: "5",
    imageUrl: "",
    featured: false
  }
}

function createEmptyPracticeForm() {
  return {
    examType: "JAMB",
    subject: "Use of English",
    topic: "",
    year: "2024",
    prompt: "",
    optionA: "",
    optionB: "",
    optionC: "",
    optionD: "",
    correctOption: "0",
    explanation: ""
  }
}

function createEmptyImportForm() {
  return {
    format: "json",
    content: "",
    fileName: ""
  }
}

function detectImportFormat(fileName = "", mimeType = "") {
  const normalizedName = String(fileName).trim().toLowerCase()
  const normalizedMime = String(mimeType).trim().toLowerCase()

  if (normalizedName.endsWith(".csv") || normalizedMime.includes("csv")) {
    return "csv"
  }

  if (normalizedName.endsWith(".json") || normalizedMime.includes("json")) {
    return "json"
  }

  return null
}

function serializeCourse(course) {
  return {
    title: course.title || "",
    institutionType: course.institutionType || "University",
    category: course.category || "",
    summary: course.summary || "",
    overview: course.overview || "",
    cutoffMark: String(course.cutoffMark || 180),
    requiredSubjects: (course.requiredSubjects || []).join(", "),
    jambCombination: (course.jambCombination || []).join(", "),
    careers: (course.careers || []).join(", "),
    sideSkills: (course.sideSkills || []).join(", "),
    tags: (course.tags || []).join(", "),
    strengths: (course.recommendationSignals?.strengths || []).join(", "),
    interests: (course.recommendationSignals?.interests || []).join(", "),
    workStyles: (course.recommendationSignals?.workStyles || []).join(", "),
    goals: (course.recommendationSignals?.goals || []).join(", "),
    studyPreferences: (course.recommendationSignals?.studyPreferences || []).join(", ")
  }
}

function serializeArticle(article) {
  return {
    title: article.title || "",
    category: article.category || "Financial discipline",
    summary: article.summary || "",
    content: (article.content || []).join("\n"),
    readTimeMinutes: String(article.readTimeMinutes || 5),
    imageUrl: article.imageUrl || "",
    featured: Boolean(article.featured)
  }
}

function serializePracticeQuestion(question) {
  return {
    examType: question.examType || "JAMB",
    subject: question.subject || "",
    topic: question.topic || "",
    year: String(question.year || "2024"),
    prompt: question.prompt || "",
    optionA: question.options?.[0] || "",
    optionB: question.options?.[1] || "",
    optionC: question.options?.[2] || "",
    optionD: question.options?.[3] || "",
    correctOption: String(question.correctOption ?? 0),
    explanation: question.explanation || ""
  }
}

function mapCoursePayload(form) {
  return {
    title: form.title,
    institutionType: form.institutionType,
    category: form.category,
    summary: form.summary,
    overview: form.overview,
    cutoffMark: Number(form.cutoffMark),
    requiredSubjects: splitList(form.requiredSubjects),
    jambCombination: splitList(form.jambCombination),
    careers: splitList(form.careers),
    sideSkills: splitList(form.sideSkills),
    tags: splitList(form.tags),
    recommendationSignals: {
      strengths: splitList(form.strengths),
      interests: splitList(form.interests),
      workStyles: splitList(form.workStyles),
      goals: splitList(form.goals),
      studyPreferences: splitList(form.studyPreferences)
    }
  }
}

function mapArticlePayload(form) {
  return {
    title: form.title,
    category: form.category,
    summary: form.summary,
    content: splitLines(form.content),
    readTimeMinutes: Number(form.readTimeMinutes),
    imageUrl: form.imageUrl,
    featured: Boolean(form.featured)
  }
}

function mapPracticePayload(form) {
  return {
    examType: form.examType,
    subject: form.subject,
    topic: form.topic,
    year: String(form.year),
    prompt: form.prompt,
    options: [form.optionA, form.optionB, form.optionC, form.optionD],
    correctOption: Number(form.correctOption),
    explanation: form.explanation
  }
}

function getQuestionPreview(prompt) {
  const normalized = String(prompt || "").trim()

  if (normalized.length <= 180) {
    return normalized
  }

  return `${normalized.slice(0, 177)}...`
}

function buildJsonImportSample() {
  return JSON.stringify(
    [
      {
        examType: "JAMB",
        subject: "Use of English",
        topic: "Grammar",
        year: "2025",
        prompt: "Choose the option that best completes the sentence: The principal was pleased ____ the students.",
        options: ["with", "for", "at", "into"],
        correctOption: "A",
        explanation: "The usual collocation is pleased with."
      },
      {
        examType: "WAEC",
        subject: "Mathematics",
        topic: "Algebra",
        year: "2025",
        prompt: "If 2x + 5 = 17, what is the value of x?",
        options: ["4", "5", "6", "7"],
        correctOption: 2,
        explanation: "2x = 12, so x = 6."
      }
    ],
    null,
    2
  )
}

function buildCsvImportSample() {
  return [
    "examType,subject,topic,year,prompt,optionA,optionB,optionC,optionD,correctOption,explanation",
    "\"JAMB\",\"Use of English\",\"Grammar\",\"2025\",\"Choose the option that best completes the sentence: The principal was pleased ____ the students.\",\"with\",\"for\",\"at\",\"into\",\"A\",\"The usual collocation is pleased with.\"",
    "\"WAEC\",\"Mathematics\",\"Algebra\",\"2025\",\"If 2x + 5 = 17, what is the value of x?\",\"4\",\"5\",\"6\",\"7\",\"3\",\"2x = 12, so x = 6.\""
  ].join("\n")
}

function getCorrectOptionLabel(correctOption) {
  const normalized = String(correctOption ?? "").trim().toUpperCase()

  if (/^[A-D]$/.test(normalized)) {
    return normalized
  }

  const numericIndex = Number.parseInt(normalized || "0", 10)
  const safeIndex = Number.isFinite(numericIndex) ? numericIndex : 0
  return String.fromCharCode(65 + Math.min(3, Math.max(0, safeIndex)))
}

function downloadBlobFile(blob, filename) {
  const downloadUrl = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = downloadUrl
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(downloadUrl)
}

export default function App() {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY))
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(USER_KEY) || "null")
    } catch {
      return null
    }
  })
  const [activeTab, setActiveTab] = useState("overview")
  const [overview, setOverview] = useState(null)
  const [courses, setCourses] = useState([])
  const [articles, setArticles] = useState([])
  const [practiceQuestions, setPracticeQuestions] = useState([])
  const [courseForm, setCourseForm] = useState(createEmptyCourseForm)
  const [articleForm, setArticleForm] = useState(createEmptyArticleForm)
  const [practiceForm, setPracticeForm] = useState(createEmptyPracticeForm)
  const [importForm, setImportForm] = useState(createEmptyImportForm)
  const [editingCourseId, setEditingCourseId] = useState("")
  const [editingArticleId, setEditingArticleId] = useState("")
  const [editingPracticeId, setEditingPracticeId] = useState("")
  const [practiceFilters, setPracticeFilters] = useState({
    examType: "all",
    year: "all",
    query: ""
  })
  const [bootLoading, setBootLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [courseSubmitting, setCourseSubmitting] = useState(false)
  const [articleSubmitting, setArticleSubmitting] = useState(false)
  const [practiceSubmitting, setPracticeSubmitting] = useState(false)
  const [importSubmitting, setImportSubmitting] = useState(false)
  const [importFileLoading, setImportFileLoading] = useState(false)
  const [exportingFormat, setExportingFormat] = useState("")
  const [uploadingImage, setUploadingImage] = useState(false)
  const [authForm, setAuthForm] = useState({
    email: "admin@studentguide.ng",
    password: "Admin@12345"
  })
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [importResult, setImportResult] = useState(null)

  const mostSelectedCourses = useMemo(() => overview?.mostSelectedCourses || [], [overview])
  const practiceCatalog = useMemo(() => overview?.practiceCatalog || [], [overview])
  const practiceYears = useMemo(
    () =>
      Array.from(new Set(practiceQuestions.map((question) => String(question.year || ""))))
        .filter(Boolean)
        .sort((left, right) => right.localeCompare(left)),
    [practiceQuestions]
  )
  const filteredPracticeQuestions = useMemo(() => {
    const query = practiceFilters.query.trim().toLowerCase()

    return practiceQuestions.filter((question) => {
      if (practiceFilters.examType !== "all" && question.examType !== practiceFilters.examType) {
        return false
      }

      if (practiceFilters.year !== "all" && String(question.year) !== practiceFilters.year) {
        return false
      }

      if (!query) {
        return true
      }

      const haystack = [question.examType, question.subject, question.topic, question.year, question.prompt]
        .join(" ")
        .toLowerCase()

      return haystack.includes(query)
    })
  }, [practiceFilters, practiceQuestions])

  useEffect(() => {
    let isMounted = true

    async function bootstrap() {
      if (!token) {
        setBootLoading(false)
        return
      }

      try {
        const response = await apiRequest("/auth/me", { token })

        if (!response?.user || response.user.role !== "admin") {
          throw new Error("Admin access is required.")
        }

        if (!isMounted) {
          return
        }

        setUser(response.user)
        await loadAdminData(token, isMounted)
      } catch (requestError) {
        if (isMounted) {
          clearSession()
          setError(requestError.message || "Admin session could not be restored.")
          setBootLoading(false)
        }
      }
    }

    bootstrap()

    return () => {
      isMounted = false
    }
  }, [])

  async function loadAdminData(activeToken = token, isMounted = true) {
    setIsRefreshing(true)

    try {
      const [overviewResponse, coursesResponse, articlesResponse, practiceResponse] = await Promise.all([
        apiRequest("/admin/overview", { token: activeToken }),
        apiRequest("/admin/courses", { token: activeToken }),
        apiRequest("/admin/articles", { token: activeToken }),
        apiRequest("/admin/practice-questions", { token: activeToken })
      ])

      if (!isMounted) {
        return
      }

      setOverview(overviewResponse)
      setCourses(coursesResponse?.items || [])
      setArticles(articlesResponse?.items || [])
      setPracticeQuestions(practiceResponse?.items || [])
      setError("")
    } catch (requestError) {
      if (isMounted) {
        setError(requestError.message || "Unable to load admin data.")
      }
    } finally {
      if (isMounted) {
        setIsRefreshing(false)
        setBootLoading(false)
      }
    }
  }

  function persistSession(nextToken, nextUser) {
    setToken(nextToken)
    setUser(nextUser)

    if (nextToken) {
      localStorage.setItem(TOKEN_KEY, nextToken)
    } else {
      localStorage.removeItem(TOKEN_KEY)
    }

    if (nextUser) {
      localStorage.setItem(USER_KEY, JSON.stringify(nextUser))
    } else {
      localStorage.removeItem(USER_KEY)
    }
  }

  function clearSession() {
    persistSession(null, null)
  }

  async function handleLogin(event) {
    event.preventDefault()
    setError("")
    setSuccess("")
    setBootLoading(true)

    try {
      const response = await apiRequest("/auth/login", {
        method: "POST",
        body: JSON.stringify(authForm)
      })

      if (response?.user?.role !== "admin") {
        throw new Error("This account is not an admin account.")
      }

      persistSession(response.token, response.user)
      await loadAdminData(response.token)
      setSuccess("Admin session is active.")
    } catch (requestError) {
      setError(requestError.message || "Unable to sign in.")
      setBootLoading(false)
    }
  }

  function handleLogout() {
    clearSession()
    setOverview(null)
    setCourses([])
    setArticles([])
    setPracticeQuestions([])
    setCourseForm(createEmptyCourseForm())
    setArticleForm(createEmptyArticleForm())
    setPracticeForm(createEmptyPracticeForm())
    setImportForm(createEmptyImportForm())
    setImportFileLoading(false)
    setExportingFormat("")
    setImportResult(null)
    setEditingCourseId("")
    setEditingArticleId("")
    setEditingPracticeId("")
    setSuccess("")
    setError("")
  }

  async function handleCourseSubmit(event) {
    event.preventDefault()
    setCourseSubmitting(true)
    setError("")
    setSuccess("")

    try {
      const payload = mapCoursePayload(courseForm)
      const path = editingCourseId ? `/admin/courses/${editingCourseId}` : "/admin/courses"
      const method = editingCourseId ? "PUT" : "POST"

      await apiRequest(path, {
        method,
        token,
        body: JSON.stringify(payload)
      })

      setCourseForm(createEmptyCourseForm())
      setEditingCourseId("")
      setSuccess(editingCourseId ? "Course updated." : "Course created.")
      await loadAdminData()
    } catch (requestError) {
      setError(requestError.message || "Unable to save course.")
    } finally {
      setCourseSubmitting(false)
    }
  }

  async function handleArticleSubmit(event) {
    event.preventDefault()
    setArticleSubmitting(true)
    setError("")
    setSuccess("")

    try {
      const payload = mapArticlePayload(articleForm)
      const path = editingArticleId ? `/admin/articles/${editingArticleId}` : "/admin/articles"
      const method = editingArticleId ? "PUT" : "POST"

      await apiRequest(path, {
        method,
        token,
        body: JSON.stringify(payload)
      })

      setArticleForm(createEmptyArticleForm())
      setEditingArticleId("")
      setSuccess(editingArticleId ? "Article updated." : "Article created.")
      await loadAdminData()
    } catch (requestError) {
      setError(requestError.message || "Unable to save article.")
    } finally {
      setArticleSubmitting(false)
    }
  }

  async function handlePracticeSubmit(event) {
    event.preventDefault()
    setPracticeSubmitting(true)
    setError("")
    setSuccess("")

    try {
      const payload = mapPracticePayload(practiceForm)
      const path = editingPracticeId
        ? `/admin/practice-questions/${editingPracticeId}`
        : "/admin/practice-questions"
      const method = editingPracticeId ? "PUT" : "POST"

      await apiRequest(path, {
        method,
        token,
        body: JSON.stringify(payload)
      })

      setPracticeForm(createEmptyPracticeForm())
      setEditingPracticeId("")
      setSuccess(editingPracticeId ? "Practice question updated." : "Practice question created.")
      await loadAdminData()
    } catch (requestError) {
      setError(requestError.message || "Unable to save practice question.")
    } finally {
      setPracticeSubmitting(false)
    }
  }

  async function handlePracticeImport(event) {
    event.preventDefault()
    setImportSubmitting(true)
    setError("")
    setSuccess("")
    setImportResult(null)

    try {
      const response = await apiRequest("/admin/practice-questions/import", {
        method: "POST",
        token,
        body: JSON.stringify(importForm)
      })

      setImportResult(response)
      setSuccess(
        `Import complete: ${response.createdCount} created, ${response.skippedCount} skipped, ${response.errorCount} errors.`
      )
      await loadAdminData()
    } catch (requestError) {
      setError(requestError.message || "Unable to import practice questions.")
    } finally {
      setImportSubmitting(false)
    }
  }

  async function handleImportFileSelect(file) {
    if (!file) {
      return
    }

    setImportFileLoading(true)
    setError("")
    setSuccess("")
    setImportResult(null)

    try {
      const format = detectImportFormat(file.name, file.type)

      if (!format) {
        throw new Error("Only .json and .csv files are supported for practice imports.")
      }

      const content = await file.text()

      setImportForm({
        format,
        content,
        fileName: file.name
      })
      setSuccess(`${file.name} loaded. Review the content, then import the questions.`)
    } catch (requestError) {
      setError(requestError.message || "Unable to read the selected file.")
    } finally {
      setImportFileLoading(false)
    }
  }

  async function handleDeleteCourse(courseId) {
    setError("")
    setSuccess("")

    try {
      await apiRequest(`/admin/courses/${courseId}`, {
        method: "DELETE",
        token
      })

      if (editingCourseId === courseId) {
        setEditingCourseId("")
        setCourseForm(createEmptyCourseForm())
      }

      setSuccess("Course deleted.")
      await loadAdminData()
    } catch (requestError) {
      setError(requestError.message || "Unable to delete course.")
    }
  }

  async function handleDeleteArticle(articleId) {
    setError("")
    setSuccess("")

    try {
      await apiRequest(`/admin/articles/${articleId}`, {
        method: "DELETE",
        token
      })

      if (editingArticleId === articleId) {
        setEditingArticleId("")
        setArticleForm(createEmptyArticleForm())
      }

      setSuccess("Article deleted.")
      await loadAdminData()
    } catch (requestError) {
      setError(requestError.message || "Unable to delete article.")
    }
  }

  async function handleDeletePracticeQuestion(questionId) {
    setError("")
    setSuccess("")

    try {
      await apiRequest(`/admin/practice-questions/${questionId}`, {
        method: "DELETE",
        token
      })

      if (editingPracticeId === questionId) {
        setEditingPracticeId("")
        setPracticeForm(createEmptyPracticeForm())
      }

      setSuccess("Practice question deleted.")
      await loadAdminData()
    } catch (requestError) {
      setError(requestError.message || "Unable to delete practice question.")
    }
  }

  async function handleImageUpload(file) {
    setUploadingImage(true)
    setError("")

    try {
      const formData = new FormData()
      formData.append("image", file)
      const response = await apiRequest("/admin/uploads/image", {
        method: "POST",
        token,
        body: formData
      })

      setArticleForm((current) => ({
        ...current,
        imageUrl: response?.imageUrl || current.imageUrl
      }))

      setSuccess("Image uploaded.")
    } catch (requestError) {
      setError(requestError.message || "Image upload failed.")
    } finally {
      setUploadingImage(false)
    }
  }

  function handleLoadImportSample(format) {
    setImportForm({
      format,
      content: format === "csv" ? buildCsvImportSample() : buildJsonImportSample(),
      fileName: ""
    })
    setImportResult(null)
    setSuccess("")
    setError("")
  }

  async function handlePracticeExport(format) {
    if (filteredPracticeQuestions.length === 0) {
      setError("There are no practice questions in the current filter to export.")
      setSuccess("")
      return
    }

    setExportingFormat(format)
    setError("")
    setSuccess("")

    try {
      const searchParams = new URLSearchParams({ format })

      if (practiceFilters.examType !== "all") {
        searchParams.set("examType", practiceFilters.examType)
      }

      if (practiceFilters.year !== "all") {
        searchParams.set("year", practiceFilters.year)
      }

      if (practiceFilters.query.trim()) {
        searchParams.set("query", practiceFilters.query.trim())
      }

      const { blob, filename } = await apiDownload(`/admin/practice-questions/export?${searchParams.toString()}`, {
        token
      })

      downloadBlobFile(blob, filename || `practice-bank.${format}`)
      setSuccess(`${filteredPracticeQuestions.length} practice questions exported as ${format.toUpperCase()}.`)
    } catch (requestError) {
      setError(requestError.message || "Unable to export practice questions.")
    } finally {
      setExportingFormat("")
    }
  }

  if (!token || !user) {
    return (
      <div className="admin-shell login-shell">
        <div className="login-panel">
          <div className="eyebrow">Admin panel</div>
          <h1>Student Career Guide Admin</h1>
          <p>
            Manage courses, survival guide articles, CBT practice questions, uploaded images, cut-off marks, and platform overview stats from one place.
          </p>

          <form className="login-form" onSubmit={handleLogin}>
            <label className="field">
              <span>Email</span>
              <input
                type="email"
                value={authForm.email}
                onChange={(event) => setAuthForm((current) => ({ ...current, email: event.target.value }))}
                required
              />
            </label>

            <label className="field">
              <span>Password</span>
              <input
                type="password"
                value={authForm.password}
                onChange={(event) => setAuthForm((current) => ({ ...current, password: event.target.value }))}
                required
              />
            </label>

            {error ? <div className="status error">{error}</div> : null}

            <button type="submit" className="primary-button" disabled={bootLoading}>
              {bootLoading ? "Signing in..." : "Open admin dashboard"}
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="admin-shell">
      <header className="topbar">
        <div>
          <div className="eyebrow">Admin workspace</div>
          <h1>Student Career Guide</h1>
          <p>Signed in as {user.name}</p>
        </div>

        <div className="topbar-actions">
          <button type="button" className="ghost-button" onClick={() => loadAdminData()}>
            {isRefreshing ? "Refreshing..." : "Refresh data"}
          </button>
          <button type="button" className="ghost-button" onClick={handleLogout}>
            Sign out
          </button>
        </div>
      </header>

      {error ? <div className="status error">{error}</div> : null}
      {success ? <div className="status success">{success}</div> : null}

      <nav className="tab-row">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={`tab-button ${activeTab === tab.id ? "active" : ""}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {activeTab === "overview" ? (
        <>
          <div className="overview-grid">
            <StatCard label="Total users" value={overview?.totalUsers || 0} note="Registered students and admins" />
            <StatCard label="Total courses" value={overview?.totalCourses || 0} note="Seeded and admin-created courses" />
            <StatCard label="Guide articles" value={overview?.totalArticles || 0} note="Survival guide content in the backend" />
            <StatCard label="Practice questions" value={overview?.totalPracticeQuestions || 0} note="CBT bank items across JAMB and WAEC" />
            <StatCard label="Practice attempts" value={overview?.totalPracticeAttempts || 0} note="Saved drills, past papers, and mock sessions" />
          </div>

          <div className="management-grid">
            <div className="admin-card chart-card">
              <div className="form-header">
                <div>
                  <div className="eyebrow">Analytics</div>
                  <h2>Most selected courses</h2>
                </div>
              </div>

              {mostSelectedCourses.length > 0 ? (
                <div className="rank-list">
                  {mostSelectedCourses.map((item, index) => (
                    <div key={item.courseId} className="rank-item">
                      <div>
                        <div className="rank-index">#{index + 1}</div>
                        <div className="rank-title">{item.courseTitle}</div>
                      </div>
                      <div className="rank-value">{item.saves} saves</div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="empty-copy">No course saves yet. Student activity will appear here once recommendations are saved.</p>
              )}
            </div>

            <div className="admin-card chart-card">
              <div className="form-header">
                <div>
                  <div className="eyebrow">Practice bank</div>
                  <h2>Exam coverage snapshot</h2>
                </div>
              </div>

              {practiceCatalog.length > 0 ? (
                <div className="rank-list">
                  {practiceCatalog.map((item) => (
                    <div key={item.examType} className="rank-item">
                      <div>
                        <div className="rank-index">{item.examType}</div>
                        <div className="rank-title">{item.totalQuestions} questions</div>
                      </div>
                      <div className="rank-value">
                        {item.subjects.length} subjects / {item.years.length} years
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="empty-copy">Practice bank coverage will appear here after the question catalog loads.</p>
              )}
            </div>
          </div>
        </>
      ) : null}

      {activeTab === "courses" ? (
        <div className="management-grid">
          <CourseForm
            form={courseForm}
            onChange={(field, value) => setCourseForm((current) => ({ ...current, [field]: value }))}
            onSubmit={handleCourseSubmit}
            onCancel={() => {
              setCourseForm(createEmptyCourseForm())
              setEditingCourseId("")
            }}
            editing={Boolean(editingCourseId)}
            submitting={courseSubmitting}
          />

          <div className="admin-card list-card">
            <div className="form-header">
              <div>
                <div className="eyebrow">Catalog</div>
                <h2>Course list</h2>
              </div>
            </div>

            <div className="item-list">
              {courses.map((course) => (
                <div key={course.id} className="list-item">
                  <div>
                    <div className="item-title">{course.title}</div>
                    <div className="item-meta">
                      {course.institutionType} / {course.category} / Cut-off {course.cutoffMark}
                    </div>
                  </div>

                  <div className="list-actions">
                    <button
                      type="button"
                      className="ghost-button"
                      onClick={() => {
                        setCourseForm(serializeCourse(course))
                        setEditingCourseId(course.id)
                        setActiveTab("courses")
                        setSuccess("")
                        setError("")
                      }}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="danger-button"
                      onClick={() => handleDeleteCourse(course.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}

      {activeTab === "articles" ? (
        <div className="management-grid">
          <ArticleForm
            form={articleForm}
            onChange={(field, value) => setArticleForm((current) => ({ ...current, [field]: value }))}
            onSubmit={handleArticleSubmit}
            onCancel={() => {
              setArticleForm(createEmptyArticleForm())
              setEditingArticleId("")
            }}
            onImageUpload={handleImageUpload}
            editing={Boolean(editingArticleId)}
            submitting={articleSubmitting}
            uploadInProgress={uploadingImage}
          />

          <div className="admin-card list-card">
            <div className="form-header">
              <div>
                <div className="eyebrow">Guide library</div>
                <h2>Article list</h2>
              </div>
            </div>

            <div className="item-list">
              {articles.map((article) => (
                <div key={article.id} className="list-item article-item">
                  <div className="article-preview">
                    {article.imageUrl ? (
                      <img src={resolveAssetUrl(article.imageUrl)} alt={article.title} />
                    ) : (
                      <div className="article-fallback">No image</div>
                    )}
                  </div>

                  <div className="article-copy">
                    <div className="item-title">{article.title}</div>
                    <div className="item-meta">
                      {article.category} / {article.readTimeMinutes} min / {article.featured ? "Featured" : "Standard"}
                    </div>
                    <p>{article.summary}</p>
                  </div>

                  <div className="list-actions">
                    <button
                      type="button"
                      className="ghost-button"
                      onClick={() => {
                        setArticleForm(serializeArticle(article))
                        setEditingArticleId(article.id)
                        setActiveTab("articles")
                        setSuccess("")
                        setError("")
                      }}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="danger-button"
                      onClick={() => handleDeleteArticle(article.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}

      {activeTab === "practice" ? (
        <div className="management-grid">
          <div className="stack-column">
            <PracticeQuestionForm
              form={practiceForm}
              onChange={(field, value) => setPracticeForm((current) => ({ ...current, [field]: value }))}
              onSubmit={handlePracticeSubmit}
              onCancel={() => {
                setPracticeForm(createEmptyPracticeForm())
                setEditingPracticeId("")
              }}
              editing={Boolean(editingPracticeId)}
              submitting={practiceSubmitting}
            />

            <PracticeImportPanel
              form={importForm}
              onChange={(field, value) => setImportForm((current) => ({ ...current, [field]: value }))}
              onSubmit={handlePracticeImport}
              onLoadSample={handleLoadImportSample}
              onFileSelect={handleImportFileSelect}
              importing={importSubmitting}
              fileLoading={importFileLoading}
              result={importResult}
            />
          </div>

          <div className="admin-card list-card">
            <div className="form-header">
              <div>
                <div className="eyebrow">CBT question bank</div>
                <h2>Practice question list</h2>
              </div>

              <div className="button-row">
                <button
                  type="button"
                  className="ghost-button"
                  onClick={() => handlePracticeExport("json")}
                  disabled={Boolean(exportingFormat)}
                >
                  {exportingFormat === "json" ? "Exporting JSON..." : "Export JSON"}
                </button>
                <button
                  type="button"
                  className="ghost-button"
                  onClick={() => handlePracticeExport("csv")}
                  disabled={Boolean(exportingFormat)}
                >
                  {exportingFormat === "csv" ? "Exporting CSV..." : "Export CSV"}
                </button>
              </div>
            </div>

            <div className="grid two-col">
              <label className="field">
                <span>Exam filter</span>
                <select
                  value={practiceFilters.examType}
                  onChange={(event) =>
                    setPracticeFilters((current) => ({
                      ...current,
                      examType: event.target.value
                    }))
                  }
                >
                  <option value="all">All exams</option>
                  <option value="JAMB">JAMB</option>
                  <option value="WAEC">WAEC</option>
                </select>
              </label>

              <label className="field">
                <span>Year filter</span>
                <select
                  value={practiceFilters.year}
                  onChange={(event) =>
                    setPracticeFilters((current) => ({
                      ...current,
                      year: event.target.value
                    }))
                  }
                >
                  <option value="all">All years</option>
                  {practiceYears.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <label className="field">
              <span>Search prompt, subject, or topic</span>
              <input
                value={practiceFilters.query}
                onChange={(event) =>
                  setPracticeFilters((current) => ({
                    ...current,
                    query: event.target.value
                  }))
                }
                placeholder="Search CBT questions..."
              />
            </label>

            <p className="helper-copy">
              Showing {filteredPracticeQuestions.length} of {practiceQuestions.length} questions. Exports follow the current filters.
            </p>

            <div className="item-list">
              {filteredPracticeQuestions.map((question) => (
                <div key={question.id} className="list-item">
                  <div>
                    <div className="item-title">
                      {question.examType} / {question.subject} / {question.topic}
                    </div>
                    <div className="item-meta">
                      Year {question.year} / Correct option {getCorrectOptionLabel(question.correctOption)}
                    </div>
                    <p className="item-snippet">{getQuestionPreview(question.prompt)}</p>
                  </div>

                  <div className="list-actions">
                    <button
                      type="button"
                      className="ghost-button"
                      onClick={() => {
                        setPracticeForm(serializePracticeQuestion(question))
                        setEditingPracticeId(question.id)
                        setActiveTab("practice")
                        setSuccess("")
                        setError("")
                      }}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="danger-button"
                      onClick={() => handleDeletePracticeQuestion(question.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
