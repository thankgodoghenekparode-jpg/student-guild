const express = require("express")
const cors = require("cors")
const helmet = require("helmet")
const path = require("node:path")
const { env } = require("./config/env")
const { apiRouter } = require("./routes")
const { notFoundHandler } = require("./middleware/notFoundHandler")
const { errorHandler } = require("./middleware/errorHandler")

function createApp() {
  const app = express()

  app.use(
    cors({
      origin(origin, callback) {
        if (!origin || env.allowedOrigins.includes(origin)) {
          callback(null, true)
          return
        }

        callback(new Error("Origin not allowed by CORS policy."))
      }
    })
  )

  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: "cross-origin" }
    })
  )
  app.use(express.json({ limit: "1mb" }))
  app.use(express.urlencoded({ extended: true }))

  if (env.uploadBackend === "file" && !env.isVercel) {
    app.use("/uploads", express.static(path.join(env.uploadsDir)))
  }

  app.get("/api/health", (request, response) => {
    response.json({
      status: "ok",
      storage: env.databaseBackend,
      uploads: env.uploadBackend,
      timestamp: new Date().toISOString()
    })
  })

  app.use("/api", apiRouter)
  app.use(notFoundHandler)
  app.use(errorHandler)

  return app
}

module.exports = { createApp }
