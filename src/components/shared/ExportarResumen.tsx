'use client'

import { useState } from 'react'
import { useApp } from '@/context/AppContext'
import { formatARS, formatUSD } from '@/utils/format'

export default function ExportarResumen() {
  const {
    config, ingresos, gastos, categorias,
    totalIngresos, totalGastos, sobranteARS, sobranteUSD,
    activos, patrimonioUSD, movimientos,
  } = useApp()
  const [show, setShow] = useState(false)
  const [copied, setCopied] = useState(false)

  function buildText() {
    const fecha = new Date().toLocaleDateString('es-AR', { month: 'long', year: 'numeric' })
    const saludo = config.nombreUsuario ? `${config.nombreUsuario} — ` : ''
    const lines: string[] = [
      `📊 ${saludo}Resumen financiero — ${fecha}`,
      '',
      '💵 FINANZAS EN PESOS',
      '─────────────────────',
    ]

    if (ingresos.length) {
      lines.push('Ingresos:')
      ingresos.forEach(i => lines.push(`  • ${i.nombre} (${i.fijo ? 'Fijo' : 'Variable'}): ${formatARS(i.monto)}`))
    }
    lines.push(`Total ingresos: ${formatARS(totalIngresos)}`)
    lines.push('')

    if (gastos.length) {
      lines.push('Gastos por categoría:')
      const porCat: Record<string, number> = {}
      gastos.forEach(g => { porCat[g.categoriaId] = (porCat[g.categoriaId] ?? 0) + g.monto })
      Object.entries(porCat).sort((a, b) => b[1] - a[1]).forEach(([catId, monto]) => {
        const nombre = categorias.find(c => c.id === catId)?.nombre ?? catId
        const pct = totalGastos > 0 ? ((monto / totalGastos) * 100).toFixed(1) : '0'
        lines.push(`  • ${nombre}: ${formatARS(monto)} (${pct}%)`)
      })
    }
    lines.push(`Total gastos: ${formatARS(totalGastos)}`)
    lines.push('')
    lines.push(`✅ Sobrante: ${formatARS(sobranteARS)} = ${formatUSD(sobranteUSD)}`)
    lines.push(`   (TC: $ ${config.tipoCambio.toLocaleString('es-AR')} ARS/USD)`)
    lines.push('')
    lines.push('💲 INVERSIONES EN USD')
    lines.push('─────────────────────')
    if (activos.length) {
      activos.forEach(a => lines.push(`  • ${a.nombre} (${a.tipo}): ${formatUSD(a.monto)}`))
    }
    lines.push(`Patrimonio total: ${formatUSD(patrimonioUSD)}`)

    if (movimientos.length) {
      lines.push('')
      lines.push('Inversiones realizadas este mes:')
      movimientos.forEach(m => lines.push(`  → ${m.nombre}: ${formatUSD(m.monto)}`))
    }

    return lines.join('\n')
  }

  function handleCopy() {
    navigator.clipboard.writeText(buildText()).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    })
  }

  return (
    <>
      <button onClick={() => setShow(true)} className="btn-ghost w-full text-sm">
        Exportar resumen mensual
      </button>

      {show && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-end sm:items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-lg shadow-2xl">
            <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="font-bold text-gray-900 dark:text-white">Resumen mensual</h3>
              <button onClick={() => setShow(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">✕</button>
            </div>
            <div className="p-4">
              <pre className="text-xs text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-900 rounded-xl p-4 overflow-auto max-h-72 whitespace-pre-wrap font-mono">
                {buildText()}
              </pre>
              <button onClick={handleCopy} className="btn-primary w-full mt-3">
                {copied ? '✓ Copiado al portapapeles' : 'Copiar texto'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
