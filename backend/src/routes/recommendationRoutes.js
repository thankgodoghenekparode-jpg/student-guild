const express = require("express")
const { getQuizQuestions, submitQuiz } = require("../controllers/recommendationController")
const { asyncHandler } = require("../utils/asyncHandler")

const recommendationRouter = express.Router()

recommendationRouter.get("/questions", asyncHandler(getQuizQuestions))
recommendationRouter.post("/quiz", asyncHandler(submitQuiz))

module.exports = { recommendationRouter }
