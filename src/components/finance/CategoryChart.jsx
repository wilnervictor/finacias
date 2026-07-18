import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import { usePrefersDark } from '../../hooks/usePrefersDark'
import { categoryColor, CHROME } from '../../lib/colors'
import { EXPENSE_CATEGORIES } from '../../services/financeService'
import { formatCurrency } from '../../lib/format'

function CustomTooltip({ active, payload, chrome }) {
  if (!active || !payload?.length) return null
  const p = payload[0]
  return (
    <div
      className="rounded-lg border px-3 py-2 text-xs shadow-lg"
      style={{ background: chrome.surface, borderColor: chrome.gridline, color: chrome.textPrimary }}
    >
      <span className="inline-block h-2 w-2 rounded-full mr-1.5" style={{ background: p.payload.fill }} />
      {p.name}: <span className="tabular-nums font-medium">{formatCurrency(p.value)}</span>
    </div>
  )
}

export default function CategoryChart({ transactions }) {
  const isDark = usePrefersDark()
  const chrome = isDark ? CHROME.dark : CHROME.light

  const byCategory = EXPENSE_CATEGORIES.map((category, index) => {
    const total = transactions
      .filter((t) => t.type === 'expense' && t.category === category)
      .reduce((sum, t) => sum + t.amount, 0)
    return { category, total, fill: categoryColor(index, isDark) }
  }).filter((c) => c.total > 0)

  const grandTotal = byCategory.reduce((sum, c) => sum + c.total, 0)

  return (
    <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200/70 dark:border-neutral-800 p-4">
      <p className="text-sm font-semibold text-neutral-900 dark:text-white mb-4">
        Despesas por categoria (mês)
      </p>

      {byCategory.length === 0 ? (
        <p className="text-sm text-neutral-500 dark:text-neutral-400 py-10 text-center">
          Sem despesas registradas neste mês.
        </p>
      ) : (
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="relative shrink-0">
            <ResponsiveContainer width={180} height={180}>
              <PieChart>
                <Pie
                  data={byCategory}
                  dataKey="total"
                  nameKey="category"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={2}
                  strokeWidth={2}
                  stroke={chrome.surface}
                >
                  {byCategory.map((c) => (
                    <Cell key={c.category} fill={c.fill} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip chrome={chrome} />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-xs text-neutral-500 dark:text-neutral-400">Total</span>
              <span className="text-sm font-semibold text-neutral-900 dark:text-white tabular-nums">
                {formatCurrency(grandTotal)}
              </span>
            </div>
          </div>

          <ul className="flex-1 w-full space-y-1.5">
            {byCategory
              .slice()
              .sort((a, b) => b.total - a.total)
              .map((c) => (
                <li key={c.category} className="flex items-center justify-between text-sm gap-2">
                  <span className="flex items-center gap-2 text-neutral-700 dark:text-neutral-300 min-w-0">
                    <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ background: c.fill }} />
                    <span className="truncate">{c.category}</span>
                  </span>
                  <span className="text-neutral-900 dark:text-white font-medium tabular-nums whitespace-nowrap">
                    {formatCurrency(c.total)}{' '}
                    <span className="text-neutral-400 dark:text-neutral-500 font-normal">
                      ({Math.round((c.total / grandTotal) * 100)}%)
                    </span>
                  </span>
                </li>
              ))}
          </ul>
        </div>
      )}
    </div>
  )
}
