import { config } from './config.js'
import { HttpError } from './errors.js'

export async function exchangeCodeForSession(code) {
  if (!code || typeof code !== 'string') {
    throw new HttpError(400, 'MISSING_CODE', 'code is required')
  }

  if (config.wechatLoginMock && code === 'mock-code') {
    return {
      openid: 'mock-openid',
      session_key: 'mock-session-key',
      unionid: ''
    }
  }

  if (!config.wechatAppId || !config.wechatSecret) {
    throw new HttpError(500, 'WECHAT_CONFIG_MISSING', 'WeChat AppID or AppSecret is not configured')
  }

  const url = new URL('https://api.weixin.qq.com/sns/jscode2session')
  url.searchParams.set('appid', config.wechatAppId)
  url.searchParams.set('secret', config.wechatSecret)
  url.searchParams.set('js_code', code)
  url.searchParams.set('grant_type', 'authorization_code')

  const response = await fetch(url)
  if (!response.ok) {
    throw new HttpError(502, 'WECHAT_UPSTREAM_ERROR', 'WeChat login service is unavailable')
  }

  const payload = await response.json()
  if (payload.errcode) {
    throw new HttpError(400, 'WECHAT_LOGIN_FAILED', payload.errmsg || 'WeChat login failed')
  }

  if (!payload.openid || !payload.session_key) {
    throw new HttpError(502, 'WECHAT_INVALID_RESPONSE', 'WeChat returned an invalid login response')
  }

  return payload
}
