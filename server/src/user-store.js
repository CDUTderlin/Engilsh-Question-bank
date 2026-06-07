import fs from 'node:fs/promises'
import path from 'node:path'
import { config } from './config.js'

const usersPath = path.join(config.dataDir, 'users.json')

async function ensureStore() {
  await fs.mkdir(config.dataDir, { recursive: true })
  try {
    await fs.access(usersPath)
  } catch {
    await fs.writeFile(usersPath, JSON.stringify({ users: [] }, null, 2))
  }
}

async function readStore() {
  await ensureStore()
  const raw = await fs.readFile(usersPath, 'utf8')
  return JSON.parse(raw)
}

async function writeStore(store) {
  await fs.writeFile(usersPath, JSON.stringify(store, null, 2))
}

export async function upsertWechatUser(session, profile = {}) {
  const store = await readStore()
  const now = new Date().toISOString()
  const openid = session.openid
  let user = store.users.find((item) => item.openid === openid)

  if (!user) {
    user = {
      id: `u_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`,
      openid,
      unionid: session.unionid || '',
      nickname: profile.nickName || profile.nickname || '',
      avatarUrl: profile.avatarUrl || '',
      createdAt: now,
      updatedAt: now,
      lastLoginAt: now
    }
    store.users.push(user)
  } else {
    user.unionid = session.unionid || user.unionid || ''
    user.nickname = profile.nickName || profile.nickname || user.nickname || ''
    user.avatarUrl = profile.avatarUrl || user.avatarUrl || ''
    user.updatedAt = now
    user.lastLoginAt = now
  }

  await writeStore(store)
  return user
}

export async function findUserById(id) {
  const store = await readStore()
  return store.users.find((item) => item.id === id) || null
}
