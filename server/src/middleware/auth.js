import jwt from 'jsonwebtoken'

export function requireAuth(req, res, next) {
  const header = req.headers.authorization
  const token = header?.startsWith('Bearer ') ? header.slice(7) : null

  if (!token) {
    return res.status(401).json({ error: 'Não autenticado.' })
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET, { algorithms: ['HS256'] })
    req.user = { id: payload.sub, isSpecial: payload.isSpecial }
    next()
  } catch {
    return res.status(401).json({ error: 'Sessão inválida ou expirada.' })
  }
}

export function requireSpecial(req, res, next) {
  if (!req.user.isSpecial) {
    return res.status(403).json({ error: 'Acesso restrito.' })
  }
  next()
}
