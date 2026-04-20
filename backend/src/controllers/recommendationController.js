const { quizQuestions } = require("../constants/quizQuestions")
const { listAllCourses } = require("../database/repositories/courseRepository")
const { generateRecommendations } = require("../services/recommendationService")

async function getQuizQuestions(request, response) {
  response.json({ items: quizQuestions })
}

async function submitQuiz(request, response) {
  const courses = await listAllCourses()
  const items = generateRecommendations(courses, request.body.answers)

  response.json({
    items,
    generatedAt: new Date().toISOString()
  })
}

module.exports = {
  getQuizQuestions,
  submitQuiz
}
