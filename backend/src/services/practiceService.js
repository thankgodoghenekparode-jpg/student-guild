const { createHttpError } = require("../utils/errors")
const { sanitizeInteger, sanitizeText } = require("../utils/sanitize")

function sanitizeQuestionForClient(question) {
  return {
    id: question.id,
    examType: question.examType,
    subject: question.subject,
    topic: question.topic,
    year: question.year,
    prompt: question.prompt,
    options: question.options
  }
}

function gradePracticeSubmission(questionBank, payload = {}) {
  const sessionType = sanitizeText(payload.sessionType || "drill", { maxLength: 20, allowNewLines: false })
  const examType = sanitizeText(payload.examType, { maxLength: 20, allowNewLines: false })
  const title = sanitizeText(payload.title || "", { maxLength: 120 })
  const subject = sanitizeText(payload.subject, { maxLength: 60, allowNewLines: false })
  const durationSeconds = sanitizeInteger(payload.durationSeconds, { min: 0, max: 60 * 60 * 4, fallback: 0 })
  const answersMap = payload.answers && typeof payload.answers === "object" ? payload.answers : null

  if (!questionBank.length) {
    throw createHttpError(400, "No practice questions were supplied for grading.")
  }

  if (!answersMap) {
    throw createHttpError(400, "Practice answers are required.")
  }

  let correctAnswers = 0
  const subjectStats = new Map()
  const topicStats = new Map()

  const review = questionBank.map((question) => {
    const selectedOption = Number.parseInt(answersMap[question.id], 10)
    const isCorrect = Number.isInteger(selectedOption) && selectedOption === question.correctOption

    if (isCorrect) {
      correctAnswers += 1
    }

    const subjectEntry = subjectStats.get(question.subject) || {
      subject: question.subject,
      totalQuestions: 0,
      correctAnswers: 0
    }
    subjectEntry.totalQuestions += 1
    if (isCorrect) {
      subjectEntry.correctAnswers += 1
    }
    subjectStats.set(question.subject, subjectEntry)

    const topicKey = `${question.subject}::${question.topic}`
    const topicEntry = topicStats.get(topicKey) || {
      subject: question.subject,
      topic: question.topic,
      totalQuestions: 0,
      correctAnswers: 0
    }
    topicEntry.totalQuestions += 1
    if (isCorrect) {
      topicEntry.correctAnswers += 1
    }
    topicStats.set(topicKey, topicEntry)

    return {
      questionId: question.id,
      subject: question.subject,
      topic: question.topic,
      year: question.year,
      prompt: question.prompt,
      options: question.options,
      selectedOption: Number.isInteger(selectedOption) ? selectedOption : null,
      correctOption: question.correctOption,
      correctAnswer: question.options[question.correctOption],
      isCorrect,
      explanation: question.explanation
    }
  })

  const totalQuestions = questionBank.length
  const percentage = Math.round((correctAnswers / totalQuestions) * 100)
  const subjectBreakdown = Array.from(subjectStats.values())
    .map((item) => ({
      ...item,
      percentage: item.totalQuestions ? Math.round((item.correctAnswers / item.totalQuestions) * 100) : 0
    }))
    .sort((left, right) => left.subject.localeCompare(right.subject))

  const topicBreakdown = Array.from(topicStats.values())
    .map((item) => ({
      ...item,
      percentage: item.totalQuestions ? Math.round((item.correctAnswers / item.totalQuestions) * 100) : 0
    }))
    .sort((left, right) => left.percentage - right.percentage || left.topic.localeCompare(right.topic))

  const weakTopics = topicBreakdown
    .filter((item) => item.correctAnswers < item.totalQuestions)
    .slice(0, 5)
    .map((item) => item.topic)

  return {
    sessionType,
    examType,
    title: title || buildDefaultTitle(sessionType, examType, subjectBreakdown),
    subject,
    subjects: subjectBreakdown.map((item) => item.subject),
    totalQuestions,
    correctAnswers,
    wrongAnswers: totalQuestions - correctAnswers,
    percentage,
    durationSeconds,
    weakTopics,
    subjectBreakdown,
    topicBreakdown,
    review,
    feedback: buildFeedback(percentage, sessionType)
  }
}

