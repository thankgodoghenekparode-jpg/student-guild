const {
  createMockExamQuestionSet,
  createPastPaperQuestionSet,
  createPracticeAttempt,
  getPracticeCatalog,
  getPracticeQuestionsByIds,
  listAllPracticeAttempts,
  listPracticeAttemptsForUser,
  listPracticeQuestions
} = require("../database/repositories/practiceRepository")
const { listStudentUsers } = require("../database/repositories/userRepository")
const {
  getPracticeAnalytics,
  getPracticeLeaderboard,
  getPracticeStreakSummary,
  gradePracticeSubmission,
  sanitizeQuestionForClient
} = require("../services/practiceService")
const { createHttpError } = require("../utils/errors")
const { sanitizeInteger, sanitizeStringArray, sanitizeText } = require("../utils/sanitize")

async function getCatalog(request, response) {
  const items = await getPracticeCatalog()
  response.json({ items })
}

async function getQuestions(request, response) {
  const examType = sanitizeText(request.query.examType, { maxLength: 20, allowNewLines: false })
  const subject = sanitizeText(request.query.subject, { maxLength: 60, allowNewLines: false })
  const year = sanitizeText(request.query.year, { maxLength: 10, allowNewLines: false })
  const limit = sanitizeInteger(request.query.limit, { min: 1, max: 30, fallback: 10 })

  if (!examType || !subject) {
    throw createHttpError(400, "Exam type and subject are required.")
  }

  const questions = await listPracticeQuestions({ examType, subject, limit, year })

  if (!questions.length) {
    throw createHttpError(404, "No practice questions found for that selection yet.")
  }

  response.json({
    sessionType: "drill",
    examType,
    subject,
    total: questions.length,
    items: questions.map(sanitizeQuestionForClient)
  })
}

async function getPastPaperSession(request, response) {
  const examType = sanitizeText(request.body.examType, { maxLength: 20, allowNewLines: false })
  const year = sanitizeText(request.body.year, { maxLength: 10, allowNewLines: false })
  const selectedSubjects = sanitizeStringArray(request.body.subjects, { maxItems: 7, itemMaxLength: 60 })

  if (!examType || !year) {
    throw createHttpError(400, "Exam type and year are required.")
  }

  const questions = await createPastPaperQuestionSet({
    examType,
    year,
    subjects: selectedSubjects
  })

  if (!questions.length) {
    throw createHttpError(404, "No past questions were found for that year and selection.")
  }

  response.json({
    sessionType: "past-paper",
    examType,
    year,
    subjects: selectedSubjects,
    title: `${examType} ${year} past question set`,
    total: questions.length,
    items: questions.map(sanitizeQuestionForClient)
  })
}

async function getMockSession(request, response) {
  const examType = sanitizeText(request.body.examType, { maxLength: 20, allowNewLines: false })
  const selectedSubjects = sanitizeStringArray(request.body.subjects, { minItems: 1, maxItems: 6, itemMaxLength: 60 })
  const totalQuestions = sanitizeInteger(request.body.totalQuestions, { min: 40, max: 60, fallback: 40 })

  if (!examType || selectedSubjects.length === 0) {
    throw createHttpError(400, "Exam type and selected subjects are required.")
  }

  if (examType === "JAMB") {
    if (selectedSubjects.length !== 4 || !selectedSubjects.includes("Use of English")) {
      throw createHttpError(400, "JAMB mock exams must include Use of English plus three other subjects.")
    }
  }

  if (examType === "WAEC" && selectedSubjects.length < 4) {
    throw createHttpError(400, "WAEC mock exams require at least four subjects.")
  }

  const questions = await createMockExamQuestionSet({
    examType,
    subjects: selectedSubjects,
    totalQuestions
  })

  if (!questions.length) {
    throw createHttpError(404, "Not enough questions are available for that mock exam setup yet.")
  }

  response.json({
    sessionType: "mock",
    examType,
    subjects: selectedSubjects,
    title: `${examType} full mock exam`,
    total: questions.length,
    items: questions.map(sanitizeQuestionForClient)
  })
}

async function submitPractice(request, response) {
  const questionIds = Array.isArray(request.body.questionIds) ? request.body.questionIds : []

  if (!questionIds.length) {
    throw createHttpError(400, "Question ids are required for scoring.")
  }

  const questionBank = await getPracticeQuestionsByIds(questionIds)
  const result = gradePracticeSubmission(questionBank, request.body)
  response.json(result)
}

async function savePracticeHistory(request, response) {
  const input = request.body || {}
  const attempt = await createPracticeAttempt({
    userId: request.user.id,
    sessionType: sanitizeText(input.sessionType || "drill", { maxLength: 20, allowNewLines: false }),
    examType: input.examType,
    title: input.title,
    subject: input.subject,
    subjects: Array.isArray(input.subjects) ? input.subjects : [],
    totalQuestions: sanitizeInteger(input.totalQuestions, { min: 1, max: 60, fallback: 1 }),
    correctAnswers: sanitizeInteger(input.correctAnswers, { min: 0, max: 60, fallback: 0 }),
    percentage: sanitizeInteger(input.percentage, { min: 0, max: 100, fallback: 0 }),
    durationSeconds: sanitizeInteger(input.durationSeconds, { min: 0, max: 60 * 60 * 4, fallback: 0 }),
    weakTopics: Array.isArray(input.weakTopics)
      ? input.weakTopics
          .map((item) => sanitizeText(item, { maxLength: 80, allowNewLines: false }))
          .filter(Boolean)
          .slice(0, 5)
      : [],
    subjectBreakdown: Array.isArray(input.subjectBreakdown) ? input.subjectBreakdown : [],
    topicBreakdown: Array.isArray(input.topicBreakdown) ? input.topicBreakdown : []
  })

  response.status(201).json({ item: attempt })
}

async function getPracticeHistory(request, response) {
  const items = await listPracticeAttemptsForUser(request.user.id)
  response.json({ items })
}

async function getAnalytics(request, response) {
  const attempts = await listPracticeAttemptsForUser(request.user.id)
  response.json(getPracticeAnalytics(attempts))
}

async function getStreak(request, response) {
  const attempts = await listPracticeAttemptsForUser(request.user.id)
  response.json(getPracticeStreakSummary(attempts))
}

async function getLeaderboard(request, response) {
  const [attempts, users] = await Promise.all([listAllPracticeAttempts(), listStudentUsers()])
  response.json(getPracticeLeaderboard(attempts, users, request.user.id))
}

module.exports = {
  getAnalytics,
  getCatalog,
  getLeaderboard,
  getMockSession,
  getPastPaperSession,
  getPracticeHistory,
  getQuestions,
  getStreak,
  savePracticeHistory,
  submitPractice
}
