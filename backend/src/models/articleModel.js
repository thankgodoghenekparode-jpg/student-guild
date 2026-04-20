const { articleCategories } = require("../constants/articleCategories")
const { createId } = require("../database/fileStore")
const { sanitizeSlug, sanitizeText } = require("../utils/sanitize")
const { assertEnum, assertInteger, assertRequiredString, assertStringArray } = require("../utils/validation")

function normalizeArticleInput(payload, existingArticle = null) {
  const title = assertRequiredString(payload.title, "Article title", { maxLength: 140, allowNewLines: false })
  const now = new Date().toISOString()

  return {
    id: existingArticle?.id || createId("article"),
    slug: sanitizeSlug(payload.slug || title),
    title,
    category: assertEnum(payload.category, "Article category", articleCategories),
    summary: assertRequiredString(payload.summary, "Article summary", { maxLength: 200 }),
    content: assertStringArray(payload.content, "Article content", { minItems: 3, maxItems: 12, itemMaxLength: 240 }),
    imageUrl: sanitizeText(payload.imageUrl || "", { maxLength: 220, allowNewLines: false }),
    readTimeMinutes: assertInteger(payload.readTimeMinutes, "Read time", { min: 1, max: 30, fallback: 5 }),
    featured: Boolean(payload.featured),
    createdAt: existingArticle?.createdAt || now,
    updatedAt: now
  }
}

module.exports = { normalizeArticleInput }
