const express = require("express")
const {
  createArticleItem,
  createCourseItem,
  createPracticeQuestionItem,
  deleteArticleItem,
  deleteCourseItem,
  deletePracticeQuestionItem,
  exportPracticeQuestionItems,
  getAdminArticleList,
  getAdminCourseList,
  getAdminPracticeQuestionList,
  getOverview,
  importPracticeQuestionItems,
  updateArticleItem,
  updateCourseItem,
  updatePracticeQuestionItem,
  uploadImage
} = require("../controllers/adminController")
const { requireAdmin } = require("../middleware/adminMiddleware")
const { requireAuth } = require("../middleware/authMiddleware")
const { uploadArticleImage } = require("../middleware/uploadMiddleware")
const { asyncHandler } = require("../utils/asyncHandler")

const adminRouter = express.Router()

adminRouter.use(asyncHandler(requireAuth), requireAdmin)
adminRouter.get("/overview", asyncHandler(getOverview))
adminRouter.get("/courses", asyncHandler(getAdminCourseList))
adminRouter.post("/courses", asyncHandler(createCourseItem))
adminRouter.put("/courses/:courseId", asyncHandler(updateCourseItem))
adminRouter.delete("/courses/:courseId", asyncHandler(deleteCourseItem))
adminRouter.get("/articles", asyncHandler(getAdminArticleList))
adminRouter.post("/articles", asyncHandler(createArticleItem))
adminRouter.put("/articles/:articleId", asyncHandler(updateArticleItem))
adminRouter.delete("/articles/:articleId", asyncHandler(deleteArticleItem))
adminRouter.get("/practice-questions", asyncHandler(getAdminPracticeQuestionList))
adminRouter.get("/practice-questions/export", asyncHandler(exportPracticeQuestionItems))
adminRouter.post("/practice-questions", asyncHandler(createPracticeQuestionItem))
adminRouter.post("/practice-questions/import", asyncHandler(importPracticeQuestionItems))
adminRouter.put("/practice-questions/:questionId", asyncHandler(updatePracticeQuestionItem))
adminRouter.delete("/practice-questions/:questionId", asyncHandler(deletePracticeQuestionItem))
adminRouter.post("/uploads/image", uploadArticleImage, asyncHandler(uploadImage))

module.exports = { adminRouter }
