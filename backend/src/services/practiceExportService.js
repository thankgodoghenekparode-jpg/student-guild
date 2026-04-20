const { sanitizeQuery, sanitizeText } = require("../utils/sanitize")

function getCorrectOptionLabel(correctOption) {
  const normalized = String(correctOption ?? "").trim().toUpperCase()

  if (/^[A-D]$/.test(normalized)) {
    return normalized
  }

  const numericIndex = Number.parseInt(normalized || "0", 10)
  const safeIndex = Number.isFinite(numericIndex) ? numericIndex : 0
  return String.fromCharCode(65 + Math.min(3, Math.max(0, safeIndex)))
}

function normalizeExportQuestion(question) {
  return {
    examType: question.examType || "",
    subject: question.subject || "",
    topic: question.topic || "",
    year: String(question.year || ""),
    prompt: question.prompt || "",
    optionA: question.options?.[0] || "",
    optionB: question.options?.[1] || "",
    optionC: question.options?.[2] || "",
    optionD: question.options?.[3] || "",
    correctOption: getCorrectOptionLabel(question.correctOption),
    explanation: question.explanation || ""
  }
}

function escapeCsvCell(value) {
  const normalized = String(value ?? "")

  if (!/[",\n]/.test(normalized)) {
    return normalized
  }

  return `"${normalized.replace(/"/g, "\"\"")}"`
}

function buildPracticeQuestionCsv(questions) {
  const rows = [
    [
      "examType",
      "subject",
      "topic",
      "year",
      "prompt",
      "optionA",
      "optionB",
      "optionC",
      "optionD",
      "correctOption",
      "explanation"
    ]
  ]

  questions.forEach((question) => {
    const item = normalizeExportQuestion(question)

    rows.push([
      item.examType,
      item.subject,
      item.topic,
      item.year,
      item.prompt,
      item.optionA,
      item.optionB,
      item.optionC,
      item.optionD,
      item.correctOption,
      item.explanation
    ])
  })

  return rows.map((row) => row.map(escapeCsvCell).join(",")).join("\n")
}

function buildPracticeExportFileName({ format, examType, year, query }) {
  const safeFormat = sanitizeQuery(format) === "csv" ? "csv" : "json"
  const examPart = sanitizeQuery(examType) || "all-exams"
  const yearPart = sanitizeText(year, { maxLength: 12, allowNewLines: false }) || "all-years"
  const queryPart = sanitizeText(query, { maxLength: 40, allowNewLines: false })
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")

  const parts = ["practice-bank", examPart, yearPart]

  if (queryPart) {
    parts.push(queryPart)
  }

  return `${parts.join("-")}.${safeFormat}`
}

module.exports = {
  buildPracticeExportFileName,
  buildPracticeQuestionCsv,
  normalizeExportQuestion
}
