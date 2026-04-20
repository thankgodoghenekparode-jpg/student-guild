const { createId, readCollection, writeCollection } = require("../fileStore")
const { buildPracticeQuestionSeedKey } = require("../../models/practiceQuestionModel")
const { sanitizeInteger, sanitizeQuery, sanitizeStringArray, sanitizeText } = require("../../utils/sanitize")

async function getPracticeCatalog() {
  const questions = await readCollection("practiceQuestions")
  const examMap = new Map()

  for (const question of questions) {
    if (!examMap.has(question.examType)) {
      examMap.set(question.examType, {
        examType: question.examType,
        totalQuestions: 0,
        years: new Map(),
        subjects: new Map()
      })
    }

    const examEntry = examMap.get(question.examType)
    examEntry.totalQuestions += 1
    examEntry.years.set(question.year, (examEntry.years.get(question.year) || 0) + 1)

    if (!examEntry.subjects.has(question.subject)) {
      examEntry.subjects.set(question.subject, {
        subject: question.subject,
        count: 0,
        topics: new Set(),
        years: new Set(),
        yearCounts: new Map()
      })
    }

    const subjectEntry = examEntry.subjects.get(question.subject)
    subjectEntry.count += 1
    subjectEntry.topics.add(question.topic)
    subjectEntry.years.add(question.year)
    subjectEntry.yearCounts.set(question.year, (subjectEntry.yearCounts.get(question.year) || 0) + 1)
  }

  return Array.from(examMap.values())
    .map((entry) => ({
      examType: entry.examType,
      totalQuestions: entry.totalQuestions,
      years: normalizeYearCounts(entry.years),
      subjects: Array.from(entry.subjects.values())
        .map((subjectEntry) => ({
          subject: subjectEntry.subject,
          count: subjectEntry.count,
          topics: Array.from(subjectEntry.topics).sort((left, right) => left.localeCompare(right)),
          years: Array.from(subjectEntry.years).sort((left, right) => right.localeCompare(left)),
          yearCounts: normalizeYearCounts(subjectEntry.yearCounts)
        }))
        .sort((left, right) => left.subject.localeCompare(right.subject))
    }))
    .sort((left, right) => left.examType.localeCompare(right.examType))
}

async function listPracticeQuestions({ examType, subject, limit = 10, year }) {
  const filteredQuestions = await filterPracticeQuestions({ examType, subject, year })
  const cappedLimit = sanitizeInteger(limit, { min: 1, max: 30, fallback: 10 })

  return shuffle(filteredQuestions).slice(0, cappedLimit)
}

async function createMockExamQuestionSet({ examType, subjects, totalQuestions }) {
  const normalizedExamType = sanitizeQuery(examType)
  const selectedSubjects = sanitizeStringArray(subjects, { minItems: 1, maxItems: 6, itemMaxLength: 60 })
  const desiredQuestionCount = sanitizeInteger(totalQuestions, { min: 40, max: 60, fallback: 40 })
  const questions = await readCollection("practiceQuestions")

  const subjectPools = new Map(
    selectedSubjects.map((subject) => [
      subject,
      shuffle(
        questions.filter(
          (question) =>
            sanitizeQuery(question.examType) === normalizedExamType &&
            sanitizeQuery(question.subject) === sanitizeQuery(subject)
        )
      )
    ])
  )

  const totalAvailable = Array.from(subjectPools.values()).reduce((total, items) => total + items.length, 0)

  if (totalAvailable < desiredQuestionCount) {
    return []
  }

  const selectedQuestions = []

  while (selectedQuestions.length < desiredQuestionCount) {
    let pickedInRound = 0

    for (const subject of selectedSubjects) {
      const pool = subjectPools.get(subject) || []

      if (pool.length > 0 && selectedQuestions.length < desiredQuestionCount) {
        selectedQuestions.push(pool.pop())
        pickedInRound += 1
      }
    }

    if (pickedInRound === 0) {
      break
    }
  }

  return shuffle(selectedQuestions).slice(0, desiredQuestionCount)
}

