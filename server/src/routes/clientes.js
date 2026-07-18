import { Router } from 'express'
import { query } from '../db.js'
import { requireAuth, requireSpecial } from '../middleware/auth.js'
import { asyncHandler } from '../lib/asyncHandler.js'

const router = Router()
router.use(requireAuth, requireSpecial)

function toPublic(row) {
  return {
    id: row.id,
    nome: row.nome,
    valor: Number(row.valor),
    cobranca: row.cobranca,
    observacoes: row.observacoes,
    pagamentos: row.pagamentos,
    createdAt: row.created_at,
  }
}

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const { rows } = await query('select * from clientes where user_id = $1 order by nome', [req.user.id])
    res.json({ clientes: rows.map(toPublic) })
  })
)

router.post(
  '/',
  asyncHandler(async (req, res) => {
    const { nome, valor, cobranca, observacoes } = req.body

    if (!nome?.trim() || !valor || valor <= 0) {
      return res.status(400).json({ error: 'Dados do cliente inválidos.' })
    }

    const { rows } = await query(
      `insert into clientes (user_id, nome, valor, cobranca, observacoes)
       values ($1, $2, $3, $4, $5)
       returning *`,
      [req.user.id, nome.trim(), valor, cobranca, observacoes?.trim() || '']
    )
    res.status(201).json({ cliente: toPublic(rows[0]) })
  })
)

router.put(
  '/:id',
  asyncHandler(async (req, res) => {
    const { nome, valor, cobranca, observacoes } = req.body

    if (!nome?.trim() || !valor || valor <= 0) {
      return res.status(400).json({ error: 'Dados do cliente inválidos.' })
    }

    const { rows } = await query(
      `update clientes
       set nome = $1, valor = $2, cobranca = $3, observacoes = $4
       where id = $5 and user_id = $6
       returning *`,
      [nome.trim(), valor, cobranca, observacoes?.trim() || '', req.params.id, req.user.id]
    )

    if (rows.length === 0) return res.status(404).json({ error: 'Cliente não encontrado.' })
    res.json({ cliente: toPublic(rows[0]) })
  })
)

router.delete(
  '/:id',
  asyncHandler(async (req, res) => {
    const { rowCount } = await query('delete from clientes where id = $1 and user_id = $2', [
      req.params.id,
      req.user.id,
    ])
    if (rowCount === 0) return res.status(404).json({ error: 'Cliente não encontrado.' })
    res.status(204).end()
  })
)

router.patch(
  '/:id/pagamentos',
  asyncHandler(async (req, res) => {
    const { ym } = req.body
    if (!/^\d{4}-\d{2}$/.test(ym || '')) {
      return res.status(400).json({ error: 'Mês inválido.' })
    }

    const { rows } = await query('select * from clientes where id = $1 and user_id = $2', [
      req.params.id,
      req.user.id,
    ])
    if (rows.length === 0) return res.status(404).json({ error: 'Cliente não encontrado.' })

    const pagamentos = { ...rows[0].pagamentos }
    if (pagamentos[ym]) {
      delete pagamentos[ym]
    } else {
      pagamentos[ym] = true
    }

    const { rows: updated } = await query(
      'update clientes set pagamentos = $1 where id = $2 returning *',
      [JSON.stringify(pagamentos), req.params.id]
    )
    res.json({ cliente: toPublic(updated[0]) })
  })
)

export default router
