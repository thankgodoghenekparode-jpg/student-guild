const { countArticles, createArticle, deleteArticle, findArticleById, listArticles, updateArticle } = require("../database/repositories/articleRepository")
const { countCourses, createCourse, deleteCourse, findCourseById, listAllCourses, updateCourse } = require("../database/repositories/courseRepository")
const {
  countPracticeAttempts,
  countPracticeQuestions,
  createManyPracticeQuestions,
  createPracticeQuestion,
  deletePracticeQuestion,
  findPracticeQuestionById,
  getPracticeCatalog,
  listAdminPracticeQuestions,
  updatePracticeQuestion
} = require("../database/repositories/practiceRepository")
const { getMostSelectedCourses } = require("../database/repositories/savedCourseRepository")
const { countUsers } = require("../database/repositories/userRepository")
const { normalizeArticleInput } = require("../models/articleModel")
const { normalizeCourseInput } = require("../models/courseModel")
const { normalizePracticeQuestionInput } = require("../models/practiceQuestionModel")
const {
  buildPracticeExportFileName,
  buildPracticeQuestionCsv,
  normalizeExportQuestion
} = require("../services/practiceExportService")
const { parsePracticeImport } = require("../services/practiceImportService")
const { saveUploadedImage } = require("../storage/imageStorage")
const { createHttpError } = require("../utils/errors")
const { sanitizeText } = require("../utils/sanitize")

async function getOverview(request, response) {
  const [
    totalUsers,
    totalCourses,
    totalArticles,
    totalPracticeQuestions,
    totalPracticeAttempts,
    mostSelectedCourses,
    practiceCatalog
  ] = await Promise.all([
    countUsers(),
    countCourses(),
    countArticles(),
    countPracticeQuestions(),
    countPracticeAttempts(),
    getMostSelectedCourses(5),
    getPracticeCatalog()
  ])

  response.json({
    totalUsers,
    totalCourses,
    totalArticles,
    totalPracticeQuestions,
    totalPracticeAttempts,
    practiceCatalog,
    mostSelectedCourses
  })
}

async function createCourseItem(request, response) {
  const course = normalizeCourseInput(request.body)
  const created = await createCourse(course)
  response.status(201).json({ item: created })
}

async function updateCourseItem(request, response) {
  const existingCourse = await findCourseById(request.params.courseId)

  if (!existingCourse) {
    throw createHttpError(404, "Course not found.")
  }

  const nextCourse = normalizeCourseInput({ ...existingCourse, ...request.body }, existingCourse)
  const updated = await updateCourse(existingCourse.id, nextCourse)
  response.json({ item: updated })
}

async function deleteCourseItem(request, response) {
  const deleted = await deleteCourse(request.params.courseId)

  if (!deleted) {
    throw createHttpError(404, "Course not found.")
  }

  response.status(204).send()
}

async function createArticleItem(request, response) {
  const article = normalizeArticleInput(request.body)
  const created = await createArticle(article)
  response.status(201).json({ item: created })
}

async function updateArticleItem(request, response) {
  const existingArticle = await findArticleById(request.params.articleId)

  if (!existingArticle) {
    throw createHttpError(404, "Article not found.")
  }

  const nextArticle = normalizeArticleInput({ ...existingArticle, ...request.body }, existingArticle)
  const updated = await updateArticle(existingArticle.id, nextArticle)
  response.json({ item: updated })
}

async function deleteArticleItem(request, response) {
  const deleted = await deleteArticle(request.params.articleId)

  if (!deleted) {
    throw createHttpError(404, "Article not found.")
  }

  response.status(204).send()
}

async function getAdminCourseList(request, response) {
  const items = await listAllCourses()
  response.json({ items })
}

async function getAdminArticleList(request, response) {
  const items = await listArticles()
  response.json({ items })
}

