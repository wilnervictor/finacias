import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { usePrefersDark } from '../../hooks/usePrefersDark'
import { CHROME, CATEGORICAL } from '../../lib/colors'
import { formatCurrency, formatMonthShort } from '../../lib/format'

function CustomTooltip({ active, payload, label, chrome }) {
  if (!active || !payload?.length) return null
  return (
    <div
      className="rounded-lg border px-3 py-2 text-xs shadow-lg"
      style={{ background: chrome.surface, borderColor: chrome.gridline, color: chrome.textPrimary }}
    >
      <p className="font-medium mb-1">{label}</p>
      {payload.map((p) => (
        <p key={p.dataKey} style={{ color: chrome.textSecondary }}>
          <span className="inline-block h-2 w-2 rounded-full mr-1.5" style={{ background: p.fill }} />
          {p.name}: <span className="tabular-nums">{formatCurrency(p.value)}</span>
        </p>
      ))}
    </div>
  )
}

export default function MonthlyChart({ data }) {
  const isDark = usePrefersDark()
  const chrome = isDark ? CHROME.dark : CHROME.light
  const palette = isDark ? CATEGORICAL.dark : CATEGORICAL.light
  const chartData = data.map((d) => ({ ...d, label: formatMonthShort(d.month) }))

  return (
    <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200/70 dark:border-neutral-800 p-4">
      <p className="text-sm font-semibold text-neutral-900 dark:text-white mb-4">
        Receitas x despesas (últimos 6 meses)
      </p>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={chartData} margin={{ left: 0, right: 0, top: 4, bottom: 0 }}>
          <CartesianGrid vertical={false} stroke={chrome.gridline} />
          <XAxis
            dataKey="label"
            axisLine={{ stroke: chrome.axis }}
            tickLine={false}
            tick={{ fill: chrome.textMuted, fontSize: 12 }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: chrome.textMuted, fontSize: 12 }}
            tickFormatter={(v) => formatCurrency(v)}
            width={80}
          />
          <Tooltip content={<CustomTooltip chrome={chrome} />} cursor={{ fill: chrome.gridline, opacity: 0.4 }} />
          <Legend
            wrapperStyle={{ fontSize: 13, color: chrome.textSecondary }}
            formatter={(value) => <span style={{ color: chrome.textSecondary }}>{value}</span>}
          />
          <Bar dataKey="income" name="Receitas" fill={palette[0]} radius={[4, 4, 0, 0]} maxBarSize={28} />
          <Bar dataKey="expense" name="Despesas" fill={palette[7]} radius={[4, 4, 0, 0]} maxBarSize={28} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
