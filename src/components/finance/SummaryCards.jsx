import { ArrowUpIcon, ArrowDownIcon, ScaleIcon, WalletIcon } from '../icons'
import { formatCurrency } from '../../lib/format'

function StatCard({ label, value, icon, tone }) {
  const Icon = icon
  const tones = {
    good: 'text-[#006300] dark:text-[#0ca30c] bg-green-50 dark:bg-green-950/40',
    critical: 'text-[#d03b3b] bg-red-50 dark:bg-red-950/40',
    neutral: 'text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40',
  }

  return (
    <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200/70 dark:border-neutral-800 p-4 flex items-start justify-between">
      <div>
        <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-1.5">{label}</p>
        <p className="text-xl font-semibold text-neutral-900 dark:text-white tabular-nums">
          {formatCurrency(value)}
        </p>
      </div>
      <div className={`h-9 w-9 rounded-lg flex items-center justify-center shrink-0 ${tones[tone]}`}>
        <Icon className="h-4.5 w-4.5" />
      </div>
    </div>
  )
}

export default function SummaryCards({ income, expense, monthBalance, totalBalance }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard label="Receitas do mês" value={income} icon={ArrowUpIcon} tone="good" />
      <StatCard label="Despesas do mês" value={expense} icon={ArrowDownIcon} tone="critical" />
      <StatCard
        label="Saldo do mês"
        value={monthBalance}
        icon={ScaleIcon}
        tone={monthBalance >= 0 ? 'good' : 'critical'}
      />
      <StatCard label="Saldo total" value={totalBalance} icon={WalletIcon} tone="neutral" />
    </div>
  )
}
