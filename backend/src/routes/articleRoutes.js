const express = require("express")
const { getArticleById, getArticles } = require("../controllers/articleController")
const { asyncHandler } = require("../utils/asyncHandler")

const articleRouter = express.Router()

articleRouter.get("/", asyncHandler(getArticles))
articleRouter.get("/:articleId", asyncHandler(getArticleById))

module.exports = { articleRouter }
