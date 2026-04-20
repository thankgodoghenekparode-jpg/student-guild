function sanitizeText(value, { fallback = "", maxLength = 500, allowNewLines = true } = {}) {
  const normalized = String(value ?? fallback)
    .replace(/[<>]/g, "")
    .replace(/\u0000/g, "")

  const collapsed = allowNewLines
    ? normalized.replace(/\r/g, "")
    : normalized.replace(/\s+/g, " ")

  return collapsed.trim().slice(0, maxLength)
}

function sanitizeSlug(value) {
  return sanitizeText(value, { maxLength: 120, allowNewLines: false })
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

function sanitizeStringArray(value, { maxItems = 12, itemMaxLength = 80 } = {}) {
  if (!Array.isArray(value)) {
    return []
  }

  return Array.from(
    new Set(
      value
        .map((item) => sanitizeText(item, { maxLength: itemMaxLength, allowNewLines: false }))
        .filter(Boolean)
    )
  ).slice(0, maxItems)
}

function sanitizeInteger(value, { min = 0, max = Number.MAX_SAFE_INTEGER, fallback = 0 } = {}) {
  const parsed = Number.parseInt(value, 10)

  if (!Number.isFinite(parsed)) {
    return fallback
  }

  return Math.min(max, Math.max(min, parsed))
}

function sanitizeQuery(value) {
  return sanitizeText(value, { maxLength: 120, allowNewLines: false }).toLowerCase()
}

module.exports = {
  sanitizeInteger,
  sanitizeQuery,
  sanitizeSlug,
  sanitizeStringArray,
  sanitizeText
}
