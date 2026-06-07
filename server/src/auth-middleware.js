import { HttpError } from './errors.js'
import { verifyToken } from './token.js'

export function requireAuth(req, res, next) {
  const authorization = req.headers.authorization || ''
  const [scheme, token] = authorization.split(/\s+/)

  if (scheme !== 'Bearer' || !token) {
    next(new HttpError(401, 'UNAUTHORIZED', 'Authorization token is required'))
    return
  }

  const payload = verifyToken(token)
  if (!payload) {
    next(new HttpError(401, 'UNAUTHORIZED', 'Authorization token is invalid or expired'))
    return
  }

  req.auth = payload
  next()
}
