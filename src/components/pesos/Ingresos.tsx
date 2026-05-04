'use client'

import { useState } from 'react'
import { useApp } from '@/context/AppContext'
import { formatARS } from '@/utils/format'

export default function Ingresos() {
  const { ingresos, totalIngresos, addIngreso, removeIngreso } = useApp()
  const [nombre, setNombre] = useState('')
  const [monto, setMonto] = useState('')
  const [fijo, setFijo] = useState(true)
  const [error, setError] = useState('')

  function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    const m = parseFloat(monto.replace(/\./g, '').replace(',', '.'))
    if (!nombre.trim()) { setError('Ingresá un nombre'); return }
    if (!m || m <= 0) { setError('Monto inválido'); return }
    addIngreso(nombre.trim(), m, fijo)
    setNombre('')
    setMonto('')
    setError('')
  }

  const fijos = ingresos.filter(i => i.fijo)
  const variables = ingresos.filter(i => !i.fijo)

  return (
    <section className="card">
      <h2 className="section-title">Ingresos del mes</h2>

      <form onSubmit={handleAdd} className="flex flex-col gap-2 mb-4">
        <div className="flex gap-2">
          <input
            className="input flex-1"
            placeholder="Nombre (ej: Sueldo)"
            value={nombre}
            onChange={e => setNombre(e.target.value)}
          />
          <input
            className="input w-36"
            placeholder="Monto ARS"
            value={monto}
            onChange={e => setMonto(e.target.value)}
            inputMode="numeric"
          />
        </div>

        {/* Toggle fijo/variable */}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setFijo(true)}
            className={`flex-1 py-1.5 rounded-xl text-xs font-semibold border transition-colors ${
              fijo
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white dark:bg-gray-700 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-600'
            }`}
          >
            Fijo
          </button>
          <button
            type="button"
            onClick={() => setFijo(false)}
            className={`flex-1 py-1.5 rounded-xl text-xs font-semibold border transition-colors ${
              !fijo
                ? 'bg-amber-500 text-white border-amber-500'
                : 'bg-white dark:bg-gray-700 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-600'
            }`}
          >
            Variable
          </button>
        </div>

        {error && <p className="text-xs text-red-500">{error}</p>}
        <button type="submit" className="btn-primary">+ Agregar ingreso</button>
      </form>

      {ingresos.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-2">Sin ingresos cargados</p>
      ) : (
        <div className="space-y-3">
          {fijos.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-1 uppercase tracking-wide">
                Fijos
              </p>
              <ul className="divide-y divide-gray-100 dark:divide-gray-700">
                {fijos.map(i => (
                  <li key={i.id} className="flex justify-between items-center py-2 gap-2">
                    <span className="text-sm text-gray-800 dark:text-gray-200">{i.nombre}</span>
                    <div className="flex items-center gap-3">
                      <span className="font-semibold tabular-nums text-emerald-600 dark:text-emerald-400 text-sm">
                        {formatARS(i.monto)}
                      </span>
                      <button onClick={() => removeIngreso(i.id)} className="text-gray-400 hover:text-red-500">✕</button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {variables.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-amber-500 mb-1 uppercase tracking-wide">
                Variables
              </p>
              <ul className="divide-y divide-gray-100 dark:divide-gray-700">
                {variables.map(i => (
                  <li key={i.id} className="flex justify-between items-center py-2 gap-2">
                    <span className="text-sm text-gray-800 dark:text-gray-200">{i.nombre}</span>
                    <div className="flex items-center gap-3">
                      <span className="font-semibold tabular-nums text-emerald-600 dark:text-emerald-400 text-sm">
                        {formatARS(i.monto)}
                      </span>
                      <button onClick={() => removeIngreso(i.id)} className="text-gray-400 hover:text-red-500">✕</button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 flex justify-between font-bold">
        <span className="text-gray-700 dark:text-gray-300">Total ingresos</span>
        <span className="text-emerald-600 dark:text-emerald-400 tabular-nums">{formatARS(totalIngresos)}</span>
      </div>
    </section>
  )
}
