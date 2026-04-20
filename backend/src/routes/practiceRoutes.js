const express = require("express")
const {
  getAnalytics,
  getCatalog,
  getLeaderboard,
  getMockSession,
  getPastPaperSession,
  getPracticeHistory,
  getQuestions,
  getStreak,
  savePracticeHistory,
  submitPractice
} = require("../controllers/practiceController")
const { requireAuth } = require("../middleware/authMiddleware")
const { asyncHandler } = require("../utils/asyncHandler")

const practiceRouter = express.Router()

practiceRouter.get("/catalog", asyncHandler(getCatalog))
practiceRouter.get("/questions", asyncHandler(getQuestions))
practiceRouter.post("/past-paper-session", asyncHandler(getPastPaperSession))
practiceRouter.post("/mock-session", asyncHandler(getMockSession))
practiceRouter.post("/submit", asyncHandler(submitPractice))
practiceRouter.get("/history", asyncHandler(requireAuth), asyncHandler(getPracticeHistory))
practiceRouter.post("/history", asyncHandler(requireAuth), asyncHandler(savePracticeHistory))
practiceRouter.get("/analytics", asyncHandler(requireAuth), asyncHandler(getAnalytics))
practiceRouter.get("/streak", asyncHandler(requireAuth), asyncHandler(getStreak))
practiceRouter.get("/leaderboard", asyncHandler(requireAuth), asyncHandler(getLeaderboard))

module.exports = { practiceRouter }
