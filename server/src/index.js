import express from 'express'
import { requireAuth } from './auth-middleware.js'
import { assertProductionConfig, config } from './config.js'
import { asyncHandler, errorHandler, notFoundHandler } from './errors.js'
import { createToken } from './token.js'
import { findUserById, upsertWechatUser } from './user-store.js'
import { exchangeCodeForSession } from './wechat.js'

assertProductionConfig()

const app = express()

app.disable('x-powered-by')
app.use(express.json({ limit: '1mb' }))

app.use((req, res, next) => {
  const origin = req.headers.origin
  if (origin && config.allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin)
    res.setHeader('Vary', 'Origin')
  }
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS')

  if (req.method === 'OPTIONS') {
    res.sendStatus(204)
    return
  }

  next()
})

app.get('/health', (req, res) => {
  res.json({
    ok: true,
    service: 'snowy-english-server',
    time: new Date().toISOString()
  })
})

app.post('/api/auth/wechat-login', asyncHandler(async (req, res) => {
  const { code, userInfo } = req.body || {}
  const session = await exchangeCodeForSession(code)
  const user = await upsertWechatUser(session, userInfo)
  const token = createToken({
    sub: user.id,
    openid: user.openid
  })

  res.json({
    token,
    user: {
      id: user.id,
      openid: user.openid,
      unionid: user.unionid,
      nickname: user.nickname,
      avatarUrl: user.avatarUrl
    }
  })
}))

app.get('/api/me', requireAuth, asyncHandler(async (req, res) => {
  const user = await findUserById(req.auth.sub)

  if (!user) {
    res.status(404).json({
      error: {
        code: 'USER_NOT_FOUND',
        message: 'User not found'
      }
    })
    return
  }

  res.json({
    user: {
      id: user.id,
      openid: user.openid,
      unionid: user.unionid,
      nickname: user.nickname,
      avatarUrl: user.avatarUrl
    }
  })
}))

app.use(notFoundHandler)
app.use(errorHandler)

app.listen(config.port, () => {
  console.log(`Snowy English API listening on http://127.0.0.1:${config.port}`)
})
