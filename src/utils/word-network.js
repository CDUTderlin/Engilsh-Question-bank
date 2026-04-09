const CACHE_KEY = 'snowy-english-word-network-cache-v4'
const REQUEST_TIMEOUT = 6000
const MAX_SYNONYMS = 2

// 国内优先：
// 1. 读音：改用有道 speech 接口，支持整词或整段短语一次性返回音频。
// 2. 近义词：走可在国内访问的公开接口 Datamuse，前端可直接请求。
const WORD_NETWORK_CONFIG = {
  audioBaseUrl: 'https://dict.youdao.com/speech'
}

let memoryCache = null
const pendingAudio = {}
const pendingSynonyms = {}

function getCache() {
  if (!memoryCache) {
    memoryCache = uni.getStorageSync(CACHE_KEY) || {}
  }

  return memoryCache
}

function saveCache() {
  uni.setStorageSync(CACHE_KEY, getCache())
}

function uniq(list) {
  return [...new Set(list.filter(Boolean))]
}

function requestJson(url, data) {
  return new Promise((resolve, reject) => {
    uni.request({
      url,
      method: data ? 'POST' : 'GET',
      data,
      timeout: REQUEST_TIMEOUT,
      success: (response) => {
        const statusCode = Number(response.statusCode || 200)
        if (statusCode === 404) {
          resolve(null)
          return
        }

        if (statusCode < 200 || statusCode >= 300) {
          reject(new Error(`Request failed: ${statusCode}`))
          return
        }

        resolve(response.data)
      },
      fail: reject
    })
  })
}

function normalizeStem(stem) {
  return String(stem || '')
    .replace(/\s*\/\s*.*/g, '')
    .replace(/[()]/g, ' ')
    .replace(/\.{2,}/g, ' ')
    .replace(/[^a-zA-Z\s'-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase()
}

function getLookupKey(stem) {
  return normalizeStem(stem)
}

function getAudioQuery(stem) {
  const normalized = normalizeStem(stem)
  if (!normalized) {
    return ''
  }

  return normalized
}

function buildAudioUrl(stem) {
  const query = getAudioQuery(stem)
  if (!query) {
    return ''
  }

  return `${WORD_NETWORK_CONFIG.audioBaseUrl}?audio=${encodeURIComponent(query)}`
}

function getCacheEntry(stem) {
  const key = getLookupKey(stem)
  if (!key) {
    return null
  }

  return getCache()[key] || null
}

function updateCacheEntry(stem, patch) {
  const key = getLookupKey(stem)
  if (!key) {
    return null
  }

  const nextEntry = {
    ...(getCache()[key] || {}),
    ...patch,
    updatedAt: Date.now()
  }

  getCache()[key] = nextEntry
  saveCache()
  return nextEntry
}

async function loadAudioUrls(stem) {
  const audioUrl = buildAudioUrl(stem)
  return audioUrl ? [audioUrl] : []
}

async function loadSynonyms(stem) {
  const normalized = normalizeStem(stem)
  if (!normalized) {
    return []
  }

  const exact = await requestJson(`https://api.datamuse.com/words?rel_syn=${encodeURIComponent(normalized)}&max=${MAX_SYNONYMS}`)
  let rawSynonyms = Array.isArray(exact) ? exact.map((item) => item && item.word) : []

  if (!rawSynonyms.length) {
    const similar = await requestJson(`https://api.datamuse.com/words?ml=${encodeURIComponent(normalized)}&max=${MAX_SYNONYMS}`)
    rawSynonyms = Array.isArray(similar) ? similar.map((item) => item && item.word) : []
  }

  return uniq(
    rawSynonyms
      .map((item) => String(item || '').trim())
      .filter((item) => item && item.toLowerCase() !== normalized)
  ).slice(0, MAX_SYNONYMS)
}

export async function getWordAudioUrls(stem) {
  const key = getLookupKey(stem)
  if (!key) {
    return []
  }

  const cached = getCacheEntry(stem)
  if (cached && Array.isArray(cached.audioUrls)) {
    return cached.audioUrls.slice()
  }

  if (!pendingAudio[key]) {
    pendingAudio[key] = loadAudioUrls(stem)
      .then((audioUrls) => {
        const nextUrls = Array.isArray(audioUrls) ? audioUrls : []
        updateCacheEntry(stem, { audioUrls: nextUrls })
        return nextUrls
      })
      .catch(() => {
        updateCacheEntry(stem, { audioUrls: [] })
        return []
      })
      .finally(() => {
        delete pendingAudio[key]
      })
  }

  return pendingAudio[key]
}

export async function getWordSynonyms(stem) {
  const key = getLookupKey(stem)
  if (!key) {
    return []
  }

  const cached = getCacheEntry(stem)
  if (cached && Array.isArray(cached.synonyms)) {
    return cached.synonyms.slice()
  }

  if (!pendingSynonyms[key]) {
    pendingSynonyms[key] = loadSynonyms(stem)
      .then((synonyms) => {
        const nextSynonyms = Array.isArray(synonyms) ? synonyms : []
        updateCacheEntry(stem, { synonyms: nextSynonyms })
        return nextSynonyms
      })
      .catch(() => {
        updateCacheEntry(stem, { synonyms: [] })
        return []
      })
      .finally(() => {
        delete pendingSynonyms[key]
      })
  }

  return pendingSynonyms[key]
}

export { getLookupKey, WORD_NETWORK_CONFIG }
