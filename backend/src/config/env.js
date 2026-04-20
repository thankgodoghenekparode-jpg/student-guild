const fs = require("node:fs")
const path = require("node:path")

const backendRoot = path.resolve(__dirname, "..", "..")
const envFile = path.join(backendRoot, ".env")

loadEnvFile(envFile)

const env = {
  port: Number(process.env.PORT || 5000),
  jwtSecret: process.env.JWT_SECRET || "student-career-guide-dev-secret-change-me",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  dataDir: path.join(backendRoot, ".data"),
  uploadsDir: path.join(backendRoot, "src", "uploads"),
  frontendOrigin: process.env.FRONTEND_ORIGIN || "http://127.0.0.1:5173",
  adminOrigin: process.env.ADMIN_ORIGIN || "http://127.0.0.1:5174",
  adminSeedEmail: String(process.env.ADMIN_SEED_EMAIL || "admin@studentguide.ng").trim().toLowerCase(),
  adminSeedPassword: String(process.env.ADMIN_SEED_PASSWORD || "Admin@12345")
}

env.allowedOrigins = Array.from(new Set([env.frontendOrigin, env.adminOrigin]))

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) {
    return
  }

  const lines = fs.readFileSync(filePath, "utf8").split(/\r?\n/)

  for (const line of lines) {
    const trimmedLine = line.trim()

    if (!trimmedLine || trimmedLine.startsWith("#")) {
      continue
    }

    const separatorIndex = trimmedLine.indexOf("=")

    if (separatorIndex === -1) {
      continue
    }

    const key = trimmedLine.slice(0, separatorIndex).trim()
    const value = trimmedLine.slice(separatorIndex + 1).trim()

    if (key && process.env[key] === undefined) {
      process.env[key] = value
    }
  }
}

module.exports = { env }