async function createPastPaperQuestionSet({ examType, year, subjects }) {
  const normalizedExamType = sanitizeText(examType, { maxLength: 20, allowNewLines: false })
  const normalizedYear = sanitizeText(year, { maxLength: 10, allowNewLines: false })
  const selectedSubjects = sanitizeStringArray(subjects, { maxItems: 7, itemMaxLength: 60 })
  const filteredQuestions = await filterPracticeQuestions({
    examType: normalizedExamType,
    year: normalizedYear
  })

  if (selectedSubjects.length === 0) {
    return sortQuestionsBySubjectAndTopic(filteredQuestions)
  }

  const selectedSubjectSet = new Set(selectedSubjects.map((subject) => sanitizeQuery(subject)))

  return sortQuestionsBySubjectAndTopic(
    filteredQuestions.filter((question) => selectedSubjectSet.has(sanitizeQuery(question.subject)))
  )
}

async function getPracticeQuestionsByIds(questionIds) {
  const questions = await readCollection("practiceQuestions")
  const idSet = new Set(questionIds)
  return questions.filter((question) => idSet.has(question.id))
}

async function createPracticeAttempt({
  userId,
  sessionType,
  examType,
  title,
  subject,
  subjects,
  totalQuestions,
  correctAnswers,
  percentage,
  durationSeconds,
  weakTopics,
  subjectBreakdown,
  topicBreakdown
}) {
  const attempts = await readCollection("practiceAttempts")
  const attempt = {
    id: createId("attempt"),
    userId,
    sessionType: sanitizeText(sessionType, { maxLength: 20, allowNewLines: false }) || "drill",
    examType: sanitizeText(examType, { maxLength: 20, allowNewLines: false }),
    title: sanitizeText(title, { maxLength: 120 }),
    subject: sanitizeText(subject, { maxLength: 60, allowNewLines: false }),
    subjects: sanitizeStringArray(subjects, { maxItems: 7, itemMaxLength: 60 }),
    totalQuestions,
    correctAnswers,
    percentage,
    durationSeconds,
    weakTopics,
    subjectBreakdown: normalizeSubjectBreakdown(subjectBreakdown),
    topicBreakdown: normalizeTopicBreakdown(topicBreakdown),
    createdAt: new Date().toISOString()
  }

  attempts.push(attempt)
  await writeCollection("practiceAttempts", attempts)
  return attempt
}

async function listAdminPracticeQuestions(filters = {}) {
  const questions = await readCollection("practiceQuestions")
  const examType = sanitizeQuery(filters.examType)
  const subject = sanitizeQuery(filters.subject)
  const year = sanitizeQuery(filters.year)
  const query = sanitizeQuery(filters.query)

  return sortQuestionsBySubjectAndTopic(
    questions.filter((question) => {
      if (examType && sanitizeQuery(question.examType) !== examType) {
        return false
      }

      if (subject && sanitizeQuery(question.subject) !== subject) {
        return false
      }

      if (year && sanitizeQuery(question.year) !== year) {
        return false
      }

      if (!query) {
        return true
      }

      const haystack = [question.subject, question.topic, question.year, question.prompt]
        .join(" ")
        .toLowerCase()

      return haystack.includes(query)
    })
  )
}

