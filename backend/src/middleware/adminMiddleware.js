const { USER_ROLES } = require("../constants/userRoles")
const { createHttpError } = require("../utils/errors")

function requireAdmin(request, response, next) {
  if (request.user?.role !== USER_ROLES.ADMIN) {
    next(createHttpError(403, "Admin access is required."))
    return
  }

  next()
}

module.exports = { requireAdmin }
