'use client'

import { useState } from 'react'
import { useApp } from '@/context/AppContext'
import { formatUSD } from '@/utils/format'

export default function PlanInversion() {
  const { sobranteUSD, asignaciones, addAsignacion, removeAsignacion, updateAsignacion } = useApp()
  const [nombre, setNombre] = useState('')
  const [monto, setMonto] = useState('')
  const [error, setError] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editNombre, setEditNombre] = useState('')
  const [editMonto, setEditMonto] = useState('')

  const totalAsignado = asignaciones.reduce((s, a) => s + a.monto, 0)
  const sinAsignar = sobranteUSD - totalAsignado

  function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    const m = parseFloat(monto.replace(',', '.'))
    if (!nombre.trim()) { setError('Ingresá un nombre'); return }
    if (!m || m <= 0) { setError('Monto inválido'); return }
    if (m > sinAsignar + 0.001) { setError(`Supera el disponible (${formatUSD(sinAsignar)})`); return }
    addAsignacion(nombre.trim(), m)
    setNombre('')
    setMonto('')
    setError('')
  }

  function startEdit(id: string, nombre: string, monto: number) {
    setEditingId(id)
    setEditNombre(nombre)
    setEditMonto(String(monto))
  }

  function saveEdit(id: string) {
    const m = parseFloat(editMonto.replace(',', '.'))
    const currentAsig = asignaciones.find(a => a.id === id)
    const otrosTotal = asignaciones.filter(a => a.id !== id).reduce((s, a) => s + a.monto, 0)
    const disponible = sobranteUSD - otrosTotal
    if (!editNombre.trim() || !m || m <= 0) { setEditingId(null); return }
    if (m > disponible + 0.001) { return }
    updateAsignacion(id, editNombre.trim(), m)
    setEditingId(null)
  }

  const pct = sobranteUSD > 0 ? Math.min((totalAsignado / sobranteUSD) * 100, 100) : 0

  return (
    <section className="card">
      <h2 className="section-title">Plan de inversión mensual</h2>

      {/* Sobrante disponible */}
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-3 mb-4">
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Sobrante disponible este mes</p>
        <p className="text-2xl font-bold text-blue-700 dark:text-blue-400 tabular-nums">
          {formatUSD(sobranteUSD)}
        </p>
        {sobranteUSD <= 0 && (
          <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
            No hay sobrante este mes para invertir
          </p>
        )}
      </div>

      {/* Barra de asignación */}
      {sobranteUSD > 0 && (
        <div className="mb-4">
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
            <span>Asignado: {formatUSD(totalAsignado)}</span>
            <span className={sinAsignar < 0 ? 'text-red-500' : ''}>
              Sin asignar: {formatUSD(Math.max(sinAsignar, 0))}
            </span>
          </div>
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${pct >= 100 ? 'bg-emerald-500' : 'bg-blue-500'}`}
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      )}

      {/* Lista de asignaciones */}
      {asignaciones.length > 0 && (
        <ul className="divide-y divide-gray-100 dark:divide-gray-700 mb-4">
          {asignaciones.map(a => (
            <li key={a.id} className="py-2">
              {editingId === a.id ? (
                <div className="flex gap-2 items-center">
                  <input
                    className="input flex-1 text-sm"
                    value={editNombre}
                    onChange={e => setEditNombre(e.target.value)}
                    placeholder="Nombre"
                  />
                  <input
                    className="input w-28 text-sm"
                    value={editMonto}
                    onChange={e => setEditMonto(e.target.value)}
                    inputMode="decimal"
                    placeholder="USD"
                  />
                  <button onClick={() => saveEdit(a.id)} className="btn-primary btn-sm">✓</button>
                  <button onClick={() => setEditingId(null)} className="btn-ghost btn-sm">✕</button>
                </div>
              ) : (
                <div className="flex justify-between items-center gap-2">
                  <span className="text-sm text-gray-800 dark:text-gray-200">{a.nombre}</span>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="font-semibold tabular-nums text-blue-700 dark:text-blue-400 text-sm">
                      {formatUSD(a.monto)}
                    </span>
                    <button onClick={() => startEdit(a.id, a.nombre, a.monto)} className="text-blue-400 hover:text-blue-600 text-sm">✎</button>
                    <button onClick={() => removeAsignacion(a.id)} className="text-gray-400 hover:text-red-500 text-sm">✕</button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}

      {/* Formulario para agregar */}
      {sobranteUSD > 0 && (
        <form onSubmit={handleAdd} className="flex flex-col gap-2">
          <div className="flex gap-2">
            <input
              className="input flex-1 text-sm"
              placeholder="Instrumento (ej: SPY)"
              value={nombre}
              onChange={e => setNombre(e.target.value)}
            />
            <input
              className="input w-32 text-sm"
              placeholder="Monto USD"
              value={monto}
              onChange={e => setMonto(e.target.value)}
              inputMode="decimal"
            />
          </div>
          {error && <p className="text-xs text-red-500">{error}</p>}
          <button type="submit" className="btn-primary">+ Asignar</button>
        </form>
      )}
    </section>
  )
}
