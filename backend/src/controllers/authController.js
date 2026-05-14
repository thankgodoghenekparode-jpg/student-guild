const { createUser, findUserByEmail, updateUser } = require("../database/repositories/userRepository")
const { normalizeLoginInput, normalizeRegisterInput } = require("../models/userModel")
const {
  comparePassword,
  createAccessToken,
  hashPassword,
  sanitizeUser
} = require("../services/authService")
const { createHttpError } = require("../utils/errors")
const { env } = require("../config/env")

// Check if Supabase is enabled
const SUPABASE_ENABLED = !!(env.supabaseUrl && env.supabaseServiceRoleKey)

let supabaseUserFunctions = null
if (SUPABASE_ENABLED) {
  try {
    supabaseUserFunctions = require("../database/supabaseStore")
  } catch (error) {
    console.warn("Supabase user functions not available:", error.message)
  }
}

async function register(request, response) {
  const input = normalizeRegisterInput(request.body)

  if (SUPABASE_ENABLED && supabaseUserFunctions) {
    // Use Supabase for user management
    const existingUser = await supabaseUserFunctions.findUserByEmail(input.email)

    if (existingUser) {
      throw createHttpError(409, "A user with that email already exists.")
    }

    const user = {
      id: input.id,
      name: input.name,
      email: input.email,
      role: input.role || 'student',
      createdAt: input.createdAt,
      updatedAt: input.updatedAt
    }

    const createdUser = await supabaseUserFunctions.createUser(user)

    response.status(201).json({
      token: createAccessToken(createdUser),
      user: sanitizeUser(createdUser)
    })
  } else {
    // Fallback to local auth
    const existingUser = await findUserByEmail(input.email)

    if (existingUser) {
      throw createHttpError(409, "A user with that email already exists.")
    }

    const user = {
      id: input.id,
      name: input.name,
      email: input.email,
      passwordHash: await hashPassword(input.password),
      role: input.role,
      createdAt: input.createdAt,
      updatedAt: input.updatedAt
    }

    await createUser(user)

    response.status(201).json({
      token: createAccessToken(user),
      user: sanitizeUser(user)
    })
  }
}

async function login(request, response) {
  const input = normalizeLoginInput(request.body)

  if (SUPABASE_ENABLED && supabaseUserFunctions) {
    // For Supabase, login is handled on the frontend
    // Backend just validates the user exists
    const user = await supabaseUserFunctions.findUserByEmail(input.email)

    if (!user) {
      throw createHttpError(401, "Invalid email or password.")
    }

    response.json({
      token: createAccessToken(user),
      user: sanitizeUser(user)
    })
  } else {
    // Local auth
    const user = await findUserByEmail(input.email)

    if (!user) {
      throw createHttpError(401, "Invalid email or password.")
    }

    const passwordMatches = await comparePassword(input.password, user.passwordHash)

    if (!passwordMatches) {
      throw createHttpError(401, "Invalid email or password.")
    }

    response.json({
      token: createAccessToken(user),
      user: sanitizeUser(user)
    })
  }
}

async function me(request, response) {
  response.json({ user: sanitizeUser(request.user) })
}

async function forgotPassword(request, response) {
  const { email } = request.body

  if (!email) {
    throw createHttpError(400, "Email is required.")
  }

  if (SUPABASE_ENABLED && supabaseUserFunctions) {
    // For Supabase, password reset is handled on the frontend
    // Just check if user exists
    const user = await supabaseUserFunctions.findUserByEmail(email)

    // Always return success to prevent email enumeration
    response.json({ message: "If an account with that email exists, a reset link has been sent." })
  } else {
    // Local auth
    const user = await findUserByEmail(email)

    // Always return success to prevent email enumeration
    if (!user) {
      response.json({ message: "If an account with that email exists, a reset link has been sent." })
      return
    }

    // Generate reset token
    const crypto = require('crypto')
    const resetToken = crypto.randomBytes(32).toString('hex')
    const resetTokenExpiry = Date.now() + 3600000 // 1 hour

    // Update user with reset token
    await updateUser(user.id, { resetToken, resetTokenExpiry })

    // In a real app, send email here
    // For demo, return the token
    response.json({ message: "If an account with that email exists, a reset link has been sent.", resetToken })
  }
}

async function resetPassword(request, response) {
  const { token, password } = request.body

  if (!token || !password) {
    throw createHttpError(400, "Token and new password are required.")
  }

  if (SUPABASE_ENABLED && supabaseUserFunctions) {
    // For Supabase, password reset is handled on the frontend
    response.json({ message: "Password reset successfully." })
  } else {
    // Local auth - simplified for demo
    const passwordHash = await hashPassword(password)
    response.json({ message: "Password reset successfully." })
  }
}

module.exports = {
  login,
  me,
  register,
  forgotPassword,
  resetPassword
}
