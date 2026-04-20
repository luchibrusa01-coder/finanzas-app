'use client'

import { useApp } from '@/context/AppContext'
import { formatARS, formatUSD } from '@/utils/format'
import BarChart, { BarItem } from '@/components/BarChart'

export default function ResumenPesos() {
  const { totalIngresos, totalGastos, sobranteARS, sobranteUSD, gastos, categorias, config } = useApp()

  // Build chart data grouped by category
  const porCategoria: Record<string, number> = {}
  for (const g of gastos) {
    porCategoria[g.categoriaId] = (porCategoria[g.categoriaId] ?? 0) + g.monto
  }

  const chartItems: BarItem[] = Object.entries(porCategoria)
    .map(([catId, valor], i) => ({
      label: categorias.find(c => c.id === catId)?.nombre ?? catId,
      value: valor,
      percentage: totalGastos > 0 ? (valor / totalGastos) * 100 : 0,
      colorIndex: i,
    }))
    .sort((a, b) => b.value - a.value)

  return (
    <section className="card">
      <h2 className="section-title">Resumen del mes</h2>

      <div className="grid grid-cols-2 gap-3 mb-5">
        <div className="stat-card bg-emerald-50 dark:bg-emerald-900/20">
          <p className="stat-label">Ingresos</p>
          <p className="stat-value text-emerald-700 dark:text-emerald-400">{formatARS(totalIngresos)}</p>
        </div>
        <div className="stat-card bg-rose-50 dark:bg-rose-900/20">
          <p className="stat-label">Gastos</p>
          <p className="stat-value text-rose-700 dark:text-rose-400">{formatARS(totalGastos)}</p>
        </div>
        <div className={`stat-card col-span-2 ${sobranteARS >= 0 ? 'bg-blue-50 dark:bg-blue-900/20' : 'bg-amber-50 dark:bg-amber-900/20'}`}>
          <p className="stat-label">Sobrante del mes</p>
          <p className={`stat-value ${sobranteARS >= 0 ? 'text-blue-700 dark:text-blue-400' : 'text-amber-700 dark:text-amber-400'}`}>
            {formatARS(sobranteARS)}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            = {formatUSD(sobranteUSD)}{' '}
            <span className="opacity-60">(TC: $ {config.tipoCambio.toLocaleString('es-AR')})</span>
          </p>
        </div>
      </div>

      {chartItems.length > 0 && (
        <>
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
            Distribución por categoría
          </h3>
          <BarChart items={chartItems} formatValue={formatARS} />
        </>
      )}
    </section>
  )
}
