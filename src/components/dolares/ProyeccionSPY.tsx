'use client'

import { useApp } from '@/context/AppContext'
import { formatUSD, calcFV } from '@/utils/format'

const YEARS = [1, 2, 3, 5, 7, 10, 15, 20]

export default function ProyeccionSPY() {
  const { patrimonioUSD, sobranteUSD } = useApp()

  const rows = YEARS.map(y => {
    const fv = calcFV(patrimonioUSD, sobranteUSD, y)
    const totalAportado = patrimonioUSD + sobranteUSD * 12 * y
    const ganancia = fv - totalAportado
    return { years: y, fv, totalAportado, ganancia }
  })

  return (
    <section className="card">
      <h2 className="section-title">Proyección SPY — 10% anual</h2>

      <div className="flex gap-4 text-xs text-gray-500 dark:text-gray-400 mb-3">
        <span>Capital actual: <strong className="text-gray-800 dark:text-gray-200">{formatUSD(patrimonioUSD)}</strong></span>
        <span>Aporte mensual: <strong className="text-gray-800 dark:text-gray-200">{formatUSD(sobranteUSD)}</strong></span>
      </div>

      <div className="overflow-x-auto -mx-1">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-xs text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
              <th className="text-left py-2 pr-3 font-medium">Años</th>
              <th className="text-right py-2 pr-3 font-medium">Valor final</th>
              <th className="text-right py-2 pr-3 font-medium">Aportado</th>
              <th className="text-right py-2 font-medium">Ganancia</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50">
            {rows.map(r => (
              <tr key={r.years} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                <td className="py-2 pr-3 font-semibold text-gray-800 dark:text-gray-200">
                  {r.years} {r.years === 1 ? 'año' : 'años'}
                </td>
                <td className="py-2 pr-3 text-right tabular-nums font-bold text-blue-700 dark:text-blue-400">
                  {formatUSD(r.fv)}
                </td>
                <td className="py-2 pr-3 text-right tabular-nums text-gray-600 dark:text-gray-400">
                  {formatUSD(r.totalAportado)}
                </td>
                <td className="py-2 text-right tabular-nums font-semibold text-emerald-600 dark:text-emerald-400">
                  {formatUSD(r.ganancia)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-gray-400 dark:text-gray-500 mt-3">
        Proyección con tasa del 10% anual compuesto, aportes mensuales constantes. No garantiza rendimientos futuros.
      </p>
    </section>
  )
}
