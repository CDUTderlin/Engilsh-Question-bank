const DEFAULT_SHARE_IMAGE = '/static/snowy-english-logo.png'

function normalizePath(path) {
  const safePath = String(path || '').trim()
  if (!safePath) {
    return '/pages/index/index'
  }

  return safePath.startsWith('/') ? safePath : `/${safePath}`
}

export function buildShareAppMessage(options = {}) {
  const { title = 'Snowy English', path = '/pages/index/index', imageUrl = DEFAULT_SHARE_IMAGE } = options

  return {
    title,
    path: normalizePath(path),
    imageUrl
  }
}

export function buildShareTimeline(options = {}) {
  const { title = 'Snowy English', query = '', imageUrl = DEFAULT_SHARE_IMAGE } = options

  return {
    title,
    query: String(query || ''),
    imageUrl
  }
}
