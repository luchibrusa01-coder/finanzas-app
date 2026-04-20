'use client'

const COLORS = [
  'bg-blue-500', 'bg-emerald-500', 'bg-amber-500', 'bg-rose-500',
  'bg-violet-500', 'bg-pink-500', 'bg-indigo-500', 'bg-orange-500',
  'bg-teal-500', 'bg-cyan-500', 'bg-lime-500', 'bg-red-500',
]

export interface BarItem {
  label: string
  value: number
  percentage: number
  colorIndex?: number
}

interface BarChartProps {
  items: BarItem[]
  formatValue: (v: number) => string
}

export default function BarChart({ items, formatValue }: BarChartProps) {
  if (items.length === 0) {
    return (
      <p className="text-sm text-gray-400 dark:text-gray-500 text-center py-4">
        Sin datos para mostrar
      </p>
    )
  }

  return (
    <div className="space-y-3">
      {items.map((item, i) => {
        const color = COLORS[(item.colorIndex ?? i) % COLORS.length]
        return (
          <div key={item.label}>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-700 dark:text-gray-300 truncate max-w-[55%]">
                {item.label}
              </span>
              <span className="text-gray-600 dark:text-gray-400 tabular-nums text-xs">
                {formatValue(item.value)}{' '}
                <span className="font-semibold text-gray-800 dark:text-gray-200">
                  {item.percentage.toFixed(1)}%
                </span>
              </span>
            </div>
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className={`h-full ${color} rounded-full transition-all duration-500`}
                style={{ width: `${Math.min(item.percentage, 100)}%` }}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}
