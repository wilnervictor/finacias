import { apiRequest } from '../lib/api'

export const EXPENSE_CATEGORIES = [
  'Moradia',
  'Alimentação',
  'Transporte',
  'Saúde',
  'Educação',
  'Lazer',
  'Outros',
]

export const INCOME_CATEGORIES = ['Salário', 'Freelance', 'Investimentos', 'Outros']

export async function listTransactions() {
  const { transactions } = await apiRequest('/transactions')
  return transactions
}

export async function addTransaction(data) {
  const { transaction } = await apiRequest('/transactions', { method: 'POST', body: data })
  return transaction
}

export async function updateTransaction(id, data) {
  const { transaction } = await apiRequest(`/transactions/${id}`, { method: 'PUT', body: data })
  return transaction
}

export async function deleteTransaction(id) {
  await apiRequest(`/transactions/${id}`, { method: 'DELETE' })
}

export function monthKey(dateStr) {
  return dateStr.slice(0, 7) // "YYYY-MM"
}

export function summarizeMonth(transactions, ym) {
  const monthTx = transactions.filter((t) => monthKey(t.date) === ym)
  const income = monthTx.reduce((sum, t) => (t.type === 'income' ? sum + t.amount : sum), 0)
  const expense = monthTx.reduce((sum, t) => (t.type === 'expense' ? sum + t.amount : sum), 0)
  return { income, expense, balance: income - expense, transactions: monthTx }
}

export function totalBalance(transactions) {
  return transactions.reduce(
    (sum, t) => sum + (t.type === 'income' ? t.amount : -t.amount),
    0
  )
}

export function last6MonthsKeys(referenceDate = new Date()) {
  const keys = []
  for (let i = 5; i >= 0; i--) {
    const d = new Date(referenceDate.getFullYear(), referenceDate.getMonth() - i, 1)
    keys.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`)
  }
  return keys
}
