import { PencilIcon, TrashIcon } from '../icons'
import { formatCurrency, formatDate } from '../../lib/format'
import { EXPENSE_CATEGORIES } from '../../services/financeService'
import { categoryColor } from '../../lib/colors'
import { usePrefersDark } from '../../hooks/usePrefersDark'

export default function TransactionsTable({ transactions, onEdit, onDelete }) {
  const isDark = usePrefersDark()
  const sorted = [...transactions].sort((a, b) => (a.date < b.date ? 1 : -1))

  if (sorted.length === 0) {
    return (
      <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200/70 dark:border-neutral-800 p-10 text-center">
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          Nenhum lançamento neste mês ainda. Adicione o primeiro acima.
        </p>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200/70 dark:border-neutral-800 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-neutral-100 dark:border-neutral-800 text-left text-xs text-neutral-500 dark:text-neutral-400">
              <th className="px-4 py-3 font-medium">Data</th>
              <th className="px-4 py-3 font-medium">Descrição</th>
              <th className="px-4 py-3 font-medium">Categoria</th>
              <th className="px-4 py-3 font-medium text-right">Valor</th>
              <th className="px-4 py-3 font-medium text-right">Ações</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((t) => {
              const expenseIndex = EXPENSE_CATEGORIES.indexOf(t.category)
              const dotColor =
                t.type === 'expense' && expenseIndex !== -1
                  ? categoryColor(expenseIndex, isDark)
                  : '#0ca30c'

              return (
                <tr
                  key={t.id}
                  className="border-b border-neutral-50 dark:border-neutral-800/60 last:border-0 hover:bg-neutral-50/70 dark:hover:bg-neutral-800/40"
                >
                  <td className="px-4 py-3 text-neutral-500 dark:text-neutral-400 whitespace-nowrap tabular-nums">
                    {formatDate(t.date)}
                  </td>
                  <td className="px-4 py-3 text-neutral-900 dark:text-white">{t.description}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1.5 text-neutral-600 dark:text-neutral-300">
                      <span
                        className="h-2 w-2 rounded-full shrink-0"
                        style={{ backgroundColor: dotColor }}
                      />
                      {t.category}
                    </span>
                  </td>
                  <td
                    className={`px-4 py-3 text-right font-medium tabular-nums whitespace-nowrap ${
                      t.type === 'income'
                        ? 'text-[#006300] dark:text-[#0ca30c]'
                        : 'text-[#d03b3b]'
                    }`}
                  >
                    {t.type === 'income' ? '+' : '-'} {formatCurrency(t.amount)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => onEdit(t)}
                        className="h-8 w-8 flex items-center justify-center rounded-lg text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors"
                        aria-label="Editar"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => onDelete(t.id)}
                        className="h-8 w-8 flex items-center justify-center rounded-lg text-neutral-400 hover:bg-red-50 dark:hover:bg-red-950/40 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                        aria-label="Excluir"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