async function listPracticeAttemptsForUser(userId) {
  const attempts = await readCollection("practiceAttempts")
  return attempts
    .filter((attempt) => attempt.userId === userId)
    .sort((left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime())
}

async function listAllPracticeAttempts() {
  const attempts = await readCollection("practiceAttempts")
  return attempts.sort((left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime())
}

async function findPracticeQuestionById(questionId) {
  const questions = await readCollection("practiceQuestions")
  return questions.find((question) => question.id === questionId) || null
}

async function createPracticeQuestion(question) {
  const questions = await readCollection("practiceQuestions")
  questions.push(question)
  await writeCollection("practiceQuestions", questions)
  return question
}

async function createManyPracticeQuestions(items) {
  const questions = await readCollection("practiceQuestions")
  const existingKeys = new Set(questions.map((question) => question.seedKey || buildPracticeQuestionSeedKey(question)))
  const createdItems = []
  const skippedItems = []

  for (const item of items) {
    const seedKey = item.seedKey || buildPracticeQuestionSeedKey(item)

    if (existingKeys.has(seedKey)) {
      skippedItems.push({
        prompt: item.prompt,
        reason: "Duplicate question"
      })
      continue
    }

    existingKeys.add(seedKey)
    createdItems.push(item)
    questions.push(item)
  }

  if (createdItems.length > 0) {
    await writeCollection("practiceQuestions", questions)
  }

  return {
    createdItems,
    skippedItems
  }
}

async function updatePracticeQuestion(questionId, nextQuestion) {
  const questions = await readCollection("practiceQuestions")
  const index = questions.findIndex((question) => question.id === questionId)

  if (index === -1) {
    return null
  }

  questions[index] = nextQuestion
  await writeCollection("practiceQuestions", questions)
  return nextQuestion
}

async function deletePracticeQuestion(questionId) {
  const questions = await readCollection("practiceQuestions")
  const nextQuestions = questions.filter((question) => question.id !== questionId)

  if (nextQuestions.length === questions.length) {
    return false
  }

  await writeCollection("practiceQuestions", nextQuestions)
  return true
}

async function countPracticeQuestions() {
  const questions = await readCollection("practiceQuestions")
  return questions.length
}

async function countPracticeAttempts() {
  const attempts = await readCollection("practiceAttempts")
  return attempts.length
}

async function filterPracticeQuestions({ examType, subject, year }) {
  const normalizedExamType = sanitizeQuery(examType)
  const normalizedSubject = sanitizeQuery(subject)
  const normalizedYear = sanitizeQuery(year)
  const questions = await readCollection("practiceQuestions")

  return questions.filter((question) => {
    if (!normalizedExamType || sanitizeQuery(question.examType) !== normalizedExamType) {
      return false
    }

    if (normalizedSubject && sanitizeQuery(question.subject) !== normalizedSubject) {
      return false
    }

    if (normalizedYear && sanitizeQuery(question.year) !== normalizedYear) {
      return false
    }

    return true
  })
}

function normalizeYearCounts(yearMap) {
  return Array.from(yearMap.entries())
    .map(([year, count]) => ({
      year,
      count
    }))
    .sort((left, right) => right.year.localeCompare(left.year))
}

function sortQuestionsBySubjectAndTopic(questions) {
  return [...questions].sort(
    (left, right) =>
      left.examType.localeCompare(right.examType) ||
      right.year.localeCompare(left.year) ||
      left.subject.localeCompare(right.subject) ||
      left.topic.localeCompare(right.topic) ||
      left.prompt.localeCompare(right.prompt)
  )
}

function normalizeSubjectBreakdown(items) {
  if (!Array.isArray(items)) {
    return []
  }

  return items
    .map((item) => ({
      subject: sanitizeText(item.subject, { maxLength: 60, allowNewLines: false }),
      totalQuestions: sanitizeInteger(item.totalQuestions, { min: 0, max: 60, fallback: 0 }),
      correctAnswers: sanitizeInteger(item.correctAnswers, { min: 0, max: 60, fallback: 0 }),
      percentage: sanitizeInteger(item.percentage, { min: 0, max: 100, fallback: 0 })
    }))
    .filter((item) => item.subject)
}

function normalizeTopicBreakdown(items) {
  if (!Array.isArray(items)) {
    return []
  }

  return items
    .map((item) => ({
      subject: sanitizeText(item.subject, { maxLength: 60, allowNewLines: false }),
      topic: sanitizeText(item.topic, { maxLength: 80, allowNewLines: false }),
      totalQuestions: sanitizeInteger(item.totalQuestions, { min: 0, max: 60, fallback: 0 }),
      correctAnswers: sanitizeInteger(item.correctAnswers, { min: 0, max: 60, fallback: 0 }),
      percentage: sanitizeInteger(item.percentage, { min: 0, max: 100, fallback: 0 })
    }))
    .filter((item) => item.subject && item.topic)
}

function shuffle(items) {
  const nextItems = [...items]

  for (let index = nextItems.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1))
    const temp = nextItems[index]
    nextItems[index] = nextItems[randomIndex]
    nextItems[randomIndex] = temp
  }

  return nextItems
}

module.exports = {
  createMockExamQuestionSet,
  createPastPaperQuestionSet,
  createPracticeAttempt,
  createPracticeQuestion,
  createManyPracticeQuestions,
  countPracticeAttempts,
  countPracticeQuestions,
  deletePracticeQuestion,
  findPracticeQuestionById,
  getPracticeCatalog,
  getPracticeQuestionsByIds,
  listAllPracticeAttempts,
  listAdminPracticeQuestions,
  listPracticeAttemptsForUser,
  listPracticeQuestions,
  updatePracticeQuestion
}
