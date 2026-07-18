import { Router } from 'express'
import crypto from 'node:crypto'
import bcrypt from 'bcryptjs'
import { query } from '../db.js'

const router = Router()

// Rota temporária, só pra correção pontual via curl (sem plano pago da Render
// pra rodar One-Off Jobs). Fica inerte (404) se ADMIN_KEY não estiver setada,
// e a intenção é remover este arquivo depois de usado.
function checkAdminKey(req, res, next) {
  const expected = process.env.ADMIN_KEY
  const provided = req.headers['x-admin-key']

  if (!expected || !provided) return res.status(404).end()

  const expectedBuf = Buffer.from(expected)
  const providedBuf = Buffer.from(provided)
  const match =
    expectedBuf.length === providedBuf.length && crypto.timingSafeEqual(expectedBuf, providedBuf)

  if (!match) return res.status(404).end()
  next()
}

router.post('/set-special-user', checkAdminKey, async (req, res) => {
  const { email, password } = req.body

  if (!email || !password || password.length < 6) {
    return res.status(400).json({ error: 'Informe email e senha (6+ caracteres).' })
  }

  const passwordHash = await bcrypt.hash(password, 10)
  const { rows } = await query(
    `update users set email = $1, password_hash = $2
     where is_special = true
     returning id, name, email`,
    [email.trim().toLowerCase(), passwordHash]
  )

  if (rows.length === 0) {
    return res.status(404).json({ error: 'Nenhum usuário especial encontrado.' })
  }

  res.json({ user: rows[0] })
})

export default router
