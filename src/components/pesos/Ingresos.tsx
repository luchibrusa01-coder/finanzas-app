'use client'

import { useState } from 'react'
import { useApp } from '@/context/AppContext'
import { formatARS } from '@/utils/format'

export default function Ingresos() {
  const { ingresos, totalIngresos, addIngreso, removeIngreso } = useApp()
  const [nombre, setNombre] = useState('')
  const [monto, setMonto] = useState('')
  const [error, setError] = useState('')

  function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    const m = parseFloat(monto.replace(/\./g, '').replace(',', '.'))
    if (!nombre.trim()) { setError('Ingresá un nombre'); return }
    if (!m || m <= 0) { setError('Monto inválido'); return }
    addIngreso(nombre.trim(), m)
    setNombre('')
    setMonto('')
    setError('')
  }

  return (
    <section className="card">
      <h2 className="section-title">Ingresos mensuales</h2>

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
        {error && <p className="text-xs text-red-500">{error}</p>}
        <button type="submit" className="btn-primary">+ Agregar ingreso</button>
      </form>

      {ingresos.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-2">Sin ingresos cargados</p>
      ) : (
        <ul className="divide-y divide-gray-100 dark:divide-gray-700">
          {ingresos.map(i => (
            <li key={i.id} className="flex justify-between items-center py-2 gap-2">
              <span className="text-sm text-gray-800 dark:text-gray-200">{i.nombre}</span>
              <div className="flex items-center gap-3">
                <span className="font-semibold tabular-nums text-emerald-600 dark:text-emerald-400 text-sm">
                  {formatARS(i.monto)}
                </span>
                <button
                  onClick={() => removeIngreso(i.id)}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                  aria-label="Eliminar"
                >
                  ✕
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 flex justify-between font-bold">
        <span className="text-gray-700 dark:text-gray-300">Total ingresos</span>
        <span className="text-emerald-600 dark:text-emerald-400 tabular-nums">{formatARS(totalIngresos)}</span>
      </div>
    </section>
  )
}
