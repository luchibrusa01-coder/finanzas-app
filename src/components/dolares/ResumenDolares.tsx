'use client'

import { useApp } from '@/context/AppContext'
import { formatUSD, calcFV } from '@/utils/format'
import BarChart, { BarItem } from '@/components/BarChart'
import { TipoActivo } from '@/types'

const TIPO_COLOR_INDEX: Record<TipoActivo, number> = {
  'ETF/Acciones': 0,
  'FCI/Bonos': 2,
  'Crypto': 3,
  'Inmueble': 4,
  'Efectivo': 6,
}

const PROYECCION_YEARS = [5, 10, 15]

export default function ResumenDolares() {
  const { activos, patrimonioUSD } = useApp()

  const porTipo: Partial<Record<TipoActivo, number>> = {}
  for (const a of activos) {
    porTipo[a.tipo] = (porTipo[a.tipo] ?? 0) + a.monto
  }

  const chartItems: BarItem[] = Object.entries(porTipo).map(([tipo, valor]) => ({
    label: tipo,
    value: valor,
    percentage: patrimonioUSD > 0 ? (valor / patrimonioUSD) * 100 : 0,
    colorIndex: TIPO_COLOR_INDEX[tipo as TipoActivo],
  })).sort((a, b) => b.value - a.value)

  // Aporte mensual total = suma de aportes de todos los activos
  const aporteMensualTotal = activos.reduce((s, a) => s + (a.aporteMensual ?? 0), 0)

  const proyecciones = PROYECCION_YEARS.map(y => ({
    years: y,
    valor: calcFV(patrimonioUSD, aporteMensualTotal, y),
  }))

  return (
    <section className="card">
      <h2 className="section-title">Resumen de inversiones</h2>

      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 mb-5">
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Patrimonio total</p>
        <p className="text-3xl font-bold text-blue-700 dark:text-blue-400 tabular-nums">
          {formatUSD(patrimonioUSD)}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          {activos.length} {activos.length === 1 ? 'activo' : 'activos'}
        </p>
      </div>

      {chartItems.length > 0 && (
        <div className="mb-5">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
            Distribución por tipo
          </h3>
          <BarChart items={chartItems} formatValue={formatUSD} />
        </div>
      )}

      <div>
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
          Proyección patrimonial (10% anual)
        </h3>
        <div className="grid grid-cols-3 gap-2">
          {proyecciones.map(p => (
            <div key={p.years} className="bg-gray-50 dark:bg-gray-700/40 rounded-xl p-3 text-center">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{p.years} años</p>
              <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
                {formatUSD(p.valor)}
              </p>
            </div>
          ))}
        </div>
        {aporteMensualTotal > 0 && (
          <p className="text-xs text-gray-400 mt-2">
            Aporte mensual total: {formatUSD(aporteMensualTotal)}
          </p>
        )}
      </div>
    </section>
  )
}
