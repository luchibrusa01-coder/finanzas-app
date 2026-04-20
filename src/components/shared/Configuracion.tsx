'use client'

import { useState } from 'react'
import { useApp } from '@/context/AppContext'

export default function Configuracion() {
  const { config, updateConfig } = useApp()
  const [tc, setTc] = useState(String(config.tipoCambio))
  const [nombre, setNombre] = useState(config.nombreUsuario)
  const [saved, setSaved] = useState(false)

  function handleSave(e: React.FormEvent) {
    e.preventDefault()
    const tipoCambio = parseFloat(tc.replace(/\./g, '').replace(',', '.'))
    if (!tipoCambio || tipoCambio <= 0) return
    updateConfig({ tipoCambio, nombreUsuario: nombre.trim() })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <section className="card">
      <h2 className="section-title">Configuración</h2>

      <form onSubmit={handleSave} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Tu nombre
          </label>
          <input
            className="input"
            placeholder="Nombre (opcional)"
            value={nombre}
            onChange={e => setNombre(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Tipo de cambio ARS / USD
          </label>
          <div className="flex items-center gap-2">
            <span className="text-gray-500 dark:text-gray-400 text-sm">$ 1 USD =</span>
            <input
              className="input flex-1"
              placeholder="Ej: 1400"
              value={tc}
              onChange={e => { setTc(e.target.value); setSaved(false) }}
              inputMode="numeric"
            />
            <span className="text-gray-500 dark:text-gray-400 text-sm">ARS</span>
          </div>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
            Actualmente: $ {config.tipoCambio.toLocaleString('es-AR')} ARS por USD
          </p>
        </div>

        <button type="submit" className="btn-primary w-full">
          {saved ? '✓ Guardado' : 'Guardar configuración'}
        </button>
      </form>

      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <p className="text-xs text-gray-400 dark:text-gray-500 text-center">
          Todos los datos se guardan localmente en este dispositivo.<br />
          No se envía ninguna información a servidores externos.
        </p>
      </div>
    </section>
  )
}
