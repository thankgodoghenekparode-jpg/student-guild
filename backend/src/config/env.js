const fs = require("node:fs")
const path = require("node:path")

const backendRoot = path.resolve(__dirname, "..", "..")
const envFile = path.join(backendRoot, ".env")

loadEnvFile(envFile)

const env = {
  port: Number(process.env.PORT || 5000),
  nodeEnv: process.env.NODE_ENV || "development",
  isVercel: process.env.VERCEL === "1" || Boolean(process.env.VERCEL_URL),
  jwtSecret: process.env.JWT_SECRET || "student-career-guide-dev-secret-change-me",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  dataDir: path.join(backendRoot, ".data"),
  uploadsDir: path.join(backendRoot, "src", "uploads"),
  databaseProvider: String(process.env.DATABASE_PROVIDER || "auto").trim().toLowerCase(),
  databaseUrl: String(process.env.DATABASE_URL || process.env.POSTGRES_URL || "").trim(),
  databaseSsl: String(process.env.DATABASE_SSL || "false").trim().toLowerCase() === "true",
  uploadProvider: String(process.env.UPLOAD_PROVIDER || "auto").trim().toLowerCase(),
  blobReadWriteToken: String(process.env.BLOB_READ_WRITE_TOKEN || "").trim(),
  openaiApiKey: String(process.env.OPENAI_API_KEY || "").trim(),
  supabaseUrl: String(process.env.SUPABASE_URL || "").trim(),
  supabaseServiceRoleKey: String(process.env.SUPABASE_SERVICE_ROLE_KEY || "").trim(),
  frontendOrigin: process.env.FRONTEND_ORIGIN || "http://127.0.0.1:5173",
  adminOrigin: process.env.ADMIN_ORIGIN || "http://127.0.0.1:5174",
  additionalAllowedOrigins: process.env.ALLOWED_ORIGINS || "",
  adminSeedEmail: String(process.env.ADMIN_SEED_EMAIL || "admin@studentguide.ng").trim().toLowerCase(),
  adminSeedPassword: String(process.env.ADMIN_SEED_PASSWORD || "Admin@12345")
}

env.databaseBackend = resolveDatabaseBackend(env)
env.uploadBackend = resolveUploadBackend(env)
env.allowedOrigins = buildAllowedOrigins([
  env.frontendOrigin,
  env.adminOrigin,
  env.additionalAllowedOrigins
])

function buildAllowedOrigins(entries) {
  return Array.from(
    new Set(
      entries
        .flatMap((entry) => String(entry || "").split(","))
        .map((entry) => entry.trim())
        .filter(Boolean)
    )
  )
}

function resolveDatabaseBackend(currentEnv) {
  if (currentEnv.databaseProvider === "supabase") {
    return "supabase"
  }

  if (currentEnv.databaseProvider === "postgres") {
    return "postgres"
  }

  if (currentEnv.databaseProvider === "file") {
    return "file"
  }

  // Auto-detect based on available credentials
  if (currentEnv.supabaseUrl && currentEnv.supabaseServiceRoleKey) {
    return "supabase"
  }

  return currentEnv.databaseUrl ? "postgres" : "file"
}

function resolveUploadBackend(currentEnv) {
  if (currentEnv.uploadProvider === "blob") {
    return "blob"
  }

  if (currentEnv.uploadProvider === "file") {
    return "file"
  }

  return currentEnv.blobReadWriteToken ? "blob" : "file"
}

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
