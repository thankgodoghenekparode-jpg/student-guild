const { readCollection, writeCollection } = require("../fileStore")

async function findUserByEmail(email) {
  const users = await readCollection("users")
  return users.find((user) => user.email === email) || null
}

async function findUserById(userId) {
  const users = await readCollection("users")
  return users.find((user) => user.id === userId) || null
}

async function createUser(user) {
  const users = await readCollection("users")
  users.push(user)
  await writeCollection("users", users)
  return user
}

async function updateUser(userId, updates) {
  const users = await readCollection("users")
  const index = users.findIndex((user) => user.id === userId)
  if (index === -1) {
    throw new Error("User not found")
  }
  users[index] = { ...users[index], ...updates, updatedAt: new Date().toISOString() }
  await writeCollection("users", users)
  return users[index]
}

async function countUsers() {
  const users = await readCollection("users")
  return users.length
}

async function listStudentUsers() {
  const users = await readCollection("users")
  return users.filter((user) => user.role !== "admin")
}

module.exports = {
  countUsers,
  createUser,
  findUserByEmail,
  findUserById,
  listStudentUsers,
  updateUser
}
