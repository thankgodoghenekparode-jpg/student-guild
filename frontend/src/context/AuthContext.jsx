import { createContext, useContext, useEffect, useMemo, useState } from "react"
import { supabase } from "../utils/supabase"
import { apiRequest } from "../utils/api"

const AuthContext = createContext(null)

const TOKEN_KEY = "scg-token"
const USER_KEY = "scg-user"
const LOCAL_USERS_KEY = "scg-db-users"
const LOCAL_AUTH_FALLBACK_ENABLED =
  import.meta.env.DEV || import.meta.env.VITE_ENABLE_LOCAL_AUTH_FALLBACK === "true"

// Check if Supabase is configured
const SUPABASE_ENABLED = !!(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY)

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
  if (!LOCAL_AUTH_FALLBACK_ENABLED) {
    return false
  }

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
  const [isInitializing, setIsInitializing] = useState(true)
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
      if (!SUPABASE_ENABLED) {
        // Fallback to local auth if Supabase not configured
        if (token && !isApiToken(token)) {
          const localSession = readLocalSessionFromToken(token)
          if (localSession) {
            finalizeSession(localSession)
          } else {
            persistSession(null, null)
          }
        }
        setIsInitializing(false)
        return
      }

      try {
        // Get initial session from Supabase
        if (supabase) {
          const { data: { session }, error } = await supabase.auth.getSession()

          if (error) {
            console.error("Supabase session error:", error)
            persistSession(null, null)
          } else if (session) {
            const userData = {
              id: session.user.id,
              email: session.user.email,
              name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'User',
              role: session.user.user_metadata?.role || 'student'
            }
            finalizeSession({
              token: session.access_token,
              user: userData
            })
          } else {
            persistSession(null, null)
          }
        } else {
          persistSession(null, null)
        }
      } catch (err) {
        console.error("Auth initialization error:", err)
        persistSession(null, null)
      } finally {
        if (!isCancelled) {
          setIsInitializing(false)
        }
      }
    }

    bootstrapSession()

    // Listen for auth state changes
    if (SUPABASE_ENABLED && supabase) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          if (isCancelled) return

          if (event === 'SIGNED_IN' && session) {
            const userData = {
              id: session.user.id,
              email: session.user.email,
              name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'User',
              role: session.user.user_metadata?.role || 'student'
            }
            finalizeSession({
              token: session.access_token,
              user: userData
            })
          } else if (event === 'SIGNED_OUT') {
            persistSession(null, null)
          }
        }
      )

      return () => {
        isCancelled = true
        subscription.unsubscribe()
      }
    }

    return () => {
      isCancelled = true
    }
  }, [])

  const supabaseLogin = async ({ email, password }) => {
    if (!supabase) throw new Error("Supabase not configured")
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) throw error

    const userData = {
      id: data.user.id,
      email: data.user.email,
      name: data.user.user_metadata?.name || data.user.email?.split('@')[0] || 'User',
      role: data.user.user_metadata?.role || 'student'
    }

    return finalizeSession({
      token: data.session.access_token,
      user: userData
    })
  }

  const supabaseRegister = async ({ name, email, password }) => {
    if (!supabase) throw new Error("Supabase not configured")
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name || email.split('@')[0],
          role: 'student'
        }
      }
    })

    if (error) throw error

    // For Supabase, registration might require email confirmation
    // We'll handle this by checking if the user is confirmed
    if (data.user && !data.session) {
      throw new Error("Please check your email to confirm your account before signing in.")
    }

    const userData = {
      id: data.user.id,
      email: data.user.email,
      name: data.user.user_metadata?.name || data.user.email?.split('@')[0] || 'User',
      role: data.user.user_metadata?.role || 'student'
    }

    return finalizeSession({
      token: data.session.access_token,
      user: userData
    })
  }

  const localLogin = async ({ email, password }) => {
    const response = await apiRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password })
    })

    if (!response?.token || !response?.user) {
      throw new Error("Invalid login response")
    }

    return finalizeSession({
      token: response.token,
      user: response.user
    })
  }

  const localRegister = async ({ name, email, password }) => {
    const response = await apiRequest("/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password })
    })

    if (!response?.token || !response?.user) {
      throw new Error("Invalid registration response")
    }

    return finalizeSession({
      token: response.token,
      user: response.user
    })
  }

  const authenticate = async (payload, supabaseHandler, fallbackHandler) => {
    if (SUPABASE_ENABLED) {
      try {
        return await supabaseHandler(payload)
      } catch (err) {
        // If Supabase fails and fallback is enabled, try local auth
        if (LOCAL_AUTH_FALLBACK_ENABLED) {
          console.warn("Supabase auth failed, falling back to local auth:", err.message)
          return fallbackHandler(payload)
        }
        throw err
      }
    } else {
      // Use local auth if Supabase not configured
      return fallbackHandler(payload)
    }
  }

  const login = async (payload) => {
    setLoading(true)
    setError("")
    try {
      return await authenticate(payload, supabaseLogin, localLogin)
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
      return await authenticate(payload, supabaseRegister, localRegister)
    } catch (err) {
      setError(err.message || "Registration failed")
      throw err
    } finally {
      setLoading(false)
    }
  }

  const forgotPassword = async ({ email }) => {
    setLoading(true)
    setError("")
    try {
      if (SUPABASE_ENABLED && supabase) {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`
        })
        if (error) throw error
        return { message: "Password reset email sent. Please check your inbox." }
      } else {
        // Fallback to API for local auth
        const response = await apiRequest("/auth/forgot-password", {
          method: "POST",
          body: JSON.stringify({ email })
        })
        return response
      }
    } catch (err) {
      setError(err.message || "Forgot password failed")
      throw err
    } finally {
      setLoading(false)
    }
  }

  const resetPassword = async ({ password }) => {
    setLoading(true)
    setError("")
    try {
      if (SUPABASE_ENABLED && supabase) {
        const { error } = await supabase.auth.updateUser({
          password
        })
        if (error) throw error
        return { message: "Password updated successfully." }
      } else {
        // Fallback to API for local auth
        const response = await apiRequest("/auth/reset-password", {
          method: "POST",
          body: JSON.stringify({ password })
        })
        return response
      }
    } catch (err) {
      setError(err.message || "Reset password failed")
      throw err
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    setLoading(true)
    try {
      if (SUPABASE_ENABLED && supabase) {
        const { error } = await supabase.auth.signOut()
        if (error) console.error("Supabase logout error:", error)
      }
      persistSession(null, null)
      setError("")
    } catch (err) {
      console.error("Logout error:", err)
    } finally {
      setLoading(false)
    }
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
