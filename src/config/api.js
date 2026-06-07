const defaultApiBaseUrl =
  process.env.UNI_PLATFORM === 'h5'
    ? 'http://127.0.0.1:3100'
    : 'https://api.example.com'

export const API_BASE_URL = process.env.VUE_APP_API_BASE_URL || defaultApiBaseUrl

export function buildApiUrl(path) {
  const normalizedBase = API_BASE_URL.replace(/\/+$/, '')
  const normalizedPath = String(path || '').replace(/^\/+/, '')
  return `${normalizedBase}/${normalizedPath}`
}
