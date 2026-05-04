'use client'

import { useState } from 'react'
import { useApp } from '@/context/AppContext'
import { formatARS, formatUSD } from '@/utils/format'
import BarChart, { BarItem } from '@/components/BarChart'
import { Categoria } from '@/types'

function DetalleCategoriaModal({
  categoria,
  onClose,
}: {
  categoria: Categoria
  onClose: () => void
}) {
  const { gastos } = useApp()
  const gastosCat = gastos.filter(g => g.categoriaId === categoria.id)
  const total = gastosCat.reduce((s, g) => s + g.monto, 0)

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-end sm:items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md shadow-2xl">
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h3 className="font-bold text-gray-900 dark:text-white">{categoria.nombre}</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">{gastosCat.length} gastos</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-xl">✕</button>
        </div>

        <div className="p-4 max-h-[60vh] overflow-y-auto">
          {gastosCat.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-4">Sin gastos en esta categoría</p>
          ) : (
            <ul className="divide-y divide-gray-100 dark:divide-gray-700">
              {gastosCat.map(g => (
                <li key={g.id} className="flex justify-between items-center py-3 gap-2">
                  <span className="text-sm text-gray-800 dark:text-gray-200">
                    {g.descripcion || categoria.nombre}
                  </span>
                  <span className="font-semibold tabular-nums text-rose-600 dark:text-rose-400 text-sm shrink-0">
                    {formatARS(g.monto)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-between font-bold">
          <span className="text-gray-700 dark:text-gray-300">Total</span>
          <span className="text-rose-600 dark:text-rose-400 tabular-nums">{formatARS(total)}</span>
        </div>
      </div>
    </div>
  )
}

export default function ResumenPesos() {
  const { totalIngresos, totalGastos, sobranteARS, sobranteUSD, gastos, categorias, config } = useApp()
  const [catSeleccionada, setCatSeleccionada] = useState<Categoria | null>(null)

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
      catId,
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
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
            Distribución por categoría
          </h3>
          <p className="text-xs text-gray-400 dark:text-gray-500 mb-3">
            Tocá una categoría para ver el detalle
          </p>
          <div className="space-y-3">
            {chartItems.map((item, i) => {
              const cat = categorias.find(c => c.id === (item as any).catId)
              return (
                <button
                  key={item.label}
                  className="w-full text-left group"
                  onClick={() => cat && setCatSeleccionada(cat)}
                >
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-700 dark:text-gray-300 truncate max-w-[55%] group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {item.label}
                    </span>
                    <span className="text-gray-600 dark:text-gray-400 tabular-nums text-xs">
                      {formatARS(item.value)}{' '}
                      <span className="font-semibold text-gray-800 dark:text-gray-200">
                        {item.percentage.toFixed(1)}%
                      </span>
                    </span>
                  </div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        ['bg-blue-500','bg-emerald-500','bg-amber-500','bg-rose-500','bg-violet-500','bg-pink-500','bg-indigo-500','bg-orange-500'][i % 8]
                      }`}
                      style={{ width: `${Math.min(item.percentage, 100)}%` }}
                    />
                  </div>
                </button>
              )
            })}
          </div>
        </>
      )}

      {catSeleccionada && (
        <DetalleCategoriaModal
          categoria={catSeleccionada}
          onClose={() => setCatSeleccionada(null)}
        />
      )}
    </section>
  )
}
