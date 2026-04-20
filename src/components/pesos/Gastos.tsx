'use client'

import { useState } from 'react'
import { useApp } from '@/context/AppContext'
import { formatARS } from '@/utils/format'
import GestionCategorias from './GestionCategorias'

export default function Gastos() {
  const { gastos, categorias, totalGastos, addGasto, removeGasto } = useApp()
  const [catId, setCatId] = useState('')
  const [desc, setDesc] = useState('')
  const [monto, setMonto] = useState('')
  const [error, setError] = useState('')
  const [showCats, setShowCats] = useState(false)
  const [filtro, setFiltro] = useState('')

  function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    const m = parseFloat(monto.replace(/\./g, '').replace(',', '.'))
    if (!catId) { setError('Seleccioná una categoría'); return }
    if (!m || m <= 0) { setError('Monto inválido'); return }
    addGasto(catId, desc.trim(), m)
    setDesc('')
    setMonto('')
    setError('')
  }

  const nombreCat = (id: string) => categorias.find(c => c.id === id)?.nombre ?? id

  const gastosFiltrados = filtro
    ? gastos.filter(g => g.categoriaId === filtro)
    : gastos

  return (
    <section className="card">
      <div className="flex justify-between items-center mb-3">
        <h2 className="section-title mb-0">Gastos del mes</h2>
        <button
          onClick={() => setShowCats(true)}
          className="text-xs text-blue-500 hover:text-blue-700 dark:hover:text-blue-300 underline"
        >
          Gestionar categorías
        </button>
      </div>

      <form onSubmit={handleAdd} className="flex flex-col gap-2 mb-4">
        <div className="flex gap-2">
          <select
            className="input flex-1"
            value={catId}
            onChange={e => setCatId(e.target.value)}
          >
            <option value="">Categoría...</option>
            {categorias.map(c => (
              <option key={c.id} value={c.id}>{c.nombre}</option>
            ))}
          </select>
          <input
            className="input w-36"
            placeholder="Monto ARS"
            value={monto}
            onChange={e => setMonto(e.target.value)}
            inputMode="numeric"
          />
        </div>
        <input
          className="input"
          placeholder="Descripción (ej: Galicia, Super Dia...)"
          value={desc}
          onChange={e => setDesc(e.target.value)}
        />
        {error && <p className="text-xs text-red-500">{error}</p>}
        <button type="submit" className="btn-primary">+ Agregar gasto</button>
      </form>

      {/* Filtro por categoría */}
      {gastos.length > 0 && (
        <div className="flex gap-2 mb-3 overflow-x-auto pb-1">
          <button
            onClick={() => setFiltro('')}
            className={`pill ${filtro === '' ? 'pill-active' : 'pill-ghost'}`}
          >
            Todos
          </button>
          {categorias.filter(c => gastos.some(g => g.categoriaId === c.id)).map(c => (
            <button
              key={c.id}
              onClick={() => setFiltro(filtro === c.id ? '' : c.id)}
              className={`pill ${filtro === c.id ? 'pill-active' : 'pill-ghost'}`}
            >
              {c.nombre}
            </button>
          ))}
        </div>
      )}

      {gastosFiltrados.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-2">Sin gastos cargados</p>
      ) : (
        <ul className="divide-y divide-gray-100 dark:divide-gray-700">
          {gastosFiltrados.map(g => (
            <li key={g.id} className="flex justify-between items-center py-2 gap-2">
              <div className="min-w-0">
                <p className="text-sm text-gray-800 dark:text-gray-200 truncate">
                  {g.descripcion || nombreCat(g.categoriaId)}
                </p>
                {g.descripcion && (
                  <p className="text-xs text-gray-400">{nombreCat(g.categoriaId)}</p>
                )}
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className="font-semibold tabular-nums text-rose-600 dark:text-rose-400 text-sm">
                  {formatARS(g.monto)}
                </span>
                <button
                  onClick={() => removeGasto(g.id)}
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
        <span className="text-gray-700 dark:text-gray-300">Total gastos</span>
        <span className="text-rose-600 dark:text-rose-400 tabular-nums">{formatARS(totalGastos)}</span>
      </div>

      {showCats && <GestionCategorias onClose={() => setShowCats(false)} />}
    </section>
  )
}
