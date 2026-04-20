const { quizQuestions } = require("../constants/quizQuestions")
const { calculateRecommendationResults } = require("./recommendationAlgorithm")
const { createHttpError } = require("../utils/errors")

function validateQuizAnswers(rawAnswers) {
  if (!rawAnswers || typeof rawAnswers !== "object") {
    throw createHttpError(400, "Quiz answers are required.")
  }

  const answers = {}

  for (const question of quizQuestions) {
    const answer = rawAnswers[question.category]
    const isValid = question.options.some((option) => option.value === answer)

    if (!isValid) {
      throw createHttpError(400, `Please answer the question: ${question.label}`)
    }

    answers[question.category] = answer
  }

  return answers
}

function generateRecommendations(courses, rawAnswers) {
  const answers = validateQuizAnswers(rawAnswers)
  return calculateRecommendationResults(courses, answers)
}

module.exports = {
  generateRecommendations,
  validateQuizAnswers
}
