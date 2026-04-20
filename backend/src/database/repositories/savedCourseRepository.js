const { createId, readCollection, writeCollection } = require("../fileStore")

async function listSavedCoursesForUser(userId) {
  const items = await readCollection("savedCourses")
  return items
    .filter((item) => item.userId === userId)
    .sort((left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime())
}

async function findSavedCourse(userId, courseId) {
  const items = await readCollection("savedCourses")
  return items.find((item) => item.userId === userId && item.courseId === courseId) || null
}

async function createSavedCourse({ userId, courseId, courseTitle, matchPercentage, whyFit }) {
  const items = await readCollection("savedCourses")
  const entry = {
    id: createId("saved"),
    userId,
    courseId,
    courseTitle,
    matchPercentage,
    whyFit,
    createdAt: new Date().toISOString()
  }

  items.push(entry)
  await writeCollection("savedCourses", items)
  return entry
}

async function deleteSavedCourse(userId, savedCourseId) {
  const items = await readCollection("savedCourses")
  const nextItems = items.filter((item) => !(item.id === savedCourseId && item.userId === userId))

  if (nextItems.length === items.length) {
    return false
  }

  await writeCollection("savedCourses", nextItems)
  return true
}

async function getMostSelectedCourses(limit = 5) {
  const items = await readCollection("savedCourses")
  const counts = new Map()

  for (const item of items) {
    const current = counts.get(item.courseId) || { courseId: item.courseId, courseTitle: item.courseTitle, saves: 0 }
    current.saves += 1
    counts.set(item.courseId, current)
  }

  return Array.from(counts.values())
    .sort((left, right) => right.saves - left.saves || left.courseTitle.localeCompare(right.courseTitle))
    .slice(0, limit)
}

module.exports = {
  createSavedCourse,
  deleteSavedCourse,
  findSavedCourse,
  getMostSelectedCourses,
  listSavedCoursesForUser
}
