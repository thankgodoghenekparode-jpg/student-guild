const API_BASE = import.meta.env.VITE_API_BASE || "/api"

async function parseResponseBody(response) {
  if (response.status === 204) {
    return null
  }

  const contentType = response.headers.get("content-type") || ""

  if (contentType.includes("application/json")) {
    try {
      return await response.json()
    } catch {
      return null
    }
  }

  return response.text()
}

export async function apiRequest(path, options = {}) {
  const { token, ...rest } = options
  const headers = { "Content-Type": "application/json", ...(rest.headers || {}) }
  const normalizedPath = path.startsWith("/") ? path : `/${path}`

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  const response = await fetch(`${API_BASE}${normalizedPath}`, {
    headers,
    ...rest
  })
  const data = await parseResponseBody(response)
  const contentType = response.headers.get("content-type") || ""

  if (!response.ok) {
    const message = typeof data === "string" ? data : data?.message
    const error = new Error(message || "Request failed")
    error.status = response.status
    error.data = data
    throw error
  }

  // Static hosts like Netlify can rewrite unknown `/api/*` paths to `index.html`.
  // Treat that HTML response as an unavailable API so auth can safely fall back.
  if (contentType.includes("text/html")) {
    const error = new Error("API unavailable")
    error.status = 404
    error.data = data
    throw error
  }

  return data
}
