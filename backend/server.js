const http = require("node:http")
const fs = require("node:fs")
const fsp = require("node:fs/promises")
const path = require("node:path")
const crypto = require("node:crypto")
const { URL } = require("node:url")

const ROOT_DIR = __dirname
const ENV_FILE = path.join(ROOT_DIR, ".env")
const DATA_DIR = path.join(ROOT_DIR, ".data")
const USERS_FILE = path.join(DATA_DIR, "users.json")

loadEnvFile(ENV_FILE)

const PORT = Number(process.env.PORT || 5000)
const JWT_SECRET = process.env.JWT_SECRET || "student-career-guide-dev-secret"
const TOKEN_TTL_SECONDS = 60 * 60 * 24 * 7

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

function base64UrlEncode(value) {
  return Buffer.from(JSON.stringify(value)).toString("base64url")
}

function createToken(user) {
  const header = base64UrlEncode({ alg: "HS256", typ: "JWT" })
  const payload = base64UrlEncode({
    sub: user.id,
    email: user.email,
    name: user.name,
    exp: Math.floor(Date.now() / 1000) + TOKEN_TTL_SECONDS
  })
  const signature = crypto
    .createHmac("sha256", JWT_SECRET)
    .update(`${header}.${payload}`)
    .digest("base64url")

  return `${header}.${payload}.${signature}`
}

function verifyToken(authorizationHeader) {
  if (!authorizationHeader?.startsWith("Bearer ")) {
    return null
  }

  const token = authorizationHeader.slice("Bearer ".length).trim()
  const [header, payload, signature] = token.split(".")

  if (!header || !payload || !signature) {
    return null
  }

  const expectedSignature = crypto
    .createHmac("sha256", JWT_SECRET)
    .update(`${header}.${payload}`)
    .digest("base64url")

  if (signature !== expectedSignature) {
    return null
  }

  try {
    const decodedPayload = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"))

    if (decodedPayload.exp <= Math.floor(Date.now() / 1000)) {
      return null
    }

    return decodedPayload
  } catch {
    return null
  }
}

function withCorsHeaders(request, headers = {}) {
  return {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": request.headers.origin || "*",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    Vary: "Origin",
    ...headers
  }
}

function sendJson(request, response, statusCode, payload) {
  response.writeHead(statusCode, withCorsHeaders(request))
  response.end(JSON.stringify(payload))
}

function sendError(request, response, statusCode, message) {
  sendJson(request, response, statusCode, { message })
}

function createHttpError(statusCode, message) {
  const error = new Error(message)
  error.statusCode = statusCode
  return error
}

async function ensureUserStore() {
  await fsp.mkdir(DATA_DIR, { recursive: true })

  try {
    await fsp.access(USERS_FILE)
  } catch {
    await fsp.writeFile(USERS_FILE, "[]\n", "utf8")
  }
}

async function readUsers() {
  await ensureUserStore()
  const raw = await fsp.readFile(USERS_FILE, "utf8")

  try {
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

async function writeUsers(users) {
  await ensureUserStore()
  await fsp.writeFile(USERS_FILE, `${JSON.stringify(users, null, 2)}\n`, "utf8")
}

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase()
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function hashPassword(password, salt = crypto.randomBytes(16).toString("hex")) {
  const hash = crypto.scryptSync(password, salt, 64).toString("hex")
  return `${salt}:${hash}`
}

function verifyPassword(password, storedHash) {
  const [salt, expectedHash] = String(storedHash || "").split(":")

  if (!salt || !expectedHash) {
    return false
  }

  const actualHash = crypto.scryptSync(password, salt, 64).toString("hex")

  try {
    return crypto.timingSafeEqual(Buffer.from(expectedHash, "hex"), Buffer.from(actualHash, "hex"))
  } catch {
    return false
  }
}

function sanitizeUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt
  }
}

