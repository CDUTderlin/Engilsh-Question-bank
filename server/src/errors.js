export class HttpError extends Error {
  constructor(status, code, message) {
    super(message)
    this.status = status
    this.code = code
  }
}

export function asyncHandler(handler) {
  return async (req, res, next) => {
    try {
      await handler(req, res, next)
    } catch (error) {
      next(error)
    }
  }
}

export function notFoundHandler(req, res) {
  res.status(404).json({
    error: {
      code: 'NOT_FOUND',
      message: 'Route not found'
    }
  })
}

export function errorHandler(error, req, res, next) {
  if (res.headersSent) {
    next(error)
    return
  }

  const status = error.status || 500
  const code = error.code || 'INTERNAL_ERROR'
  const message = status >= 500 ? 'Internal server error' : error.message

  if (status >= 500) {
    console.error(error)
  }

  res.status(status).json({
    error: {
      code,
      message
    }
  })
}
