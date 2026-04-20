const { USER_ROLES } = require("../constants/userRoles")
const { createId } = require("../database/fileStore")
const { assertEmail, assertPassword, assertRequiredString } = require("../utils/validation")

function normalizeRegisterInput(payload) {
  return {
    id: createId("user"),
    name: assertRequiredString(payload.name || "Student", "Name", { maxLength: 80, allowNewLines: false }),
    email: assertEmail(payload.email),
    password: assertPassword(payload.password),
    role: USER_ROLES.STUDENT,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
}

function normalizeLoginInput(payload) {
  return {
    email: assertEmail(payload.email),
    password: assertPassword(payload.password)
  }
}

module.exports = {
  normalizeLoginInput,
  normalizeRegisterInput
}
