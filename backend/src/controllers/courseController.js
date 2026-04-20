const {
  findCourseById,
  listCourses
} = require("../database/repositories/courseRepository")
const {
  createSavedCourse,
  deleteSavedCourse,
  findSavedCourse,
  listSavedCoursesForUser
} = require("../database/repositories/savedCourseRepository")
const { createHttpError } = require("../utils/errors")
const { sanitizeInteger } = require("../utils/sanitize")

async function getCourses(request, response) {
  const courses = await listCourses({
    query: request.query.query,
    category: request.query.category,
    institutionType: request.query.institutionType
  })

  response.json({
    items: courses,
    total: courses.length
  })
}

async function getCourseById(request, response) {
  const course = await findCourseById(request.params.courseId)

  if (!course) {
    throw createHttpError(404, "Course not found.")
  }

  response.json({ item: course })
}

async function saveCourseForUser(request, response) {
  const course = await findCourseById(request.params.courseId)

  if (!course) {
    throw createHttpError(404, "Course not found.")
  }

  const existingSave = await findSavedCourse(request.user.id, course.id)

  if (existingSave) {
    response.json({ item: existingSave, alreadySaved: true })
    return
  }

  const saved = await createSavedCourse({
    userId: request.user.id,
    courseId: course.id,
    courseTitle: course.title,
    matchPercentage: sanitizeInteger(request.body.matchPercentage, { min: 0, max: 100, fallback: 0 }),
    whyFit: String(request.body.whyFit || "").slice(0, 220)
  })

  response.status(201).json({ item: saved })
}

async function getSavedCourses(request, response) {
  const savedItems = await listSavedCoursesForUser(request.user.id)
  const courses = await listCourses()
  const courseMap = new Map(courses.map((course) => [course.id, course]))

  response.json({
    items: savedItems.map((item) => ({
      ...item,
      course: courseMap.get(item.courseId) || null
    }))
  })
}

async function removeSavedCourse(request, response) {
  const deleted = await deleteSavedCourse(request.user.id, request.params.savedCourseId)

  if (!deleted) {
    throw createHttpError(404, "Saved course not found.")
  }

  response.status(204).send()
}

module.exports = {
  getCourseById,
  getCourses,
  getSavedCourses,
  removeSavedCourse,
  saveCourseForUser
}
