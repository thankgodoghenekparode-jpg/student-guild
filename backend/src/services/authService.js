const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const { env } = require("../config/env")
const { createHttpError } = require("../utils/errors")

async function hashPassword(password) {
  return bcrypt.hash(password, 10)
}

async function comparePassword(password, passwordHash) {
  return bcrypt.compare(password, passwordHash)
}

function createAccessToken(user) {
  return jwt.sign(
    {
      sub: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    },
    env.jwtSecret,
    {
      expiresIn: env.jwtExpiresIn
    }
  )
}

function verifyAccessToken(token) {
  try {
    return jwt.verify(token, env.jwtSecret)
  } catch {
    throw createHttpError(401, "Authentication required.")
  }
}

function sanitizeUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt
  }
}

module.exports = {
  comparePassword,
  createAccessToken,
  hashPassword,
  sanitizeUser,
  verifyAccessToken
}
