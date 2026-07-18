import { useEffect, useMemo, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import * as clientesService from '../services/clientesService'
import { COBRANCA_PERIODS } from '../services/clientesService'
import ClienteModal from '../components/clientes/ClienteModal'
import { CheckIcon, ChevronLeftIcon, ChevronRightIcon, PencilIcon, PlusIcon, TrashIcon } from '../components/icons'
import { formatCurrency, formatMonthShort, monthsOfYear, currentYear, currentMonthKey } from '../lib/format'

export default function Clientes() {
  const { user } = useAuth()
  const [clientes, setClientes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [modalState, setModalState] = useState(null)
  const [year, setYear] = useState(currentYear())
  const [periodFilter, setPeriodFilter] = useState('Todos')
  const months = useMemo(() => monthsOfYear(year), [year])

  async function refresh() {
    try {
      setClientes(await clientesService.listClientes())
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user.isSpecial) refresh()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (!user.isSpecial) return <Navigate to="/" replace />

  async function handleSave(data) {
    try {
      if (modalState?.editing) {
        await clientesService.updateCliente(modalState.editing.id, data)
      } else {
        await clientesService.addCliente(data)
      }
      await refresh()
      setModalState(null)
    } catch (err) {
      setError(err.message)
    }
  }

  async function handleDelete(id) {
    if (!confirm('Excluir este cliente?')) return
    try {
      await clientesService.deleteCliente(id)
      await refresh()
    } catch (err) {
      setError(err.message)
    }
  }

  async function handleToggle(id, ym) {
    try {
      await clientesService.togglePagamento(id, ym)
      await refresh()
    } catch (err) {
      setError(err.message)
    }
  }

  if (loading) {
    return <p className="text-sm text-neutral-500 dark:text-neutral-400">Carregando...</p>
  }

  const thisMonth = currentMonthKey()

  const filtered = clientes.filter((c) => periodFilter === 'Todos' || c.cobranca === periodFilter)

  const mensalidadeTotal = clientes.reduce((sum, c) => sum + c.valor, 0)
  const recebidoMes = clientes.reduce((sum, c) => sum + (c.pagamentos?.[thisMonth] ? c.valor : 0), 0)
  const pendentesMes = clientes.filter((c) => !c.pagamentos?.[thisMonth]).length

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-neutral-900 dark:text-white">Clientes</h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Controle de assinaturas mensais — só você enxerga esta área.
          </p>
        </div>
        <button
          onClick={() => setModalState({ editing: null })}
          className="flex items-center gap-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-3.5 py-2 transition-colors whitespace-nowrap"
        >
          <PlusIcon className="h-4 w-4" />
          Novo cliente
        </button>
      </div>

      {error && (
        <p className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40 rounded-lg px-3 py-2">
          {error}
        </p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200/70 dark:border-neutral-800 p-4">
          <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-1.5">
            Mensalidade total
          </p>
          <p className="text-xl font-semibold text-neutral-900 dark:text-white tabular-nums">
            {formatCurrency(mensalidadeTotal)}
          </p>
        </div>
        <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200/70 dark:border-neutral-800 p-4">
          <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-1.5">
            Recebido este mês
          </p>
          <p className="text-xl font-semibold text-[#006300] dark:text-[#0ca30c] tabular-nums">
            {formatCurrency(recebidoMes)}
          </p>
        </div>
        <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200/70 dark:border-neutral-800 p-4">
          <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-1.5">
            Pendentes este mês
          </p>
          <p className="text-xl font-semibold text-[#d03b3b] tabular-nums">{pendentesMes}</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-1 flex-wrap">
          {['Todos', ...COBRANCA_PERIODS].map((p) => (
            <button
              key={p}
              onClick={() => setPeriodFilter(p)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                periodFilter === p
                  ? 'bg-blue-600 text-white'
                  : 'bg-white dark:bg-neutral-900 border border-neutral-200/70 dark:border-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800'
              }`}
            >
              {p}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1 bg-white dark:bg-neutral-900 border border-neutral-200/70 dark:border-neutral-800 rounded-lg px-1 py-1 self-start sm:self-auto">
          <button
            onClick={() => setYear((y) => y - 1)}
            className="h-8 w-8 flex items-center justify-center rounded-md text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800"
          >
            <ChevronLeftIcon className="h-4 w-4" />
          </button>
          <span className="text-sm font-medium text-neutral-700 dark:text-neutral-200 px-2 min-w-16 text-center">
            {year}
          </span>
          <button
            onClick={() => setYear((y) => y + 1)}
            className="h-8 w-8 flex items-center justify-center rounded-md text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800"
          >
            <ChevronRightIcon className="h-4 w-4" />
          </button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200/70 dark:border-neutral-800 p-10 text-center">
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Nenhum cliente cadastrado{periodFilter !== 'Todos' ? ' nessa cobrança' : ''} ainda.
          </p>
        </div>
      ) : (
        <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200/70 dark:border-neutral-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-neutral-100 dark:border-neutral-800 text-left text-xs text-neutral-500 dark:text-neutral-400">
                  <th className="px-4 py-3 font-medium sticky left-0 bg-white dark:bg-neutral-900">Cliente</th>
                  <th className="px-4 py-3 font-medium text-right whitespace-nowrap">Valor</th>
                  {months.map((ym) => (
                    <th key={ym} className="px-2 py-3 font-medium text-center whitespace-nowrap">
                      {formatMonthShort(ym)}
                    </th>
                  ))}
                  <th className="px-4 py-3 font-medium whitespace-nowrap">Cobrança</th>
                  <th className="px-4 py-3 font-medium text-right">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((c) => (
                  <tr
                    key={c.id}
                    className="border-b border-neutral-50 dark:border-neutral-800/60 last:border-0 hover:bg-neutral-50/70 dark:hover:bg-neutral-800/40"
                  >
                    <td className="px-4 py-2.5 text-neutral-900 dark:text-white font-medium whitespace-nowrap sticky left-0 bg-white dark:bg-neutral-900">
                      {c.nome}
                    </td>
                    <td className="px-4 py-2.5 text-right text-neutral-700 dark:text-neutral-300 tabular-nums whitespace-nowrap">
                      {formatCurrency(c.valor)}
                    </td>
                    {months.map((ym) => {
                      const paid = !!c.pagamentos?.[ym]
                      return (
                        <td key={ym} className="px-2 py-2.5 text-center">
                          <button
                            onClick={() => handleToggle(c.id, ym)}
                            aria-label={paid ? `Pago em ${ym}` : `Marcar pago em ${ym}`}
                            className={`h-6 w-6 rounded-md border flex items-center justify-center mx-auto transition-colors ${
                              paid
                                ? 'bg-green-50 dark:bg-green-950/40 border-green-200 dark:border-green-900 text-[#0ca30c]'
                                : 'border-neutral-200 dark:border-neutral-700 text-transparent hover:border-neutral-300 dark:hover:border-neutral-600'
                            }`}
                          >
                            <CheckIcon className="h-3.5 w-3.5" />
                          </button>
                        </td>
                      )
                    })}
                    <td className="px-4 py-2.5 whitespace-nowrap">
                      <span className="inline-flex items-center rounded-full bg-neutral-100 dark:bg-neutral-800 px-2.5 py-1 text-xs font-medium text-neutral-600 dark:text-neutral-300">
                        {c.cobranca}
                      </span>
                    </td>
                    <td className="px-4 py-2.5">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setModalState({ editing: c })}
                          className="h-8 w-8 flex items-center justify-center rounded-lg text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors"
                          aria-label="Editar"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(c.id)}
                          className="h-8 w-8 flex items-center justify-center rounded-lg text-neutral-400 hover:bg-red-50 dark:hover:bg-red-950/40 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                          aria-label="Excluir"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {modalState && (
        <ClienteModal
          initial={modalState.editing}
          onClose={() => setModalState(null)}
          onSave={handleSave}
        />
      )}
    </div>
  )
}