function getPracticeAnalytics(attempts = []) {
  if (!attempts.length) {
    return {
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
  }

  const totalAttempts = attempts.length
  const drills = attempts.filter((attempt) => attempt.sessionType === "drill")
  const pastPapers = attempts.filter((attempt) => attempt.sessionType === "past-paper")
  const mocks = attempts.filter((attempt) => attempt.sessionType === "mock")
  const averageScore = Math.round(
    attempts.reduce((total, attempt) => total + Number(attempt.percentage || 0), 0) / totalAttempts
  )
  const averageMockScore = mocks.length
    ? Math.round(mocks.reduce((total, attempt) => total + Number(attempt.percentage || 0), 0) / mocks.length)
    : 0

  const recentScores = [...attempts]
    .slice(0, 8)
    .reverse()
    .map((attempt) => ({
      id: attempt.id,
      createdAt: attempt.createdAt,
      percentage: attempt.percentage,
      sessionType: attempt.sessionType || "drill",
      title: attempt.title || attempt.subject || attempt.examType
    }))

  return {
    totalAttempts,
    totalDrills: drills.length,
    totalPastPapers: pastPapers.length,
    totalMocks: mocks.length,
    averageScore,
    averageMockScore,
    recentScores,
    examPerformance: aggregateExamPerformance(attempts),
    subjectPerformance: aggregateSubjectPerformance(attempts),
    topicTrend: aggregateTopicTrend(attempts)
  }
}

function getPracticeStreakSummary(attempts = []) {
  const uniqueDates = Array.from(
    new Set(
      attempts
        .map((attempt) => normalizeDateKey(attempt.createdAt))
        .filter(Boolean)
    )
  ).sort((left, right) => left.localeCompare(right))

  if (uniqueDates.length === 0) {
    return {
      currentStreak: 0,
      longestStreak: 0,
      activeDays: 0,
      lastPracticeDate: null
    }
  }

  return {
    currentStreak: calculateCurrentStreak(uniqueDates),
    longestStreak: calculateLongestStreak(uniqueDates),
    activeDays: uniqueDates.length,
    lastPracticeDate: uniqueDates[uniqueDates.length - 1]
  }
}

function getPracticeLeaderboard(attempts = [], users = [], currentUserId = "") {
  const userMap = new Map(users.map((user) => [user.id, user]))
  const entryMap = new Map()

  for (const attempt of attempts) {
    if (!attempt.userId || !userMap.has(attempt.userId)) {
      continue
    }

    const user = userMap.get(attempt.userId)
    const entry = entryMap.get(attempt.userId) || {
      userId: attempt.userId,
      name: user.name || "Student",
      attempts: [],
      totalAttempts: 0,
      totalScore: 0,
      totalMocks: 0,
      totalPastPapers: 0,
      points: 0,
      bestScore: 0
    }

    entry.attempts.push(attempt)
    entry.totalAttempts += 1
    entry.totalScore += Number(attempt.percentage || 0)
    entry.points += calculateLeaderboardPoints(attempt)
    entry.bestScore = Math.max(entry.bestScore, Number(attempt.percentage || 0))

    if (attempt.sessionType === "mock") {
      entry.totalMocks += 1
    }

    if (attempt.sessionType === "past-paper") {
      entry.totalPastPapers += 1
    }

    entryMap.set(attempt.userId, entry)
  }

  const rankedEntries = Array.from(entryMap.values())
    .map((entry) => {
      const streakSummary = getPracticeStreakSummary(entry.attempts)

      return {
        userId: entry.userId,
        name: entry.name,
        points: entry.points,
        totalAttempts: entry.totalAttempts,
        averageScore: Math.round(entry.totalScore / entry.totalAttempts),
        bestScore: entry.bestScore,
        totalMocks: entry.totalMocks,
        totalPastPapers: entry.totalPastPapers,
        currentStreak: streakSummary.currentStreak
      }
    })
    .sort(
      (left, right) =>
        right.points - left.points ||
        right.averageScore - left.averageScore ||
        right.totalAttempts - left.totalAttempts ||
        left.name.localeCompare(right.name)
    )
    .map((entry, index) => ({
      rank: index + 1,
      ...entry,
      isCurrentUser: entry.userId === currentUserId
    }))

  const currentUser = rankedEntries.find((entry) => entry.userId === currentUserId) || null

  return {
    totalParticipants: rankedEntries.length,
    leaders: rankedEntries.slice(0, 10),
    currentUser
  }
}

function aggregateExamPerformance(attempts) {
  const map = new Map()

  for (const attempt of attempts) {
    const entry = map.get(attempt.examType) || {
      examType: attempt.examType,
      attempts: 0,
      totalScore: 0,
      bestScore: 0
    }

    entry.attempts += 1
    entry.totalScore += Number(attempt.percentage || 0)
    entry.bestScore = Math.max(entry.bestScore, Number(attempt.percentage || 0))
    map.set(attempt.examType, entry)
  }

  return Array.from(map.values())
    .map((item) => ({
      examType: item.examType,
      attempts: item.attempts,
      averageScore: Math.round(item.totalScore / item.attempts),
      bestScore: item.bestScore
    }))
    .sort((left, right) => left.examType.localeCompare(right.examType))
}

function aggregateSubjectPerformance(attempts) {
  const map = new Map()

  for (const attempt of [...attempts].reverse()) {
    const subjectBreakdown = normalizeSubjectBreakdownFromAttempt(attempt)

    for (const item of subjectBreakdown) {
      const entry = map.get(item.subject) || {
        subject: item.subject,
        attempts: 0,
        totalScore: 0,
        bestScore: 0,
        firstScore: null,
        latestScore: null
      }

      entry.attempts += 1
      entry.totalScore += Number(item.percentage || 0)
      entry.bestScore = Math.max(entry.bestScore, Number(item.percentage || 0))

      if (entry.firstScore === null) {
        entry.firstScore = Number(item.percentage || 0)
      }

      entry.latestScore = Number(item.percentage || 0)
      map.set(item.subject, entry)
    }
  }

  return Array.from(map.values())
    .map((item) => ({
      subject: item.subject,
      attempts: item.attempts,
      averageScore: Math.round(item.totalScore / item.attempts),
      bestScore: item.bestScore,
      latestScore: item.latestScore ?? 0,
      trendDelta: (item.latestScore ?? 0) - (item.firstScore ?? 0)
    }))
    .sort((left, right) => right.averageScore - left.averageScore || left.subject.localeCompare(right.subject))
}

function aggregateTopicTrend(attempts) {
  const map = new Map()

  for (const attempt of attempts) {
    const topicBreakdown = Array.isArray(attempt.topicBreakdown) ? attempt.topicBreakdown : []

    for (const item of topicBreakdown) {
      const key = `${item.subject}::${item.topic}`
      const entry = map.get(key) || {
        subject: item.subject,
        topic: item.topic,
        attempts: 0,
        totalQuestions: 0,
        correctAnswers: 0
      }

      entry.attempts += 1
      entry.totalQuestions += Number(item.totalQuestions || 0)
      entry.correctAnswers += Number(item.correctAnswers || 0)
      map.set(key, entry)
    }
  }

  return Array.from(map.values())
    .map((item) => ({
      subject: item.subject,
      topic: item.topic,
      attempts: item.attempts,
      accuracy: item.totalQuestions ? Math.round((item.correctAnswers / item.totalQuestions) * 100) : 0,
      misses: Math.max(0, item.totalQuestions - item.correctAnswers)
    }))
    .sort((left, right) => left.accuracy - right.accuracy || right.misses - left.misses)
    .slice(0, 12)
}

function normalizeSubjectBreakdownFromAttempt(attempt) {
  if (Array.isArray(attempt.subjectBreakdown) && attempt.subjectBreakdown.length > 0) {
    return attempt.subjectBreakdown
  }

  if (attempt.subject) {
    return [
      {
        subject: attempt.subject,
        totalQuestions: attempt.totalQuestions,
        correctAnswers: attempt.correctAnswers,
        percentage: attempt.percentage
      }
    ]
  }

  return []
}

function calculateLeaderboardPoints(attempt) {
  const accuracyPoints = Number(attempt.percentage || 0)
  const correctAnswerPoints = Number(attempt.correctAnswers || 0) * 10
  const sessionBonus =
    attempt.sessionType === "mock" ? 40 : attempt.sessionType === "past-paper" ? 20 : 10

  return accuracyPoints + correctAnswerPoints + sessionBonus
}

function normalizeDateKey(value) {
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return ""
  }

  return date.toISOString().slice(0, 10)
}

