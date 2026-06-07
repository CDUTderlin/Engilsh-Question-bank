import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const serverRoot = path.resolve(__dirname, '..')

function loadEnvFile() {
  const envPath = path.join(serverRoot, '.env')
  if (!fs.existsSync(envPath)) {
    return
  }

  const lines = fs.readFileSync(envPath, 'utf8').split(/\r?\n/)
  lines.forEach((line) => {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) {
      return
    }

    const separatorIndex = trimmed.indexOf('=')
    if (separatorIndex === -1) {
      return
    }

    const key = trimmed.slice(0, separatorIndex).trim()
    const rawValue = trimmed.slice(separatorIndex + 1).trim()
    const value = rawValue.replace(/^['"]|['"]$/g, '')
    if (key && process.env[key] === undefined) {
      process.env[key] = value
    }
  })
}

loadEnvFile()

function splitCsv(value) {
  return String(value || '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
}

export const config = {
  port: Number(process.env.PORT || 3000),
  nodeEnv: process.env.NODE_ENV || 'development',
  wechatAppId: process.env.WECHAT_APPID || '',
  wechatSecret: process.env.WECHAT_SECRET || '',
  jwtSecret: process.env.JWT_SECRET || 'change-me-in-production',
  allowedOrigins: splitCsv(process.env.ALLOWED_ORIGINS),
  wechatLoginMock: process.env.WECHAT_LOGIN_MOCK === 'true',
  dataDir: path.join(serverRoot, 'data')
}

export function assertProductionConfig() {
  if (config.nodeEnv !== 'production') {
    return
  }

  const missing = []
  if (!config.wechatAppId) missing.push('WECHAT_APPID')
  if (!config.wechatSecret) missing.push('WECHAT_SECRET')
  if (!config.jwtSecret || config.jwtSecret === 'change-me-in-production') missing.push('JWT_SECRET')

  if (missing.length) {
    throw new Error(`Missing production config: ${missing.join(', ')}`)
  }
}
