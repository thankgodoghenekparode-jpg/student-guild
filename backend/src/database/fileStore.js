const fsp = require("node:fs/promises")
const path = require("node:path")
const bcrypt = require("bcryptjs")
const { Pool } = require("pg")
const { env } = require("../config/env")
const { seededArticles, seededCourses, seededDemoUser } = require("../data/seedData")
const { seededPracticeQuestions } = require("../data/practiceSeedData")

const collections = {
  users: "users.json",
  courses: "courses.json",
  articles: "articles.json",
  savedCourses: "saved-courses.json",
  practiceQuestions: "practice-questions.json",
  practiceAttempts: "practice-attempts.json"
}

let poolInstance = null
let storeReadyPromise = null

async function ensureDatabaseSeeded() {
  await ensureStoreReady()

  if (env.uploadBackend === "file" && !env.isVercel) {
    await fsp.mkdir(env.uploadsDir, { recursive: true })
    await fsp.mkdir(path.join(env.uploadsDir, "images"), { recursive: true })
  }

  await ensureCollectionDocument("courses", normalizeCourses(seededCourses))
  await ensureCollectionDocument("articles", normalizeArticles(seededArticles))
  await ensureCollectionDocument("savedCourses", [])
  await ensureCollectionDocument("practiceQuestions", normalizePracticeQuestions(seededPracticeQuestions))
  await ensureCollectionDocument("practiceAttempts", [])
  await ensureCollectionDocument("users", await buildSeedUsers())
  await ensureSeedUsers()
  await ensureSeedPracticeQuestions()
}

async function ensureStoreReady() {
  if (env.isVercel && env.databaseBackend === "file") {
    throw new Error("Configure DATABASE_URL before deploying the backend to Vercel.")
  }

  if (!storeReadyPromise) {
    if (env.databaseBackend === "supabase") {
      const { ensureSupabaseStoreReady } = require("./supabaseStore")
      storeReadyPromise = ensureSupabaseStoreReady()
    } else if (env.databaseBackend === "postgres") {
      storeReadyPromise = ensurePostgresStoreReady()
    } else {
      storeReadyPromise = ensureFileStoreReady()
    }
  }

  try {
    await storeReadyPromise
  } catch (error) {
    storeReadyPromise = null
    throw error
  }
}

async function ensurePostgresStoreReady() {
  await getPool().query(`
    CREATE TABLE IF NOT EXISTS app_collections (
      name TEXT PRIMARY KEY,
      payload JSONB NOT NULL DEFAULT '[]'::jsonb,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `)
}

async function ensureFileStoreReady() {
  await fsp.mkdir(env.dataDir, { recursive: true })
}

async function ensureCollectionDocument(collectionName, seedValue) {
  await ensureStoreReady()
  assertKnownCollection(collectionName)

  if (env.databaseBackend === "supabase") {
    const { ensureSupabaseCollectionDocument } = require("./supabaseStore")
    await ensureSupabaseCollectionDocument(collectionName, seedValue)
    return
  }

  if (env.databaseBackend === "postgres") {
    await getPool().query(
      `
        INSERT INTO app_collections (name, payload)
        VALUES ($1, $2::jsonb)
        ON CONFLICT (name) DO NOTHING
      `,
      [collectionName, JSON.stringify(seedValue)]
    )
    return
  }

  const filePath = getCollectionFile(collectionName)

  try {
    await fsp.access(filePath)
  } catch {
    await writeCollection(collectionName, seedValue)
  }
}

function getCollectionFile(collectionName) {
  assertKnownCollection(collectionName)
  return path.join(env.dataDir, collections[collectionName])
}

