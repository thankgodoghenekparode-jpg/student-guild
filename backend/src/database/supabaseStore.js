const { createClient } = require('@supabase/supabase-js')
const { env } = require("../config/env")

let supabaseInstance = null

function getSupabase() {
  if (!supabaseInstance) {
    if (!env.supabaseUrl || !env.supabaseServiceRoleKey) {
      throw new Error("Supabase credentials not configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY")
    }

    supabaseInstance = createClient(env.supabaseUrl, env.supabaseServiceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  }

  return supabaseInstance
}

async function ensureSupabaseStoreReady() {
  const supabase = getSupabase()

  // Test connection
  const { error } = await supabase.from('users').select('count').limit(1).single()
  if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned"
    throw new Error(`Supabase connection failed: ${error.message}`)
  }

  console.log('[database] Connected to Supabase')
}

async function ensureSupabaseCollectionDocument(collectionName, seedValue) {
  const supabase = getSupabase()

  // Check if collection exists and has data
  const { data, error } = await supabase
    .from(collectionName)
    .select('*')
    .limit(1)

  if (error) {
    console.warn(`[database] Table '${collectionName}' may not exist or is not accessible: ${error.message}`)
    return
  }

  if (data && data.length > 0) {
    // Data already exists
    return
  }

  // Seed data if table is empty
  if (Array.isArray(seedValue) && seedValue.length > 0) {
    const { error: insertError } = await supabase
      .from(collectionName)
      .insert(seedValue)

    if (insertError) {
      console.warn(`[database] Failed to seed '${collectionName}': ${insertError.message}`)
    } else {
      console.log(`[database] Seeded ${seedValue.length} records in '${collectionName}'`)
    }
  }
}

async function supabaseQuery(collectionName, query = {}) {
  const supabase = getSupabase()
  let supabaseQuery = supabase.from(collectionName)

  // Apply filters
  if (query.where) {
    Object.entries(query.where).forEach(([key, value]) => {
      if (typeof value === 'object' && value !== null) {
        if (value.$in) {
          supabaseQuery = supabaseQuery.in(key, value.$in)
        } else if (value.$contains) {
          supabaseQuery = supabaseQuery.contains(key, value.$contains)
        } else if (value.$eq) {
          supabaseQuery = supabaseQuery.eq(key, value.$eq)
        }
      } else {
        supabaseQuery = supabaseQuery.eq(key, value)
      }
    })
  }

  // Apply sorting
  if (query.sort) {
    Object.entries(query.sort).forEach(([key, direction]) => {
      supabaseQuery = supabaseQuery.order(key, { ascending: direction === 1 })
    })
  }

  // Apply pagination
  if (query.skip) {
    supabaseQuery = supabaseQuery.range(query.skip, (query.skip + (query.limit || 10)) - 1)
  } else if (query.limit) {
    supabaseQuery = supabaseQuery.limit(query.limit)
  }

  const { data, error } = await supabaseQuery.select('*')

  if (error) {
    throw new Error(`Database query failed: ${error.message}`)
  }

  return data || []
}

async function supabaseInsert(collectionName, document) {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from(collectionName)
    .insert(document)
    .select()
    .single()

  if (error) {
    throw new Error(`Database insert failed: ${error.message}`)
  }

  return data
}

async function supabaseUpdate(collectionName, query, update) {
  const supabase = getSupabase()
  let supabaseQuery = supabase.from(collectionName)

  // Apply filters for update
  if (query.where) {
    Object.entries(query.where).forEach(([key, value]) => {
      if (typeof value === 'object' && value !== null) {
        if (value.$in) {
          supabaseQuery = supabaseQuery.in(key, value.$in)
        } else if (value.$eq) {
          supabaseQuery = supabaseQuery.eq(key, value.$eq)
        }
      } else {
        supabaseQuery = supabaseQuery.eq(key, value)
      }
    })
  }

  const { data, error } = await supabaseQuery
    .update(update)
    .select()

  if (error) {
    throw new Error(`Database update failed: ${error.message}`)
  }

  return data
}

async function supabaseDelete(collectionName, query) {
  const supabase = getSupabase()
  let supabaseQuery = supabase.from(collectionName)

  // Apply filters for delete
  if (query.where) {
    Object.entries(query.where).forEach(([key, value]) => {
      if (typeof value === 'object' && value !== null) {
        if (value.$in) {
          supabaseQuery = supabaseQuery.in(key, value.$in)
        } else if (value.$eq) {
          supabaseQuery = supabaseQuery.eq(key, value.$eq)
        }
      } else {
        supabaseQuery = supabaseQuery.eq(key, value)
      }
    })
  }

  const { error } = await supabaseQuery.delete()

  if (error) {
    throw new Error(`Database delete failed: ${error.message}`)
  }
}

module.exports = {
  ensureSupabaseStoreReady,
  ensureSupabaseCollectionDocument,
  supabaseQuery,
  supabaseInsert,
  supabaseUpdate,
  supabaseDelete
}