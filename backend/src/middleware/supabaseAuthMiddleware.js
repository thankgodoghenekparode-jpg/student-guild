const { createHttpError } = require("../utils/errors")
const { supabaseQuery } = require("../database/supabaseStore")
const { verifySupabaseToken } = require("./authStrategy")

// Middleware to authenticate Supabase users
async function requireSupabaseAuth(request, response, next) {
  try {
    const authHeader = request.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw createHttpError(401, "Authorization header required")
    }

    const token = authHeader.substring(7)
    const user = await verifySupabaseToken(token)

    if (!user) {
      throw createHttpError(401, "Invalid or expired token")
    }

    try {
      const existingUsers = await supabaseQuery('users', { where: { id: user.id } })

      if (!existingUsers || existingUsers.length === 0) {
        await supabaseQuery('users', 'insert', {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
      }
    } catch (dbError) {
      console.error('Database sync error:', dbError)
    }

    request.user = user
    next()
  } catch (error) {
    next(error)
  }
}

module.exports = {
  requireSupabaseAuth
}