async function readCollection(collectionName) {
  await ensureStoreReady()
  assertKnownCollection(collectionName)

  if (env.databaseBackend === "supabase") {
    const { supabaseQuery } = require("./supabaseStore")
    return supabaseQuery(collectionName)
  }

  if (env.databaseBackend === "postgres") {
    const result = await getPool().query(
      `
        SELECT payload
        FROM app_collections
        WHERE name = $1
        LIMIT 1
      `,
      [collectionName]
    )

    const payload = result.rows[0]?.payload
    return Array.isArray(payload) ? payload : []
  }

  const filePath = getCollectionFile(collectionName)
  const raw = await fsp.readFile(filePath, "utf8")

  try {
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

async function writeCollection(collectionName, data) {
  await ensureStoreReady()
  assertKnownCollection(collectionName)

  if (env.databaseBackend === "supabase") {
    // For Supabase, individual operations should use supabaseInsert/Update/Delete
    // This function is mainly for file/postgres collection storage
    console.warn(`writeCollection not implemented for Supabase backend: ${collectionName}`)
    return
  }

  if (env.databaseBackend === "postgres") {
    await getPool().query(
      `
        INSERT INTO app_collections (name, payload, updated_at)
        VALUES ($1, $2::jsonb, NOW())
        ON CONFLICT (name)
        DO UPDATE SET
          payload = EXCLUDED.payload,
          updated_at = NOW()
      `,
      [collectionName, JSON.stringify(data)]
    )
    return
  }

  const filePath = getCollectionFile(collectionName)
  await fsp.writeFile(filePath, `${JSON.stringify(data, null, 2)}\n`, "utf8")
}

function createId(prefix) {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36)}`
}

function normalizeCourses(courses) {
  return courses.map((course) => ({
    id: createId("course"),
    slug: course.title
      .toLowerCase()
      .replace(/&/g, "and")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, ""),
    title: course.title,
    institutionType: course.institutionType,
    category: course.category,
    summary: course.summary,
    overview: course.overview,
    cutoffMark: course.cutoffMark,
    requiredSubjects: course.requiredSubjects,
    jambCombination: course.jambCombination,
    careers: course.careers,
    sideSkills: course.sideSkills,
    tags: course.tags,
    recommendationSignals: course.recommendationSignals,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }))
}

function normalizeArticles(articles) {
  return articles.map((article) => ({
    id: createId("article"),
    slug: article.title
      .toLowerCase()
      .replace(/&/g, "and")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, ""),
    title: article.title,
    category: article.category,
    summary: article.summary,
    content: article.content,
    imageUrl: article.imageUrl,
    readTimeMinutes: article.readTimeMinutes,
    featured: article.featured,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }))
}

function normalizePracticeQuestions(questions) {
  return questions.map((question) => ({
    id: createId("practice"),
    seedKey: getPracticeSeedKey(question),
    examType: question.examType,
    subject: question.subject,
    topic: question.topic,
    year: question.year,
    prompt: question.prompt,
    options: question.options,
    correctOption: question.correctOption,
    explanation: question.explanation,
    createdAt: new Date().toISOString()
  }))
}

function getPracticeSeedKey(question) {
  return [
    String(question.examType || "").toLowerCase().trim(),
    String(question.subject || "").toLowerCase().trim(),
    String(question.year || "").toLowerCase().trim(),
    String(question.prompt || "").toLowerCase().trim()
  ].join("::")
}

async function buildSeedUsers() {
  const now = new Date().toISOString()
  const adminPasswordHash = await bcrypt.hash(env.adminSeedPassword, 10)
  const demoPasswordHash = await bcrypt.hash(seededDemoUser.password, 10)

  return [
    {
      id: createId("user"),
      name: "Platform Admin",
      email: env.adminSeedEmail,
      passwordHash: adminPasswordHash,
      role: "admin",
      createdAt: now,
      updatedAt: now
    },
    {
      id: createId("user"),
      name: seededDemoUser.name,
      email: seededDemoUser.email,
      passwordHash: demoPasswordHash,
      role: seededDemoUser.role,
      createdAt: now,
      updatedAt: now
    }
  ]
}

async function ensureSeedUsers() {
  const users = await readCollection("users")
  const seedUsers = await buildSeedUsers()
  const existingEmails = new Set(users.map((user) => String(user.email || "").toLowerCase()))
  let changed = false

  for (const seedUser of seedUsers) {
    if (!existingEmails.has(seedUser.email)) {
      users.push(seedUser)
      changed = true
    }
  }

  if (changed) {
    await writeCollection("users", users)
  }
}

async function ensureSeedPracticeQuestions() {
  const practiceQuestions = await readCollection("practiceQuestions")
  const seedQuestions = normalizePracticeQuestions(seededPracticeQuestions)
  const existingKeys = new Set(
    practiceQuestions.map((question) => question.seedKey || getPracticeSeedKey(question))
  )
  let changed = false

  for (const seedQuestion of seedQuestions) {
    if (!existingKeys.has(seedQuestion.seedKey)) {
      practiceQuestions.push(seedQuestion)
      existingKeys.add(seedQuestion.seedKey)
      changed = true
    }
  }

  if (changed) {
    await writeCollection("practiceQuestions", practiceQuestions)
  }
}

function getPool() {
  if (!env.databaseUrl) {
    throw new Error("DATABASE_URL is required when DATABASE_PROVIDER is set to postgres.")
  }

  if (!poolInstance) {
    poolInstance = new Pool({
      connectionString: env.databaseUrl,
      ssl: env.databaseSsl ? { rejectUnauthorized: false } : undefined
    })
  }

  return poolInstance
}

function assertKnownCollection(collectionName) {
  if (!collections[collectionName]) {
    throw new Error(`Unknown collection: ${collectionName}`)
  }
}

module.exports = {
  createId,
  ensureDatabaseSeeded,
  readCollection,
  writeCollection
}