function parseBody(request) {
  return new Promise((resolve, reject) => {
    const chunks = []
    let size = 0

    request.on("data", (chunk) => {
      size += chunk.length

      if (size > 1_000_000) {
        reject(createHttpError(413, "Request body too large."))
        request.destroy()
        return
      }

      chunks.push(chunk)
    })

    request.on("end", () => {
      if (size === 0) {
        resolve({})
        return
      }

      try {
        resolve(JSON.parse(Buffer.concat(chunks).toString("utf8")))
      } catch {
        reject(createHttpError(400, "Invalid JSON body."))
      }
    })

    request.on("error", reject)
  })
}

async function handleRegister(request, response) {
  const body = await parseBody(request)
  const name = String(body.name || "").trim() || "Student"
  const email = normalizeEmail(body.email)
  const password = String(body.password || "")

  if (!isValidEmail(email)) {
    throw createHttpError(400, "Please enter a valid email address.")
  }

  if (password.length < 6) {
    throw createHttpError(400, "Password must be at least 6 characters long.")
  }

  const users = await readUsers()

  if (users.some((user) => user.email === email)) {
    throw createHttpError(409, "User with that email already exists.")
  }

  const newUser = {
    id: crypto.randomUUID(),
    name,
    email,
    passwordHash: hashPassword(password),
    createdAt: new Date().toISOString()
  }

  users.push(newUser)
  await writeUsers(users)

  sendJson(request, response, 201, {
    token: createToken(newUser),
    user: sanitizeUser(newUser)
  })
}

async function handleLogin(request, response) {
  const body = await parseBody(request)
  const email = normalizeEmail(body.email)
  const password = String(body.password || "")

  if (!email || !password) {
    throw createHttpError(400, "Email and password are required.")
  }

  const users = await readUsers()
  const foundUser = users.find((user) => user.email === email)

  if (!foundUser || !verifyPassword(password, foundUser.passwordHash)) {
    throw createHttpError(401, "Invalid email or password.")
  }

  sendJson(request, response, 200, {
    token: createToken(foundUser),
    user: sanitizeUser(foundUser)
  })
}

async function handleCurrentUser(request, response) {
  const payload = verifyToken(request.headers.authorization)

  if (!payload?.sub) {
    throw createHttpError(401, "Authentication required.")
  }

  const users = await readUsers()
  const foundUser = users.find((user) => user.id === payload.sub)

  if (!foundUser) {
    throw createHttpError(401, "Session is no longer valid.")
  }

  sendJson(request, response, 200, {
    user: sanitizeUser(foundUser)
  })
}

const server = http.createServer(async (request, response) => {
  if (!request.url || !request.method) {
    sendError(request, response, 400, "Invalid request.")
    return
  }

  if (request.method === "OPTIONS") {
    response.writeHead(204, withCorsHeaders(request))
    response.end()
    return
  }

  try {
    const requestUrl = new URL(request.url, `http://${request.headers.host || `127.0.0.1:${PORT}`}`)

    if (request.method === "GET" && requestUrl.pathname === "/api/health") {
      sendJson(request, response, 200, {
        status: "ok",
        storage: "file",
        timestamp: new Date().toISOString()
      })
      return
    }

    if (request.method === "POST" && requestUrl.pathname === "/api/auth/register") {
      await handleRegister(request, response)
      return
    }

    if (request.method === "POST" && requestUrl.pathname === "/api/auth/login") {
      await handleLogin(request, response)
      return
    }

    if (request.method === "GET" && requestUrl.pathname === "/api/auth/me") {
      await handleCurrentUser(request, response)
      return
    }

    sendError(request, response, 404, "Route not found.")
  } catch (error) {
    const statusCode = error.statusCode || 500

    if (statusCode >= 500) {
      console.error("[backend]", error)
    }

    sendError(
      request,
      response,
      statusCode,
      statusCode >= 500 ? "Internal server error." : error.message
    )
  }
})

server.listen(PORT, () => {
  console.log(`[backend] API listening on http://localhost:${PORT}`)
})
