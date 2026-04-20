const { readCollection, writeCollection } = require("../fileStore")
const { sanitizeQuery } = require("../../utils/sanitize")

async function listCourses(filters = {}) {
  const courses = await readCollection("courses")
  const query = sanitizeQuery(filters.query)
  const category = sanitizeQuery(filters.category)
  const institutionType = sanitizeQuery(filters.institutionType)

  return courses
    .filter((course) => {
      if (category && sanitizeQuery(course.category) !== category) {
        return false
      }

      if (institutionType && sanitizeQuery(course.institutionType) !== institutionType) {
        return false
      }

      if (!query) {
        return true
      }

      const haystack = [
        course.title,
        course.category,
        course.summary,
        course.overview,
        course.institutionType,
        ...(course.requiredSubjects || []),
        ...(course.careers || []),
        ...(course.sideSkills || []),
        ...(course.tags || [])
      ]
        .join(" ")
        .toLowerCase()

      return haystack.includes(query)
    })
    .sort((left, right) => left.title.localeCompare(right.title))
}

async function listAllCourses() {
  return readCollection("courses")
}

async function findCourseById(courseId) {
  const courses = await readCollection("courses")
  return courses.find((course) => course.id === courseId) || null
}

async function findCourseBySlug(slug) {
  const courses = await readCollection("courses")
  return courses.find((course) => course.slug === slug) || null
}

async function createCourse(course) {
  const courses = await readCollection("courses")
  courses.push(course)
  await writeCollection("courses", courses)
  return course
}

async function updateCourse(courseId, nextCourse) {
  const courses = await readCollection("courses")
  const index = courses.findIndex((course) => course.id === courseId)

  if (index === -1) {
    return null
  }

  courses[index] = nextCourse
  await writeCollection("courses", courses)
  return nextCourse
}

async function deleteCourse(courseId) {
  const courses = await readCollection("courses")
  const nextCourses = courses.filter((course) => course.id !== courseId)

  if (nextCourses.length === courses.length) {
    return false
  }

  await writeCollection("courses", nextCourses)
  return true
}

async function countCourses() {
  const courses = await readCollection("courses")
  return courses.length
}

module.exports = {
  countCourses,
  createCourse,
  deleteCourse,
  findCourseById,
  findCourseBySlug,
  listAllCourses,
  listCourses,
  updateCourse
}
