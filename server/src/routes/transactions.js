import { Router } from 'express'
import { query } from '../db.js'
import { requireAuth } from '../middleware/auth.js'
import { asyncHandler } from '../lib/asyncHandler.js'

const router = Router()
router.use(requireAuth)

function toPublic(row) {
  return {
    id: row.id,
    type: row.type,
    description: row.description,
    category: row.category,
    amount: Number(row.amount),
    date: row.date.toISOString().slice(0, 10),
    createdAt: row.created_at,
  }
}

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const { rows } = await query(
      'select * from transactions where user_id = $1 order by date desc, created_at desc',
      [req.user.id]
    )
    res.json({ transactions: rows.map(toPublic) })
  })
)

router.post(
  '/',
  asyncHandler(async (req, res) => {
    const { type, description, category, amount, date } = req.body

    if (!['income', 'expense'].includes(type) || !description?.trim() || !category || !amount || !date) {
      return res.status(400).json({ error: 'Dados do lançamento inválidos.' })
    }

    const { rows } = await query(
      `insert into transactions (user_id, type, description, category, amount, date)
       values ($1, $2, $3, $4, $5, $6)
       returning *`,
      [req.user.id, type, description.trim(), category, amount, date]
    )
    res.status(201).json({ transaction: toPublic(rows[0]) })
  })
)

router.put(
  '/:id',
  asyncHandler(async (req, res) => {
    const { type, description, category, amount, date } = req.body

    if (!['income', 'expense'].includes(type) || !description?.trim() || !category || !amount || amount <= 0 || !date) {
      return res.status(400).json({ error: 'Dados do lançamento inválidos.' })
    }

    const { rows } = await query(
      `update transactions
       set type = $1, description = $2, category = $3, amount = $4, date = $5
       where id = $6 and user_id = $7
       returning *`,
      [type, description.trim(), category, amount, date, req.params.id, req.user.id]
    )

    if (rows.length === 0) return res.status(404).json({ error: 'Lançamento não encontrado.' })
    res.json({ transaction: toPublic(rows[0]) })
  })
)

router.delete(
  '/:id',
  asyncHandler(async (req, res) => {
    const { rowCount } = await query('delete from transactions where id = $1 and user_id = $2', [
      req.params.id,
      req.user.id,
    ])
    if (rowCount === 0) return res.status(404).json({ error: 'Lançamento não encontrado.' })
    res.status(204).end()
  })
)

export default router
