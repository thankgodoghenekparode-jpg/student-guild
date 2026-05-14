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

  const responseBody = {
    message: statusCode >= 500 ? "Internal server error." : error.message,
    details: error.details || undefined
  }

  if (process.env.NODE_ENV !== "production" && statusCode >= 500) {
    responseBody.error = {
      message: error.message,
      stack: error.stack
    }
  }

  response.status(statusCode).json(responseBody)
}

module.exports = { errorHandler }
