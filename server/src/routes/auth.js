import { Router } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { query } from '../db.js'
import { requireAuth } from '../middleware/auth.js'
import { asyncHandler } from '../lib/asyncHandler.js'

const router = Router()

function toPublicUser(row) {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    isSpecial: row.is_special,
    createdAt: row.created_at,
  }
}

function signToken(user) {
  return jwt.sign({ sub: user.id, isSpecial: user.is_special }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  })
}

router.post(
  '/register',
  asyncHandler(async (req, res) => {
    const { name, email, password } = req.body

    if (!name?.trim() || !password || password.length < 6) {
      return res.status(400).json({ error: 'Dados inválidos. A senha precisa ter pelo menos 6 caracteres.' })
    }

    const normalizedEmail = email?.trim().toLowerCase()
    if (!normalizedEmail) {
      return res.status(400).json({ error: 'Informe um e-mail válido.' })
    }

    const existing = await query('select id from users where email = $1', [normalizedEmail])
    if (existing.rows.length > 0) {
      return res.status(409).json({ error: 'Já existe uma conta com esse e-mail.' })
    }

    const { rows: countRows } = await query('select count(*)::int as count from users')
    const isSpecial = countRows[0].count === 0

    const passwordHash = await bcrypt.hash(password, 10)

    const { rows } = await query(
      `insert into users (name, email, password_hash, is_special)
       values ($1, $2, $3, $4)
       returning *`,
      [name.trim(), normalizedEmail, passwordHash, isSpecial]
    )

    const user = rows[0]
    res.status(201).json({ token: signToken(user), user: toPublicUser(user) })
  })
)

router.post(
  '/login',
  asyncHandler(async (req, res) => {
    const { email, password } = req.body
    const normalizedEmail = email?.trim().toLowerCase()

    const { rows } = await query('select * from users where email = $1', [normalizedEmail])
    const user = rows[0]

    if (!user || !(await bcrypt.compare(password || '', user.password_hash))) {
      return res.status(401).json({ error: 'E-mail ou senha inválidos.' })
    }

    res.json({ token: signToken(user), user: toPublicUser(user) })
  })
)

router.get(
  '/me',
  requireAuth,
  asyncHandler(async (req, res) => {
    const { rows } = await query('select * from users where id = $1', [req.user.id])
    if (rows.length === 0) return res.status(404).json({ error: 'Usuário não encontrado.' })
    res.json({ user: toPublicUser(rows[0]) })
  })
)

router.post(
  '/change-password',
  requireAuth,
  asyncHandler(async (req, res) => {
    const { currentPassword, newPassword } = req.body

    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ error: 'A nova senha precisa ter pelo menos 6 caracteres.' })
    }

    const { rows } = await query('select * from users where id = $1', [req.user.id])
    const user = rows[0]

    if (!user || !(await bcrypt.compare(currentPassword || '', user.password_hash))) {
      return res.status(401).json({ error: 'Senha atual incorreta.' })
    }

    const passwordHash = await bcrypt.hash(newPassword, 10)
    await query('update users set password_hash = $1 where id = $2', [passwordHash, req.user.id])
    res.json({ ok: true })
  })
)

export default router
