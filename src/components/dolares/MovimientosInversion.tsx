'use client'

import { useState } from 'react'
import { useApp } from '@/context/AppContext'
import { formatUSD } from '@/utils/format'
import { TipoActivo } from '@/types'

const TIPOS: TipoActivo[] = ['ETF/Acciones', 'FCI/Bonos', 'Crypto', 'Inmueble', 'Efectivo']

export default function MovimientosInversion() {
  const { activos, movimientos, totalInvertidoMes, addMovimiento, addMovimientoNuevo, removeMovimiento } = useApp()
  const [esNuevo, setEsNuevo] = useState(false)
  const [activoId, setActivoId] = useState('')
  const [nombre, setNombre] = useState('')
  const [tipo, setTipo] = useState<TipoActivo>('ETF/Acciones')
  const [monto, setMonto] = useState('')
  const [error, setError] = useState('')

  function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    const m = parseFloat(monto.replace(',', '.'))
    if (!m || m <= 0) { setError('Monto inválido'); return }

    if (esNuevo) {
      if (!nombre.trim()) { setError('Ingresá un nombre'); return }
      addMovimientoNuevo(nombre.trim(), tipo, m)
      setNombre('')
    } else {
      if (!activoId) { setError('Seleccioná un activo'); return }
      const activo = activos.find(a => a.id === activoId)
      if (!activo) return
      addMovimiento(activo.nombre, activoId, m)
      setActivoId('')
    }

    setMonto('')
    setError('')
  }

  return (
    <section className="card">
      <div className="flex justify-between items-center mb-3">
        <h2 className="section-title mb-0">Inversiones del mes</h2>
        {totalInvertidoMes > 0 && (
          <span className="text-sm font-bold text-blue-700 dark:text-blue-400 tabular-nums">
            Total: {formatUSD(totalInvertidoMes)}
          </span>
        )}
      </div>

      <form onSubmit={handleAdd} className="flex flex-col gap-2 mb-4">
        {/* Toggle activo existente / nuevo */}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => { setEsNuevo(false); setError('') }}
            className={`flex-1 py-1.5 rounded-xl text-xs font-semibold border transition-colors ${
              !esNuevo
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white dark:bg-gray-700 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-600'
            }`}
          >
            Activo existente
          </button>
          <button
            type="button"
            onClick={() => { setEsNuevo(true); setError('') }}
            className={`flex-1 py-1.5 rounded-xl text-xs font-semibold border transition-colors ${
              esNuevo
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white dark:bg-gray-700 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-600'
            }`}
          >
            + Nuevo activo
          </button>
        </div>

        {esNuevo ? (
          <>
            <input
              className="input text-sm"
              placeholder="Nombre del instrumento (ej: SPY, CEDEARS...)"
              value={nombre}
              onChange={e => setNombre(e.target.value)}
            />
            <select className="input text-sm" value={tipo} onChange={e => setTipo(e.target.value as TipoActivo)}>
              {TIPOS.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </>
        ) : (
          <select
            className="input text-sm"
            value={activoId}
            onChange={e => setActivoId(e.target.value)}
          >
            <option value="">Seleccioná el instrumento...</option>
            {activos.map(a => (
              <option key={a.id} value={a.id}>{a.nombre} — {formatUSD(a.monto)}</option>
            ))}
          </select>
        )}

        <input
          className="input text-sm"
          placeholder="Monto invertido (USD)"
          value={monto}
          onChange={e => setMonto(e.target.value)}
          inputMode="decimal"
        />

        {error && <p className="text-xs text-red-500">{error}</p>}
        <button type="submit" className="btn-primary">+ Registrar inversión</button>
      </form>

      {movimientos.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-2">Sin inversiones registradas este mes</p>
      ) : (
        <ul className="divide-y divide-gray-100 dark:divide-gray-700">
          {movimientos.map(m => {
            const activo = activos.find(a => a.id === m.activoId)
            return (
              <li key={m.id} className="flex justify-between items-center py-2 gap-2">
                <div>
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{m.nombre}</p>
                  {activo && <p className="text-xs text-gray-400">{activo.tipo}</p>}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="font-semibold tabular-nums text-blue-700 dark:text-blue-400 text-sm">
                    {formatUSD(m.monto)}
                  </span>
                  <button onClick={() => removeMovimiento(m.id)} className="text-gray-400 hover:text-red-500 text-sm">✕</button>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}
