const { HttpError } = require("../utils/errors")

function errorHandler(error, request, response, next) {
  if (response.headersSent) {
    next(error)
    return
  }

  const statusCode = error instanceof HttpError ? error.statusCode : 500

  if (statusCode >= 500) {
    console.error("[backend]", error)
  }

  response.status(statusCode).json({
    message: statusCode >= 500 ? "Internal server error." : error.message,
    details: error.details || undefined
  })
}

module.exports = { errorHandler }
