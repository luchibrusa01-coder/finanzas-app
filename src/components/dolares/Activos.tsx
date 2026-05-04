'use client'

import { useState } from 'react'
import { useApp } from '@/context/AppContext'
import { formatUSD } from '@/utils/format'
import { Activo, TipoActivo } from '@/types'

const TIPOS: TipoActivo[] = ['ETF/Acciones', 'FCI/Bonos', 'Crypto', 'Inmueble', 'Efectivo']

const TIPO_COLORS: Record<TipoActivo, string> = {
  'ETF/Acciones': 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  'FCI/Bonos': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
  'Crypto': 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  'Inmueble': 'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300',
  'Efectivo': 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
}

function ActivoForm({ initial, onSave, onCancel }: {
  initial?: Activo
  onSave: (a: Omit<Activo, 'id'>) => void
  onCancel: () => void
}) {
  const [nombre, setNombre] = useState(initial?.nombre ?? '')
  const [monto, setMonto] = useState(initial ? String(initial.monto) : '')
  const [tipo, setTipo] = useState<TipoActivo>(initial?.tipo ?? 'ETF/Acciones')
  const [aporteMensual, setAporteMensual] = useState(initial?.aporteMensual ? String(initial.aporteMensual) : '')
  const [error, setError] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const m = parseFloat(monto.replace(',', '.'))
    const ap = parseFloat(aporteMensual.replace(',', '.')) || 0
    if (!nombre.trim()) { setError('Ingresá un nombre'); return }
    if (isNaN(m) || m < 0) { setError('Monto inválido'); return }
    onSave({ nombre: nombre.trim(), monto: m, tipo, aporteMensual: ap })
  }

  return (
    <form onSubmit={handleSubmit} className="bg-gray-50 dark:bg-gray-700/40 rounded-xl p-3 space-y-2 mt-2">
      <input className="input text-sm" placeholder="Nombre (ej: SPY, Bitcoin...)" value={nombre} onChange={e => setNombre(e.target.value)} />
      <div className="flex gap-2">
        <input className="input flex-1 text-sm" placeholder="Valor actual USD" value={monto} onChange={e => setMonto(e.target.value)} inputMode="decimal" />
        <select className="input flex-1 text-sm" value={tipo} onChange={e => setTipo(e.target.value as TipoActivo)}>
          {TIPOS.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>
      <input
        className="input text-sm"
        placeholder="Aporte mensual estimado USD (para proyección)"
        value={aporteMensual}
        onChange={e => setAporteMensual(e.target.value)}
        inputMode="decimal"
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
      <div className="flex gap-2">
        <button type="submit" className="btn-primary btn-sm flex-1">Guardar</button>
        <button type="button" onClick={onCancel} className="btn-ghost btn-sm flex-1">Cancelar</button>
      </div>
    </form>
  )
}

export default function Activos() {
  const { activos, patrimonioUSD, addActivo, updateActivo, removeActivo } = useApp()
  const [showAdd, setShowAdd] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  return (
    <section className="card">
      <div className="flex justify-between items-center mb-3">
        <h2 className="section-title mb-0">Patrimonio actual</h2>
        {!showAdd && (
          <button onClick={() => setShowAdd(true)} className="btn-primary btn-sm">+ Agregar</button>
        )}
      </div>

      {showAdd && (
        <ActivoForm
          onSave={a => { addActivo(a); setShowAdd(false) }}
          onCancel={() => setShowAdd(false)}
        />
      )}

      {activos.length === 0 && !showAdd ? (
        <p className="text-sm text-gray-400 text-center py-2">Sin activos cargados</p>
      ) : (
        <ul className="divide-y divide-gray-100 dark:divide-gray-700 mt-2">
          {activos.map(a => (
            <li key={a.id}>
              {editingId === a.id ? (
                <ActivoForm
                  initial={a}
                  onSave={data => { updateActivo({ ...a, ...data }); setEditingId(null) }}
                  onCancel={() => setEditingId(null)}
                />
              ) : (
                <div className="flex justify-between items-center py-2 gap-2">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">{a.nombre}</p>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${TIPO_COLORS[a.tipo]}`}>{a.tipo}</span>
                      {a.aporteMensual > 0 && (
                        <span className="text-xs text-gray-400">+{formatUSD(a.aporteMensual)}/mes</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="font-semibold tabular-nums text-blue-700 dark:text-blue-400 text-sm">{formatUSD(a.monto)}</span>
                    <button onClick={() => setEditingId(a.id)} className="text-blue-400 hover:text-blue-600 text-sm">✎</button>
                    <button onClick={() => removeActivo(a.id)} className="text-gray-400 hover:text-red-500 text-sm">✕</button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}

      {activos.length > 0 && (
        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 flex justify-between font-bold">
          <span className="text-gray-700 dark:text-gray-300">Total patrimonio</span>
          <span className="text-blue-700 dark:text-blue-400 tabular-nums">{formatUSD(patrimonioUSD)}</span>
        </div>
      )}
    </section>
  )
}
