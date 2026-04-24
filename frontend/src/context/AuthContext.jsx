import { createContext, useContext, useEffect, useMemo, useState } from "react"
import { apiRequest } from "../utils/api"

const AuthContext = createContext(null)

const TOKEN_KEY = "scg-token"
const USER_KEY = "scg-user"
const LOCAL_USERS_KEY = "scg-db-users"

function readJsonStorage(key, fallbackValue) {
  try {
    const stored = localStorage.getItem(key)
    return stored ? JSON.parse(stored) : fallbackValue
  } catch {
    return fallbackValue
  }
}

function pause(durationMs) {
  return new Promise((resolve) => setTimeout(resolve, durationMs))
}

function isApiToken(token) {
  return String(token || "").split(".").length === 3
}

function readLocalSessionFromToken(token) {
  try {
    const parsedUser = JSON.parse(atob(token))

    if (!parsedUser?.id || !parsedUser?.email) {
      return null
    }

    return {
      token,
      user: parsedUser
    }
  } catch {
    return null
  }
}

function createLocalSession(user) {
  const safeUser = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role || "student"
  }

  return {
    token: btoa(JSON.stringify(safeUser)),
    user: safeUser
  }
}

function shouldFallbackToLocalAuth(error) {
  const message = String(error?.message || "").toLowerCase()

  if ([404, 502, 503, 504].includes(error?.status)) {
    return true
  }

  return (
    error instanceof TypeError ||
    message.includes("failed to fetch") ||
    message.includes("fetch failed") ||
    message.includes("networkerror") ||
    message.includes("proxy error") ||
    message.includes("econnrefused")
  )
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY))
  const [user, setUser] = useState(() => readJsonStorage(USER_KEY, null))
  const [loading, setLoading] = useState(false)
  const [isInitializing, setIsInitializing] = useState(() => Boolean(localStorage.getItem(TOKEN_KEY)))
  const [error, setError] = useState("")

  const persistSession = (nextToken, nextUser) => {
    setToken(nextToken)
    setUser(nextUser)
    if (nextToken) {
      localStorage.setItem(TOKEN_KEY, nextToken)
    } else {
      localStorage.removeItem(TOKEN_KEY)
    }
    if (nextUser) {
      localStorage.setItem(USER_KEY, JSON.stringify(nextUser))
    } else {
      localStorage.removeItem(USER_KEY)
    }
  }

  const finalizeSession = (session) => {
    if (!session?.token || !session?.user) {
      throw new Error("Invalid auth response.")
    }

    persistSession(session.token, session.user)
    return session
  }

  useEffect(() => {
    let isCancelled = false

    async function bootstrapSession() {
      if (!token) {
        setIsInitializing(false)
        return
      }

      try {
        if (!isApiToken(token)) {
          if (!user) {
            const localSession = readLocalSessionFromToken(token)

            if (!localSession) {
              persistSession(null, null)
              return
            }

            finalizeSession(localSession)
          }

          return
        }

        const response = await apiRequest("/auth/me", { token })
        const nextUser = response?.user

        if (!nextUser) {
          throw new Error("Invalid session response.")
        }

        finalizeSession({ token, user: nextUser })
      } catch (err) {
        if (shouldFallbackToLocalAuth(err)) {
          return
        }

        persistSession(null, null)
      } finally {
        if (!isCancelled) {
          setIsInitializing(false)
        }
      }
    }

    bootstrapSession()

    return () => {
      isCancelled = true
    }
  }, [token])

  const localLogin = async ({ email, password }) => {
    await pause(250)
    const normalizedEmail = String(email || "").trim().toLowerCase()
    const db = readJsonStorage(LOCAL_USERS_KEY, [])
    const foundUser = db.find((item) => item.email === normalizedEmail && item.password === password)

    if (!foundUser) {
      throw new Error("Invalid email or password.")
    }

    return finalizeSession(createLocalSession(foundUser))
  }

  const localRegister = async ({ name, email, password }) => {
    await pause(250)
    const normalizedEmail = String(email || "").trim().toLowerCase()
    const db = readJsonStorage(LOCAL_USERS_KEY, [])

    if (db.find((item) => item.email === normalizedEmail)) {
      throw new Error("User with that email already exists.")
    }

    const newUser = {
      id: Date.now().toString(),
      name: String(name || "").trim() || "Student",
      email: normalizedEmail,
      password,
      role: "student"
    }

    db.push(newUser)
    localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(db))

    return finalizeSession(createLocalSession(newUser))
  }

  const authenticate = async (path, payload, fallbackHandler) => {
    try {
      const session = await apiRequest(path, {
        method: "POST",
        body: JSON.stringify(payload)
      })

      return finalizeSession(session)
    } catch (err) {
      if (!shouldFallbackToLocalAuth(err)) {
        throw err
      }

      return fallbackHandler(payload)
    }
  }

  const login = async (payload) => {
    setLoading(true)
    setError("")
    try {
      return await authenticate("/auth/login", payload, localLogin)
    } catch (err) {
      setError(err.message || "Login failed")
      throw err
    } finally {
      setLoading(false)
    }
  }

  const register = async (payload) => {
    setLoading(true)
    setError("")
    try {
      return await authenticate("/auth/register", payload, localRegister)
    } catch (err) {
      setError(err.message || "Registration failed")
      throw err
    } finally {
      setLoading(false)
    }
  }

  const forgotPassword = async (payload) => {
    setLoading(true)
    setError("")
    try {
      const response = await apiRequest("/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify(payload)
      })
      return response
    } catch (err) {
      setError(err.message || "Forgot password failed")
      throw err
    } finally {
      setLoading(false)
    }
  }

  const resetPassword = async (payload) => {
    setLoading(true)
    setError("")
    try {
      const response = await apiRequest("/auth/reset-password", {
        method: "POST",
        body: JSON.stringify(payload)
      })
      return response
    } catch (err) {
      setError(err.message || "Reset password failed")
      throw err
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    persistSession(null, null)
    setError("")
    setIsInitializing(false)
  }

  const authHeaders = useMemo(() => {
    if (!token) return {}
    return { Authorization: `Bearer ${token}` }
  }, [token])

  const value = {
    token,
    user,
    loading,
    isInitializing,
    error,
    setError,
    setUser,
    login,
    register,
    forgotPassword,
    resetPassword,
    logout,
    authHeaders
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}
