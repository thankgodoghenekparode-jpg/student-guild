const { readCollection, writeCollection } = require("../fileStore")
const { sanitizeQuery } = require("../../utils/sanitize")

async function listArticles(filters = {}) {
  const articles = await readCollection("articles")
  const category = sanitizeQuery(filters.category)

  return articles
    .filter((article) => {
      if (!category) {
        return true
      }

      return sanitizeQuery(article.category) === category
    })
    .sort((left, right) => Number(right.featured) - Number(left.featured) || left.title.localeCompare(right.title))
}

async function findArticleById(articleId) {
  const articles = await readCollection("articles")
  return articles.find((article) => article.id === articleId) || null
}

async function createArticle(article) {
  const articles = await readCollection("articles")
  articles.push(article)
  await writeCollection("articles", articles)
  return article
}

async function updateArticle(articleId, nextArticle) {
  const articles = await readCollection("articles")
  const index = articles.findIndex((article) => article.id === articleId)

  if (index === -1) {
    return null
  }

  articles[index] = nextArticle
  await writeCollection("articles", articles)
  return nextArticle
}

async function deleteArticle(articleId) {
  const articles = await readCollection("articles")
  const nextArticles = articles.filter((article) => article.id !== articleId)

  if (nextArticles.length === articles.length) {
    return false
  }

  await writeCollection("articles", nextArticles)
  return true
}

async function countArticles() {
  const articles = await readCollection("articles")
  return articles.length
}

module.exports = {
  countArticles,
  createArticle,
  deleteArticle,
  findArticleById,
  listArticles,
  updateArticle
}
