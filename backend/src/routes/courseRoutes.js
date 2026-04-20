const express = require("express")
const {
  getCourseById,
  getCourses,
  getSavedCourses,
  removeSavedCourse,
  saveCourseForUser
} = require("../controllers/courseController")
const { requireAuth } = require("../middleware/authMiddleware")
const { asyncHandler } = require("../utils/asyncHandler")

const courseRouter = express.Router()

courseRouter.get("/", asyncHandler(getCourses))
courseRouter.get("/saved", asyncHandler(requireAuth), asyncHandler(getSavedCourses))
courseRouter.get("/:courseId", asyncHandler(getCourseById))
courseRouter.post("/:courseId/save", asyncHandler(requireAuth), asyncHandler(saveCourseForUser))
courseRouter.delete("/saved/:savedCourseId", asyncHandler(requireAuth), asyncHandler(removeSavedCourse))

module.exports = { courseRouter }
