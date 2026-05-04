'use client'

import { useState } from 'react'
import { useApp } from '@/context/AppContext'
import { formatARS, formatUSD } from '@/utils/format'

export default function Historial() {
  const { historial, eliminarHistorial, cerrarMes, totalIngresos, totalGastos } = useApp()
  const [confirmCerrar, setConfirmCerrar] = useState(false)
  const [confirmEliminar, setConfirmEliminar] = useState<string | null>(null)

  function handleCerrar() {
    cerrarMes()
    setConfirmCerrar(false)
  }

  return (
    <section className="card">
      <div className="flex justify-between items-center mb-3">
        <h2 className="section-title mb-0">Historial mensual</h2>
        <button
          onClick={() => setConfirmCerrar(true)}
          className="btn-primary btn-sm"
          disabled={totalIngresos === 0 && totalGastos === 0}
        >
          Cerrar mes
        </button>
      </div>

      {/* Confirm cerrar mes */}
      {confirmCerrar && (
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-xl p-3 mb-4">
          <p className="text-sm text-amber-800 dark:text-amber-300 font-medium mb-1">
            ¿Cerrás el mes actual?
          </p>
          <p className="text-xs text-amber-700 dark:text-amber-400 mb-3">
            Se va a guardar el resumen y se van a borrar todos los gastos. Los ingresos quedan para el mes que viene.
          </p>
          <div className="flex gap-2">
            <button onClick={handleCerrar} className="btn-primary btn-sm flex-1">
              Sí, cerrar mes
            </button>
            <button onClick={() => setConfirmCerrar(false)} className="btn-ghost btn-sm flex-1">
              Cancelar
            </button>
          </div>
        </div>
      )}

      {historial.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-4">
          Todavía no cerraste ningún mes
        </p>
      ) : (
        <ul className="space-y-3">
          {historial.map(h => (
            <li key={h.id} className="border border-gray-100 dark:border-gray-700 rounded-xl p-3">
              <div className="flex justify-between items-start mb-2">
                <p className="font-semibold text-gray-900 dark:text-white capitalize text-sm">{h.mes}</p>
                {confirmEliminar === h.id ? (
                  <div className="flex gap-1">
                    <button
                      onClick={() => { eliminarHistorial(h.id); setConfirmEliminar(null) }}
                      className="text-xs text-red-500 hover:text-red-700 font-medium"
                    >
                      Confirmar
                    </button>
                    <span className="text-gray-300 dark:text-gray-600">·</span>
                    <button
                      onClick={() => setConfirmEliminar(null)}
                      className="text-xs text-gray-400 hover:text-gray-600"
                    >
                      Cancelar
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setConfirmEliminar(h.id)}
                    className="text-gray-300 dark:text-gray-600 hover:text-red-400 text-sm"
                  >
                    ✕
                  </button>
                )}
              </div>

              <div className="grid grid-cols-3 gap-2 text-center">
                <div>
                  <p className="text-xs text-gray-400 dark:text-gray-500">Ingresos</p>
                  <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 tabular-nums">
                    {formatARS(h.totalIngresos)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 dark:text-gray-500">Gastos</p>
                  <p className="text-sm font-semibold text-rose-600 dark:text-rose-400 tabular-nums">
                    {formatARS(h.totalGastos)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 dark:text-gray-500">Sobrante</p>
                  <p className={`text-sm font-semibold tabular-nums ${h.sobranteARS >= 0 ? 'text-blue-600 dark:text-blue-400' : 'text-amber-600 dark:text-amber-400'}`}>
                    {formatARS(h.sobranteARS)}
                  </p>
                </div>
              </div>

              <p className="text-xs text-gray-400 dark:text-gray-500 text-center mt-1">
                = {formatUSD(h.sobranteUSD)} · TC $ {h.tipoCambio.toLocaleString('es-AR')}
              </p>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
