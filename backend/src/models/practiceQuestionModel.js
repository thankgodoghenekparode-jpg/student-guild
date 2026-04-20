const { createId } = require("../database/fileStore")
const { createHttpError } = require("../utils/errors")
const { sanitizeQuery } = require("../utils/sanitize")
const {
  assertEnum,
  assertInteger,
  assertRequiredString,
  assertStringArray
} = require("../utils/validation")

function normalizePracticeQuestionInput(payload, existingQuestion = null) {
  const examType = assertEnum(payload.examType, "Exam type", ["JAMB", "WAEC"])
  const subject = assertRequiredString(payload.subject, "Subject", { maxLength: 80, allowNewLines: false })
  const topic = assertRequiredString(payload.topic, "Topic", { maxLength: 120, allowNewLines: false })
  const year = assertRequiredString(payload.year, "Year", { maxLength: 10, allowNewLines: false })
  const prompt = assertRequiredString(payload.prompt, "Question prompt", { maxLength: 320 })
  const options = assertStringArray(payload.options, "Options", {
    minItems: 4,
    maxItems: 4,
    itemMaxLength: 180
  })
  const correctOption = normalizeCorrectOption(payload.correctOption)
  const explanation = assertRequiredString(payload.explanation, "Explanation", { maxLength: 280 })
  const now = new Date().toISOString()

  if (!/^\d{4}$/.test(year)) {
    throw createHttpError(400, "Year must be a valid 4-digit exam year.")
  }

  return {
    id: existingQuestion?.id || createId("practice"),
    seedKey:
      existingQuestion?.seedKey ||
      buildPracticeQuestionSeedKey({
        examType,
        subject,
        year,
        prompt
      }),
    examType,
    subject,
    topic,
    year,
    prompt,
    options,
    correctOption,
    explanation,
    createdAt: existingQuestion?.createdAt || now,
    updatedAt: now
  }
}

function buildPracticeQuestionSeedKey(question) {
  return [
    sanitizeQuery(question.examType),
    sanitizeQuery(question.subject),
    sanitizeQuery(question.year),
    sanitizeQuery(question.prompt)
  ].join("::")
}

function normalizeCorrectOption(value) {
  if (typeof value === "string") {
    const normalized = value.trim().toUpperCase()

    if (["A", "B", "C", "D"].includes(normalized)) {
      return ["A", "B", "C", "D"].indexOf(normalized)
    }

    if (["1", "2", "3", "4"].includes(normalized)) {
      return Number.parseInt(normalized, 10) - 1
    }
  }

  return assertInteger(value, "Correct option", {
    min: 0,
    max: 3,
    fallback: 0
  })
}

module.exports = {
  buildPracticeQuestionSeedKey,
  normalizePracticeQuestionInput
}
