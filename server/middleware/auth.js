const jwt = require('jsonwebtoken')

function httpError(statusCode, message) {
  const err = new Error(message)
  err.statusCode = statusCode
  return err
}

function requireAuth(req, res, next) {
  const token = req.cookies?.token

  if (!token) {
    return next(httpError(401, 'Authentication required'))
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    req.user = { id: payload.sub, email: payload.email, name: payload.name }
    return next()
  } catch {
    return next(httpError(401, 'Invalid or expired token'))
  }
}

module.exports = { requireAuth }