function calculateCurrentStreak(uniqueDates) {
  const lastDate = uniqueDates[uniqueDates.length - 1]
  const today = new Date().toISOString().slice(0, 10)
  const yesterday = shiftDateKey(today, -1)

  if (lastDate !== today && lastDate !== yesterday) {
    return 0
  }

  let streak = 1
  let cursor = lastDate

  for (let index = uniqueDates.length - 2; index >= 0; index -= 1) {
    const previousDate = uniqueDates[index]

    if (previousDate === shiftDateKey(cursor, -1)) {
      streak += 1
      cursor = previousDate
      continue
    }

    break
  }

  return streak
}

function calculateLongestStreak(uniqueDates) {
  let longest = 0
  let current = 0
  let previousDate = ""

  for (const dateKey of uniqueDates) {
    if (!previousDate) {
      current = 1
    } else if (dateKey === shiftDateKey(previousDate, 1)) {
      current += 1
    } else {
      current = 1
    }

    previousDate = dateKey
    longest = Math.max(longest, current)
  }

  return longest
}

function shiftDateKey(dateKey, offsetDays) {
  const [year, month, day] = String(dateKey).split("-").map((part) => Number.parseInt(part, 10))
  const utcDate = new Date(Date.UTC(year, month - 1, day))
  utcDate.setUTCDate(utcDate.getUTCDate() + offsetDays)
  return utcDate.toISOString().slice(0, 10)
}

