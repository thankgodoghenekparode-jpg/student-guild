const { findUserById } = require("../database/repositories/userRepository")
const { verifyAccessToken } = require("../services/authService")
const { createHttpError } = require("../utils/errors")

async function requireAuth(request, response, next) {
  const authorization = request.headers.authorization

  if (!authorization?.startsWith("Bearer ")) {
    next(createHttpError(401, "Authentication required."))
    return
  }

  const token = authorization.slice("Bearer ".length).trim()
  const payload = verifyAccessToken(token)
  const user = await findUserById(payload.sub)

  if (!user) {
    next(createHttpError(401, "Session is no longer valid."))
    return
  }

  request.user = user
  next()
}

module.exports = { requireAuth }
