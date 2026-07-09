function normalizeBaseUrl(url) {
  return String(url || '').replace(/\/+$/, '')
}

function createGatewayError(message, details) {
  const error = new Error(message)
  if (details !== undefined) {
    error.details = details
  }
  return error
}

async function parseJson(response) {
  const text = await response.text()
  if (!text) return {}

  try {
    return JSON.parse(text)
  } catch {
    throw createGatewayError('DBMS Gateway returned invalid JSON', text)
  }
}

export function connectProject(siteId, options = {}) {
  const apiKey = options.apiKey
  const dbmsUrl = normalizeBaseUrl(options.dbmsUrl)
  const timeoutMs = Number(options.timeoutMs || 15000)

  if (!siteId) {
    throw new Error('SITE_ID is required for DBMS Gateway access')
  }

  if (!apiKey) {
    throw new Error('API_KEY is required for DBMS Gateway access')
  }

  if (!dbmsUrl) {
    throw new Error('DBMS_URL is required for DBMS Gateway access')
  }

  async function request(path, init = {}) {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), timeoutMs)

    try {
      const response = await fetch(`${dbmsUrl}${path}`, {
        ...init,
        headers: {
          'Content-Type': 'application/json',
          'x-site-id': siteId,
          'x-api-key': apiKey,
          ...(init.headers || {}),
        },
        signal: controller.signal,
      })
      const body = await parseJson(response)

      if (!response.ok) {
        throw createGatewayError(
          body.error || body.message || `DBMS Gateway request failed with ${response.status}`,
          body,
        )
      }

      return body.payload ?? body
    } catch (error) {
      if (error.name === 'AbortError') {
        throw new Error(`DBMS Gateway request timed out after ${timeoutMs}ms`)
      }
      throw error
    } finally {
      clearTimeout(timeout)
    }
  }

  async function query(sql, params = []) {
    const payload = await request('/gateway/query', {
      method: 'POST',
      body: JSON.stringify({ sql, params }),
    })

    return payload.rows || []
  }

  return {
    query,
    execute: query,
    status() {
      return request('/gateway/status', { method: 'GET' })
    },
  }
}
