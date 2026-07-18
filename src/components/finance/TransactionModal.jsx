import { useState } from 'react'
import Modal from '../Modal'
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '../../services/financeService'

function todayISO() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export default function TransactionModal({ initial, onClose, onSave }) {
  const [type, setType] = useState(initial?.type || 'expense')
  const [description, setDescription] = useState(initial?.description || '')
  const [category, setCategory] = useState(initial?.category || EXPENSE_CATEGORIES[0])
  const [amount, setAmount] = useState(initial?.amount ?? '')
  const [date, setDate] = useState(initial?.date || todayISO())
  const [error, setError] = useState('')

  const categories = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES

  function handleTypeChange(nextType) {
    setType(nextType)
    const nextCategories = nextType === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES
    if (!nextCategories.includes(category)) setCategory(nextCategories[0])
  }

  function handleSubmit(e) {
    e.preventDefault()
    const value = Number(amount)
    if (!description.trim()) {
      setError('Informe uma descrição.')
      return
    }
    if (!value || value <= 0) {
      setError('Informe um valor válido.')
      return
    }
    onSave({ type, description: description.trim(), category, amount: value, date })
  }

  return (
    <Modal title={initial ? 'Editar lançamento' : 'Novo lançamento'} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => handleTypeChange('income')}
            className={`rounded-lg py-2 text-sm font-medium border transition-colors ${
              type === 'income'
                ? 'bg-green-600 border-green-600 text-white'
                : 'border-neutral-300 dark:border-neutral-700 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800'
            }`}
          >
            Receita
          </button>
          <button
            type="button"
            onClick={() => handleTypeChange('expense')}
            className={`rounded-lg py-2 text-sm font-medium border transition-colors ${
              type === 'expense'
                ? 'bg-red-600 border-red-600 text-white'
                : 'border-neutral-300 dark:border-neutral-700 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800'
            }`}
          >
            Despesa
          </button>
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
            Descrição
          </label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={type === 'income' ? 'Ex: Salário de julho' : 'Ex: Supermercado'}
            className="w-full rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 px-3 py-2 text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
              Categoria
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 px-3 py-2 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
              Valor (R$)
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0,00"
              className="w-full rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 px-3 py-2 text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500 tabular-nums"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
            Data
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 px-3 py-2 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {error && (
          <p className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40 rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        <button
          type="submit"
          className="w-full rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2.5 transition-colors"
        >
          {initial ? 'Salvar alterações' : 'Adicionar lançamento'}
        </button>
      </form>
    </Modal>
  )
}