function buildFeedback(percentage, sessionType) {
  if (percentage >= 80) {
    if (sessionType === "mock") {
      return "Excellent mock performance. You are looking increasingly exam-ready under session pressure."
    }

    if (sessionType === "past-paper") {
      return "Excellent work on this past paper set. You are handling year-based revision with strong control."
    }

    return "Excellent work. You are showing strong readiness for timed practice and should now focus on consistency."
  }

  if (percentage >= 60) {
    if (sessionType === "mock") {
      return "Solid mock performance. You are building confidence, but some subjects still need stronger control."
    }

    if (sessionType === "past-paper") {
      return "Good past paper result. Review the missed questions from this year and then move to another set."
    }

    return "Good progress. You are building exam confidence, but a few weak areas still need targeted revision."
  }

  if (sessionType === "mock") {
    return "This mock exam exposed useful gaps. Focus on the weaker subjects and repeat a full session after revision."
  }

  if (sessionType === "past-paper") {
    return "This past paper set highlighted important gaps. Review this year carefully and try another year afterward."
  }

  return "This is a useful practice result. Focus on the missed topics, review explanations carefully, and try another round."
}

function buildDefaultTitle(sessionType, examType, subjectBreakdown) {
  if (sessionType === "mock") {
    return `${examType} full mock exam`
  }

  if (sessionType === "past-paper") {
    return `${examType} past paper set`
  }

  return subjectBreakdown[0]?.subject ? `${subjectBreakdown[0].subject} subject drill` : `${examType} practice`
}

module.exports = {
  getPracticeAnalytics,
  getPracticeLeaderboard,
  getPracticeStreakSummary,
  gradePracticeSubmission,
  sanitizeQuestionForClient
}
