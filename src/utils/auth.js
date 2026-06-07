import { buildApiUrl } from '../config/api'

const AUTH_TOKEN_KEY = 'snowy_auth_token'
const AUTH_USER_KEY = 'snowy_auth_user'

function request(options) {
  return new Promise((resolve, reject) => {
    uni.request({
      ...options,
      success: (response) => {
        const statusCode = response.statusCode || 0
        if (statusCode >= 200 && statusCode < 300) {
          resolve(response.data)
          return
        }

        reject(response.data || new Error(`Request failed with status ${statusCode}`))
      },
      fail: reject
    })
  })
}

function loginProvider() {
  return new Promise((resolve, reject) => {
    uni.login({
      provider: 'weixin',
      success: resolve,
      fail: reject
    })
  })
}

export function getAuthToken() {
  return uni.getStorageSync(AUTH_TOKEN_KEY) || ''
}

export function getAuthUser() {
  return uni.getStorageSync(AUTH_USER_KEY) || null
}

export function clearAuth() {
  uni.removeStorageSync(AUTH_TOKEN_KEY)
  uni.removeStorageSync(AUTH_USER_KEY)
}

export async function fetchCurrentUser() {
  const token = getAuthToken()
  if (!token) {
    return null
  }

  const data = await request({
    url: buildApiUrl('/api/me'),
    method: 'GET',
    header: {
      Authorization: `Bearer ${token}`
    }
  })

  if (data && data.user) {
    uni.setStorageSync(AUTH_USER_KEY, data.user)
    return data.user
  }

  return null
}

export async function loginWithWechat(userInfo = {}) {
  const loginResult = await loginProvider()
  const code = loginResult && loginResult.code

  if (!code) {
    throw new Error('Wechat login did not return a code')
  }

  const data = await request({
    url: buildApiUrl('/api/auth/wechat-login'),
    method: 'POST',
    header: {
      'Content-Type': 'application/json'
    },
    data: {
      code,
      userInfo
    }
  })

  if (data && data.token) {
    uni.setStorageSync(AUTH_TOKEN_KEY, data.token)
  }
  if (data && data.user) {
    uni.setStorageSync(AUTH_USER_KEY, data.user)
  }

  return data
}

export async function loginWithMockWechat(userInfo = {}) {
  const data = await request({
    url: buildApiUrl('/api/auth/wechat-login'),
    method: 'POST',
    header: {
      'Content-Type': 'application/json'
    },
    data: {
      code: 'mock-code',
      userInfo
    }
  })

  if (data && data.token) {
    uni.setStorageSync(AUTH_TOKEN_KEY, data.token)
  }
  if (data && data.user) {
    uni.setStorageSync(AUTH_USER_KEY, data.user)
  }

  return data
}
