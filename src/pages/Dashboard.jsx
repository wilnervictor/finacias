import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import * as financeService from '../services/financeService'
import SummaryCards from '../components/finance/SummaryCards'
import MonthlyChart from '../components/finance/MonthlyChart'
import CategoryChart from '../components/finance/CategoryChart'
import TransactionsTable from '../components/finance/TransactionsTable'
import TransactionModal from '../components/finance/TransactionModal'
import { ChevronLeftIcon, ChevronRightIcon, PlusIcon } from '../components/icons'
import { currentMonthKey, formatMonthLabel, shiftMonth } from '../lib/format'

export default function Dashboard() {
  const { user } = useAuth()
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedMonth, setSelectedMonth] = useState(currentMonthKey())
  const [modalState, setModalState] = useState(null) // null | { editing: transaction | null }

  async function refresh() {
    try {
      setTransactions(await financeService.listTransactions())
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refresh()
  }, [])

  const { income, expense, balance: monthBalance, transactions: monthTransactions } = useMemo(
    () => financeService.summarizeMonth(transactions, selectedMonth),
    [transactions, selectedMonth]
  )

  const balanceTotal = useMemo(() => financeService.totalBalance(transactions), [transactions])

  const chartData = useMemo(() => {
    return financeService.last6MonthsKeys().map((ym) => {
      const s = financeService.summarizeMonth(transactions, ym)
      return { month: ym, income: s.income, expense: s.expense }
    })
  }, [transactions])

  async function handleSave(data) {
    try {
      if (modalState?.editing) {
        await financeService.updateTransaction(modalState.editing.id, data)
      } else {
        await financeService.addTransaction(data)
      }
      await refresh()
      setModalState(null)
    } catch (err) {
      setError(err.message)
    }
  }

  async function handleDelete(id) {
    if (!confirm('Excluir este lançamento?')) return
    try {
      await financeService.deleteTransaction(id)
      await refresh()
    } catch (err) {
      setError(err.message)
    }
  }

  if (loading) {
    return <p className="text-sm text-neutral-500 dark:text-neutral-400">Carregando...</p>
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-neutral-900 dark:text-white">
            Olá, {user.name.split(' ')[0]}
          </h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Aqui está o resumo das suas finanças.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1 bg-white dark:bg-neutral-900 border border-neutral-200/70 dark:border-neutral-800 rounded-lg px-1 py-1">
            <button
              onClick={() => setSelectedMonth((m) => shiftMonth(m, -1))}
              className="h-8 w-8 flex items-center justify-center rounded-md text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800"
            >
              <ChevronLeftIcon className="h-4 w-4" />
            </button>
            <span className="text-sm font-medium text-neutral-700 dark:text-neutral-200 px-2 min-w-32 sm:min-w-38 text-center capitalize">
              {formatMonthLabel(selectedMonth)}
            </span>
            <button
              onClick={() => setSelectedMonth((m) => shiftMonth(m, 1))}
              className="h-8 w-8 flex items-center justify-center rounded-md text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800"
            >
              <ChevronRightIcon className="h-4 w-4" />
            </button>
          </div>

          <button
            onClick={() => setModalState({ editing: null })}
            className="flex items-center gap-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-3.5 py-2 transition-colors whitespace-nowrap"
          >
            <PlusIcon className="h-4 w-4" />
            Novo lançamento
          </button>
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40 rounded-lg px-3 py-2">
          {error}
        </p>
      )}

      <SummaryCards
        income={income}
        expense={expense}
        monthBalance={monthBalance}
        totalBalance={balanceTotal}
      />

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <div className="lg:col-span-3">
          <MonthlyChart data={chartData} />
        </div>
        <div className="lg:col-span-2">
          <CategoryChart transactions={monthTransactions} />
        </div>
      </div>

      <TransactionsTable
        transactions={monthTransactions}
        onEdit={(t) => setModalState({ editing: t })}
        onDelete={handleDelete}
      />

      {modalState && (
        <TransactionModal
          initial={modalState.editing}
          onClose={() => setModalState(null)}
          onSave={handleSave}
        />
      )}
    </div>
  )
}
