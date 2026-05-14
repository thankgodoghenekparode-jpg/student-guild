const jwt = require("jsonwebtoken")
const { createClient } = require("@supabase/supabase-js")
const { env } = require("../config/env")

function isSupabaseEnabled() {
  return Boolean(env.supabaseUrl && env.supabaseServiceRoleKey)
}

function createSupabaseClient() {
  if (!isSupabaseEnabled()) {
    throw new Error("Supabase is not configured.")
  }

  return createClient(env.supabaseUrl, env.supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
}

function decodeSupabaseToken(token) {
  if (!token) {
    return null
  }

  const payload = jwt.decode(token)
  if (!payload || typeof payload !== "object") {
    return null
  }

  return payload
}

async function verifySupabaseToken(token) {
  if (!isSupabaseEnabled()) {
    return null
  }

  const payload = decodeSupabaseToken(token)

  if (
    !payload ||
    !payload.sub ||
    !payload.email ||
    !payload.iss ||
    !String(payload.iss).includes("supabase")
  ) {
    return null
  }

  return {
    id: payload.sub,
    email: payload.email,
    name: payload.user_metadata?.name || payload.email.split("@")[0] || "User",
    role: payload.user_metadata?.role || "student"
  }
}

function getSupabaseStorageClient() {
  const client = createSupabaseClient()

  if (!env.supabaseStorageBucket) {
    throw new Error("SUPABASE_STORAGE_BUCKET must be configured to use Supabase uploads.")
  }

  return client
}

module.exports = {
  createSupabaseClient,
  decodeSupabaseToken,
  getSupabaseStorageClient,
  isSupabaseEnabled,
  verifySupabaseToken
}
