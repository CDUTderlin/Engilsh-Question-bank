import crypto from 'node:crypto'
import { config } from './config.js'

function base64url(input) {
  return Buffer.from(input)
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
}

function sign(input) {
  return crypto
    .createHmac('sha256', config.jwtSecret)
    .update(input)
    .digest('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
}

export function createToken(payload, options = {}) {
  const now = Math.floor(Date.now() / 1000)
  const expiresInSeconds = options.expiresInSeconds || 60 * 60 * 24 * 30
  const header = { alg: 'HS256', typ: 'JWT' }
  const body = {
    ...payload,
    iat: now,
    exp: now + expiresInSeconds
  }

  const encodedHeader = base64url(JSON.stringify(header))
  const encodedBody = base64url(JSON.stringify(body))
  const signature = sign(`${encodedHeader}.${encodedBody}`)
  return `${encodedHeader}.${encodedBody}.${signature}`
}

export function verifyToken(token) {
  const parts = String(token || '').split('.')
  if (parts.length !== 3) {
    return null
  }

  const [encodedHeader, encodedBody, signature] = parts
  const expectedSignature = sign(`${encodedHeader}.${encodedBody}`)
  if (signature !== expectedSignature) {
    return null
  }

  try {
    const payload = JSON.parse(Buffer.from(encodedBody, 'base64url').toString('utf8'))
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      return null
    }
    return payload
  } catch {
    return null
  }
}
