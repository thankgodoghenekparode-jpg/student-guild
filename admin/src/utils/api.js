const API_BASE = import.meta.env.VITE_API_BASE || "/api"
const API_ORIGIN = API_BASE.startsWith("http")
  ? new URL(API_BASE).origin
  : (import.meta.env.VITE_API_PROXY_TARGET || "").replace(/\/$/, "")

function buildApiUrl(path) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`
  return `${API_BASE}${normalizedPath}`
}

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
  const headers = { ...(rest.headers || {}) }

  if (!(rest.body instanceof FormData) && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json"
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  const response = await fetch(buildApiUrl(path), {
    headers,
    ...rest
  })
  const data = await parseResponseBody(response)

  if (!response.ok) {
    const message = typeof data === "string" ? data : data?.message
    const error = new Error(message || "Request failed")
    error.status = response.status
    error.data = data
    throw error
  }

  return data
}

export async function apiDownload(path, options = {}) {
  const { token, ...rest } = options
  const headers = { ...(rest.headers || {}) }

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  const response = await fetch(buildApiUrl(path), {
    headers,
    ...rest
  })

  if (!response.ok) {
    const data = await parseResponseBody(response)
    const message = typeof data === "string" ? data : data?.message
    const error = new Error(message || "Download failed")
    error.status = response.status
    error.data = data
    throw error
  }

  const disposition = response.headers.get("content-disposition") || ""
  const match = disposition.match(/filename="?([^"]+)"?$/i)

  return {
    blob: await response.blob(),
    filename: match?.[1] || ""
  }
}

export function resolveAssetUrl(path) {
  if (!path) {
    return ""
  }

  if (/^https?:\/\//i.test(path)) {
    return path
  }

  return API_ORIGIN ? `${API_ORIGIN}${path}` : path
}
