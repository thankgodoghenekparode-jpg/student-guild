const defaultRetryDelaysMs = [500, 1500]

function pause(durationMs) {
  return new Promise((resolve) => setTimeout(resolve, durationMs))
}

export function isTransientRequestError(error) {
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

export async function requestWithRetry(requestFactory, options = {}) {
  const retryDelaysMs = options.retryDelaysMs || defaultRetryDelaysMs
  let lastError = null

  for (let attempt = 0; attempt <= retryDelaysMs.length; attempt += 1) {
    try {
      return await requestFactory()
    } catch (error) {
      lastError = error
      const shouldRetry = isTransientRequestError(error) && attempt < retryDelaysMs.length

      if (!shouldRetry) {
        break
      }

      await pause(retryDelaysMs[attempt])
    }
  }

  throw lastError
}
