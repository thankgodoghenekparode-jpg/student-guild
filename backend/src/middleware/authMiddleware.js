const { findUserById } = require("../database/repositories/userRepository")
const { verifyAccessToken } = require("../services/authService")
const { createHttpError } = require("../utils/errors")
const { verifySupabaseToken, isSupabaseEnabled } = require("./authStrategy")

async function requireAuth(request, response, next) {
  const authorization = request.headers.authorization

  if (!authorization?.startsWith("Bearer ")) {
    next(createHttpError(401, "Authentication required."))
    return
  }

  const token = authorization.slice("Bearer ".length).trim()
  let user = null

  if (isSupabaseEnabled()) {
    user = await verifySupabaseToken(token)
  }

  if (!user) {
    const payload = verifyAccessToken(token)
    user = await findUserById(payload.sub)

    if (!user) {
      next(createHttpError(401, "Session is no longer valid."))
      return
    }
  }

  request.user = user
  next()
}

module.exports = { requireAuth }