async function getAdminPracticeQuestionList(request, response) {
  const items = await listAdminPracticeQuestions({
    examType: request.query.examType,
    subject: request.query.subject,
    year: request.query.year,
    query: request.query.query
  })

  response.json({ items })
}

async function createPracticeQuestionItem(request, response) {
  const question = normalizePracticeQuestionInput(request.body)
  const created = await createPracticeQuestion(question)
  response.status(201).json({ item: created })
}

async function importPracticeQuestionItems(request, response) {
  const format = sanitizeText(request.body.format, { maxLength: 10, allowNewLines: false })
  const content = String(request.body.content || "")
  const importedRows = parsePracticeImport({ format, content })
  const normalizedQuestions = []
  const errors = []

  importedRows.forEach((row, index) => {
    try {
      normalizedQuestions.push(normalizePracticeQuestionInput(row))
    } catch (error) {
      errors.push({
        row: index + 1,
        message: error.message || "Import row could not be validated."
      })
    }
  })

  if (normalizedQuestions.length === 0) {
    throw createHttpError(400, errors[0]?.message || "No valid practice questions were found in the import.")
  }

  const { createdItems, skippedItems } = await createManyPracticeQuestions(normalizedQuestions)

  response.status(201).json({
    createdCount: createdItems.length,
    skippedCount: skippedItems.length,
    errorCount: errors.length,
    skippedItems: skippedItems.slice(0, 10),
    errors: errors.slice(0, 10)
  })
}

async function exportPracticeQuestionItems(request, response) {
  const format = sanitizeText(request.query.format, { maxLength: 10, allowNewLines: false }).toLowerCase() || "json"

  if (!["json", "csv"].includes(format)) {
    throw createHttpError(400, "Export format must be json or csv.")
  }

  const items = await listAdminPracticeQuestions({
    examType: request.query.examType,
    subject: request.query.subject,
    year: request.query.year,
    query: request.query.query
  })
  const fileName = buildPracticeExportFileName({
    format,
    examType: request.query.examType,
    year: request.query.year,
    query: request.query.query
  })

  if (format === "csv") {
    response.setHeader("Content-Type", "text/csv; charset=utf-8")
    response.setHeader("Content-Disposition", `attachment; filename="${fileName}"`)
    response.send(buildPracticeQuestionCsv(items))
    return
  }

  response.setHeader("Content-Type", "application/json; charset=utf-8")
  response.setHeader("Content-Disposition", `attachment; filename="${fileName}"`)
  response.send(JSON.stringify(items.map(normalizeExportQuestion), null, 2))
}

async function updatePracticeQuestionItem(request, response) {
  const existingQuestion = await findPracticeQuestionById(request.params.questionId)

  if (!existingQuestion) {
    throw createHttpError(404, "Practice question not found.")
  }

  const nextQuestion = normalizePracticeQuestionInput({ ...existingQuestion, ...request.body }, existingQuestion)
  const updated = await updatePracticeQuestion(existingQuestion.id, nextQuestion)
  response.json({ item: updated })
}

async function deletePracticeQuestionItem(request, response) {
  const deleted = await deletePracticeQuestion(request.params.questionId)

  if (!deleted) {
    throw createHttpError(404, "Practice question not found.")
  }

  response.status(204).send()
}

async function uploadImage(request, response) {
  if (!request.file) {
    throw createHttpError(400, "An image file is required.")
  }

  response.status(201).json({
    imageUrl: await saveUploadedImage(request.file)
  })
}

module.exports = {
  createArticleItem,
  createCourseItem,
  createPracticeQuestionItem,
  exportPracticeQuestionItems,
  importPracticeQuestionItems,
  deleteArticleItem,
  deleteCourseItem,
  deletePracticeQuestionItem,
  getAdminArticleList,
  getAdminCourseList,
  getAdminPracticeQuestionList,
  getOverview,
  updateArticleItem,
  updateCourseItem,
  updatePracticeQuestionItem,
  uploadImage
}
