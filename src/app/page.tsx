'use client'

import { useState } from 'react'
import { useApp } from '@/context/AppContext'
import Ingresos from '@/components/pesos/Ingresos'
import Gastos from '@/components/pesos/Gastos'
import ResumenPesos from '@/components/pesos/ResumenPesos'
import Historial from '@/components/pesos/Historial'
import Activos from '@/components/dolares/Activos'
import MovimientosInversion from '@/components/dolares/MovimientosInversion'
import ProyeccionSPY from '@/components/dolares/ProyeccionSPY'
import ResumenDolares from '@/components/dolares/ResumenDolares'
import Configuracion from '@/components/shared/Configuracion'
import ExportarResumen from '@/components/shared/ExportarResumen'

type Tab = 'pesos' | 'dolares' | 'config'

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: 'pesos', label: 'Pesos', icon: '🪙' },
  { id: 'dolares', label: 'Dólares', icon: '💲' },
  { id: 'config', label: 'Config', icon: '⚙️' },
]

export default function Home() {
  const [tab, setTab] = useState<Tab>('pesos')
  const { config } = useApp()

  const fecha = new Date().toLocaleDateString('es-AR', { month: 'long', year: 'numeric' })
  const greeting = config.nombreUsuario ? `Hola, ${config.nombreUsuario}` : 'Mis finanzas'

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur border-b border-gray-200 dark:border-gray-700 px-4 py-3">
        <div className="max-w-2xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="font-bold text-gray-900 dark:text-white text-base leading-tight">{greeting}</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{fecha}</p>
          </div>
          <nav className="hidden sm:flex gap-1">
            {TABS.map(t => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`tab-btn ${tab === t.id ? 'tab-btn-active' : 'tab-btn-inactive'}`}
              >
                <span className="text-lg">{t.icon}</span>
                <span>{t.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-4 pb-24 sm:pb-6 space-y-4">
        {tab === 'pesos' && (
          <>
            <ResumenPesos />
            <Ingresos />
            <Gastos />
            <Historial />
            <div className="pt-1">
              <ExportarResumen />
            </div>
          </>
        )}

        {tab === 'dolares' && (
          <>
            <ResumenDolares />
            <MovimientosInversion />
            <Activos />
            <ProyeccionSPY />
          </>
        )}

        {tab === 'config' && (
          <>
            <Configuracion />
            <div className="pt-1">
              <ExportarResumen />
            </div>
          </>
        )}
      </main>

      {/* Bottom nav — mobile only */}
      <nav className="sm:hidden fixed bottom-0 inset-x-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur border-t border-gray-200 dark:border-gray-700 safe-area-pb z-40">
        <div className="flex justify-around py-1 px-2">
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`tab-btn flex-1 ${tab === t.id ? 'tab-btn-active' : 'tab-btn-inactive'}`}
            >
              <span className="text-xl">{t.icon}</span>
              <span>{t.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  )
}
