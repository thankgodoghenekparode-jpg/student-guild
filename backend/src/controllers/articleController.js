const { findArticleById, listArticles } = require("../database/repositories/articleRepository")
const { createHttpError } = require("../utils/errors")

async function getArticles(request, response) {
  const items = await listArticles({ category: request.query.category })
  response.json({ items, total: items.length })
}

async function getArticleById(request, response) {
  const article = await findArticleById(request.params.articleId)

  if (!article) {
    throw createHttpError(404, "Article not found.")
  }

  response.json({ item: article })
}

module.exports = {
  getArticleById,
  getArticles
}
