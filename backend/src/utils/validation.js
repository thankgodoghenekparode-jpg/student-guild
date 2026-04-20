const { createHttpError } = require("./errors")
const { sanitizeInteger, sanitizeStringArray, sanitizeText } = require("./sanitize")

function assertRequiredString(value, fieldName, options = {}) {
  const sanitized = sanitizeText(value, options)

  if (!sanitized) {
    throw createHttpError(400, `${fieldName} is required.`)
  }

  return sanitized
}

function assertEmail(value, fieldName = "Email") {
  const email = sanitizeText(value, { maxLength: 120, allowNewLines: false }).toLowerCase()

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw createHttpError(400, `${fieldName} must be a valid email address.`)
  }

  return email
}

function assertPassword(value) {
  const password = String(value || "")

  if (password.length < 8) {
    throw createHttpError(400, "Password must be at least 8 characters long.")
  }

  return password
}

function assertEnum(value, fieldName, allowedValues) {
  if (!allowedValues.includes(value)) {
    throw createHttpError(400, `${fieldName} must be one of: ${allowedValues.join(", ")}.`)
  }

  return value
}

function assertInteger(value, fieldName, options) {
  const parsed = sanitizeInteger(value, options)

  if (!Number.isFinite(parsed)) {
    throw createHttpError(400, `${fieldName} must be a valid number.`)
  }

  return parsed
}

function assertStringArray(value, fieldName, options = {}) {
  const result = sanitizeStringArray(value, options)

  if (options.minItems && result.length < options.minItems) {
    throw createHttpError(400, `${fieldName} must include at least ${options.minItems} items.`)
  }

  return result
}

module.exports = {
  assertEmail,
  assertEnum,
  assertInteger,
  assertPassword,
  assertRequiredString,
  assertStringArray
}
