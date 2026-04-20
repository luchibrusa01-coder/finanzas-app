'use client'

import { useState } from 'react'
import { useApp } from '@/context/AppContext'

export default function GestionCategorias({ onClose }: { onClose: () => void }) {
  const { categorias, gastos, addCategoria, updateCategoria, removeCategoria } = useApp()
  const [nueva, setNueva] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editNombre, setEditNombre] = useState('')
  const [msg, setMsg] = useState('')

  function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    if (!nueva.trim()) return
    addCategoria(nueva.trim())
    setNueva('')
  }

  function startEdit(id: string, nombre: string) {
    setEditingId(id)
    setEditNombre(nombre)
    setMsg('')
  }

  function saveEdit(id: string) {
    if (editNombre.trim()) updateCategoria(id, editNombre.trim())
    setEditingId(null)
  }

  function handleDelete(id: string) {
    const ok = removeCategoria(id)
    if (!ok) setMsg('No se puede eliminar: tiene gastos cargados')
  }

  const gastosCount = (id: string) => gastos.filter(g => g.categoriaId === id).length

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-end sm:items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md shadow-2xl">
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="font-bold text-gray-900 dark:text-white">Gestionar categorías</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">✕</button>
        </div>

        <div className="p-4 space-y-3 max-h-[60vh] overflow-y-auto">
          {msg && <p className="text-xs text-red-500 bg-red-50 dark:bg-red-900/20 p-2 rounded">{msg}</p>}

          {categorias.map(c => (
            <div key={c.id} className="flex items-center gap-2">
              {editingId === c.id ? (
                <>
                  <input
                    className="input flex-1 text-sm"
                    value={editNombre}
                    onChange={e => setEditNombre(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && saveEdit(c.id)}
                    autoFocus
                  />
                  <button onClick={() => saveEdit(c.id)} className="btn-sm btn-primary">✓</button>
                  <button onClick={() => setEditingId(null)} className="btn-sm btn-ghost">✕</button>
                </>
              ) : (
                <>
                  <span className="flex-1 text-sm text-gray-800 dark:text-gray-200">{c.nombre}</span>
                  {gastosCount(c.id) > 0 && (
                    <span className="text-xs text-gray-400">({gastosCount(c.id)} gastos)</span>
                  )}
                  <button onClick={() => startEdit(c.id, c.nombre)} className="text-blue-500 hover:text-blue-700 text-sm">✎</button>
                  <button
                    onClick={() => { setMsg(''); handleDelete(c.id) }}
                    className="text-gray-400 hover:text-red-500 text-sm"
                    disabled={gastosCount(c.id) > 0}
                  >
                    ✕
                  </button>
                </>
              )}
            </div>
          ))}
        </div>

        <form onSubmit={handleAdd} className="flex gap-2 p-4 border-t border-gray-200 dark:border-gray-700">
          <input
            className="input flex-1 text-sm"
            placeholder="Nueva categoría..."
            value={nueva}
            onChange={e => setNueva(e.target.value)}
          />
          <button type="submit" className="btn-primary btn-sm">Agregar</button>
        </form>
      </div>
    </div>
  )
}
