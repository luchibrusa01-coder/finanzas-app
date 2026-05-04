'use client'

import { useState } from 'react'
import { useApp } from '@/context/AppContext'
import { formatUSD, calcFV } from '@/utils/format'

const YEARS = [1, 2, 3, 5, 7, 10, 15, 20]

export default function ProyeccionInstrumentos() {
  const { asignaciones, activos } = useApp()
  const [abierto, setAbierto] = useState<string | null>(null)

  if (asignaciones.length === 0) {
    return (
      <section className="card">
        <h2 className="section-title">Proyección por instrumento</h2>
        <p className="text-sm text-gray-400 text-center py-4">
          Cargá instrumentos en el plan de inversión para ver las proyecciones
        </p>
      </section>
    )
  }

  return (
    <section className="card">
      <h2 className="section-title">Proyección por instrumento — 10% anual</h2>
      <p className="text-xs text-gray-400 dark:text-gray-500 mb-4">
        Tocá un instrumento para ver su proyección
      </p>

      <div className="space-y-3">
        {asignaciones.map(asig => {
          // Buscar activo con nombre similar para usar como capital inicial
          const activoMatch = activos.find(a =>
            a.nombre.toLowerCase().includes(asig.nombre.toLowerCase()) ||
            asig.nombre.toLowerCase().includes(a.nombre.toLowerCase())
          )
          const capitalActual = activoMatch?.monto ?? 0
          const isOpen = abierto === asig.id

          const rows = YEARS.map(y => {
            const fv = calcFV(capitalActual, asig.monto, y)
            const totalAportado = capitalActual + asig.monto * 12 * y
            const ganancia = fv - totalAportado
            return { years: y, fv, totalAportado, ganancia }
          })

          return (
            <div key={asig.id} className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
              {/* Header del instrumento */}
              <button
                className="w-full flex justify-between items-center p-3 hover:bg-gray-50 dark:hover:bg-gray-700/40 transition-colors"
                onClick={() => setAbierto(isOpen ? null : asig.id)}
              >
                <div className="text-left">
                  <p className="font-semibold text-gray-900 dark:text-white text-sm">{asig.nombre}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Aporte: {formatUSD(asig.monto)}/mes
                    {capitalActual > 0 && ` · Capital: ${formatUSD(capitalActual)}`}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                    {formatUSD(rows[rows.length - 1].fv)} en 20 años
                  </span>
                  <span className="text-gray-400 text-sm">{isOpen ? '▲' : '▼'}</span>
                </div>
              </button>

              {/* Tabla desplegable */}
              {isOpen && (
                <div className="border-t border-gray-200 dark:border-gray-700 overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/30">
                        <th className="text-left py-2 px-3 font-medium">Años</th>
                        <th className="text-right py-2 px-3 font-medium">Valor final</th>
                        <th className="text-right py-2 px-3 font-medium">Aportado</th>
                        <th className="text-right py-2 px-3 font-medium">Ganancia</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50">
                      {rows.map(r => (
                        <tr key={r.years} className="hover:bg-gray-50 dark:hover:bg-gray-700/20">
                          <td className="py-2 px-3 font-semibold text-gray-800 dark:text-gray-200">
                            {r.years} {r.years === 1 ? 'año' : 'años'}
                          </td>
                          <td className="py-2 px-3 text-right tabular-nums font-bold text-blue-700 dark:text-blue-400">
                            {formatUSD(r.fv)}
                          </td>
                          <td className="py-2 px-3 text-right tabular-nums text-gray-600 dark:text-gray-400">
                            {formatUSD(r.totalAportado)}
                          </td>
                          <td className="py-2 px-3 text-right tabular-nums font-semibold text-emerald-600 dark:text-emerald-400">
                            {formatUSD(r.ganancia)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {capitalActual === 0 && (
                    <p className="text-xs text-gray-400 p-3">
                      💡 Si cargás este instrumento en Activos con el mismo nombre, la proyección incluirá tu capital actual.
                    </p>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>

      <p className="text-xs text-gray-400 dark:text-gray-500 mt-4">
        Proyección con tasa del 10% anual compuesto. No garantiza rendimientos futuros.
      </p>
    </section>
  )
}
