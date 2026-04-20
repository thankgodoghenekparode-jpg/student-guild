const { createId } = require("../database/fileStore")
const { sanitizeSlug } = require("../utils/sanitize")
const {
  assertEnum,
  assertInteger,
  assertRequiredString,
  assertStringArray
} = require("../utils/validation")

function normalizeRecommendationSignals(rawSignals = {}) {
  return {
    strengths: assertStringArray(rawSignals.strengths || [], "Recommendation strengths", { maxItems: 6 }),
    interests: assertStringArray(rawSignals.interests || [], "Recommendation interests", { maxItems: 6 }),
    workStyles: assertStringArray(rawSignals.workStyles || [], "Recommendation work styles", { maxItems: 6 }),
    goals: assertStringArray(rawSignals.goals || [], "Recommendation goals", { maxItems: 6 }),
    studyPreferences: assertStringArray(rawSignals.studyPreferences || [], "Recommendation study preferences", {
      maxItems: 6
    })
  }
}

function normalizeCourseInput(payload, existingCourse = null) {
  const title = assertRequiredString(payload.title, "Course title", { maxLength: 120, allowNewLines: false })
  const now = new Date().toISOString()

  return {
    id: existingCourse?.id || createId("course"),
    slug: sanitizeSlug(payload.slug || title),
    title,
    institutionType: assertEnum(payload.institutionType, "Institution type", ["University", "Polytechnic"]),
    category: assertRequiredString(payload.category, "Category", { maxLength: 80, allowNewLines: false }),
    summary: assertRequiredString(payload.summary, "Summary", { maxLength: 180 }),
    overview: assertRequiredString(payload.overview, "Overview", { maxLength: 500 }),
    cutoffMark: assertInteger(payload.cutoffMark, "Cut-off mark", { min: 120, max: 320, fallback: 180 }),
    requiredSubjects: assertStringArray(payload.requiredSubjects, "Required subjects", { minItems: 4, maxItems: 6 }),
    jambCombination: assertStringArray(payload.jambCombination, "JAMB combination", { minItems: 4, maxItems: 4 }),
    careers: assertStringArray(payload.careers, "Possible careers", { minItems: 3, maxItems: 6 }),
    sideSkills: assertStringArray(payload.sideSkills, "Side skills", { minItems: 3, maxItems: 6 }),
    tags: assertStringArray(payload.tags, "Tags", { minItems: 2, maxItems: 8 }),
    recommendationSignals: normalizeRecommendationSignals(payload.recommendationSignals),
    createdAt: existingCourse?.createdAt || now,
    updatedAt: now
  }
}

module.exports = { normalizeCourseInput }
