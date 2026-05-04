'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { Ingreso, Gasto, Categoria, Activo, MovimientoInversion, Config, HistorialMes, TipoActivo } from '@/types'
import { generateId } from '@/utils/format'

const INITIAL_CATEGORIAS: Categoria[] = [
  { id: 'cat-1', nombre: 'Alimentación' },
  { id: 'cat-2', nombre: 'Salidas a comer' },
  { id: 'cat-3', nombre: 'Tarjetas' },
  { id: 'cat-4', nombre: 'Salud' },
  { id: 'cat-5', nombre: 'Transporte' },
  { id: 'cat-6', nombre: 'Servicios' },
  { id: 'cat-7', nombre: 'Ocio' },
  { id: 'cat-8', nombre: 'Otros' },
]

interface AppContextType {
  ingresos: Ingreso[]
  gastos: Gasto[]
  categorias: Categoria[]
  activos: Activo[]
  movimientos: MovimientoInversion[]
  config: Config
  historial: HistorialMes[]
  // Derived
  totalIngresos: number
  totalGastos: number
  sobranteARS: number
  sobranteUSD: number
  patrimonioUSD: number
  totalInvertidoMes: number
  // Ingresos
  addIngreso: (nombre: string, monto: number, fijo: boolean) => void
  removeIngreso: (id: string) => void
  // Gastos
  addGasto: (categoriaId: string, descripcion: string, monto: number) => void
  removeGasto: (id: string) => void
  // Categorias
  addCategoria: (nombre: string) => void
  updateCategoria: (id: string, nombre: string) => void
  removeCategoria: (id: string) => boolean
  // Activos
  addActivo: (activo: Omit<Activo, 'id'>) => void
  updateActivo: (activo: Activo) => void
  removeActivo: (id: string) => void
  // Movimientos de inversión
  addMovimiento: (nombre: string, activoId: string, monto: number) => void
  addMovimientoNuevo: (nombre: string, tipo: TipoActivo, monto: number) => void
  removeMovimiento: (id: string) => void
  // Config
  updateConfig: (partial: Partial<Config>) => void
  // Historial
  cerrarMes: () => void
  eliminarHistorial: (id: string) => void
}

const AppContext = createContext<AppContextType | null>(null)

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [ingresos, setIngresos] = useState<Ingreso[]>([])
  const [gastos, setGastos] = useState<Gasto[]>([])
  const [categorias, setCategorias] = useState<Categoria[]>(INITIAL_CATEGORIAS)
  const [activos, setActivos] = useState<Activo[]>([])
  const [movimientos, setMovimientos] = useState<MovimientoInversion[]>([])
  const [config, setConfig] = useState<Config>({ tipoCambio: 1400, nombreUsuario: '' })
  const [historial, setHistorial] = useState<HistorialMes[]>([])
  const [loaded, setLoaded] = useState(false)

  // Load
  useEffect(() => {
    try {
      const raw = localStorage.getItem('finanzas_v2')
      if (raw) {
        const s = JSON.parse(raw)
        if (s.ingresos) setIngresos(s.ingresos)
        if (s.gastos) setGastos(s.gastos)
        if (s.categorias) setCategorias(s.categorias)
        if (s.activos) setActivos(s.activos)
        if (s.movimientos) setMovimientos(s.movimientos)
        if (s.config) setConfig(s.config)
        if (s.historial) setHistorial(s.historial)
      }
    } catch {}
    setLoaded(true)
  }, [])

  // Persist
  useEffect(() => {
    if (!loaded) return
    localStorage.setItem('finanzas_v2', JSON.stringify({
      ingresos, gastos, categorias, activos, movimientos, config, historial,
    }))
  }, [ingresos, gastos, categorias, activos, movimientos, config, historial, loaded])

  // Derived
  const totalIngresos = ingresos.reduce((s, i) => s + i.monto, 0)
  const totalGastos = gastos.reduce((s, g) => s + g.monto, 0)
  const sobranteARS = totalIngresos - totalGastos
  const sobranteUSD = sobranteARS > 0 ? sobranteARS / config.tipoCambio : 0
  const patrimonioUSD = activos.reduce((s, a) => s + a.monto, 0)
  const totalInvertidoMes = movimientos.reduce((s, m) => s + m.monto, 0)

  // Ingresos
  const addIngreso = (nombre: string, monto: number, fijo: boolean) =>
    setIngresos(prev => [...prev, { id: generateId(), nombre, monto, fijo }])
  const removeIngreso = (id: string) =>
    setIngresos(prev => prev.filter(i => i.id !== id))

  // Gastos
  const addGasto = (categoriaId: string, descripcion: string, monto: number) =>
    setGastos(prev => [...prev, { id: generateId(), categoriaId, descripcion, monto }])
  const removeGasto = (id: string) =>
    setGastos(prev => prev.filter(g => g.id !== id))

  // Categorias
  const addCategoria = (nombre: string) =>
    setCategorias(prev => [...prev, { id: generateId(), nombre }])
  const updateCategoria = (id: string, nombre: string) =>
    setCategorias(prev => prev.map(c => c.id === id ? { ...c, nombre } : c))
  const removeCategoria = (id: string): boolean => {
    if (gastos.some(g => g.categoriaId === id)) return false
    setCategorias(prev => prev.filter(c => c.id !== id))
    return true
  }

  // Activos
  const addActivo = (activo: Omit<Activo, 'id'>) =>
    setActivos(prev => [...prev, { ...activo, id: generateId() }])
  const updateActivo = (activo: Activo) =>
    setActivos(prev => prev.map(a => a.id === activo.id ? activo : a))
  const removeActivo = (id: string) =>
    setActivos(prev => prev.filter(a => a.id !== id))

  // Movimientos — al agregar suma al activo en tiempo real
  const addMovimiento = (nombre: string, activoId: string, monto: number) => {
    setMovimientos(prev => [...prev, { id: generateId(), nombre, activoId, monto }])
    setActivos(prev => prev.map(a => a.id === activoId ? { ...a, monto: a.monto + monto } : a))
  }

  // Movimiento con activo nuevo — crea activo y movimiento juntos
  const addMovimientoNuevo = (nombre: string, tipo: TipoActivo, monto: number) => {
    const nuevoActivoId = generateId()
    setActivos(prev => [...prev, { id: nuevoActivoId, nombre, monto, tipo, aporteMensual: 0 }])
    setMovimientos(prev => [...prev, { id: generateId(), nombre, activoId: nuevoActivoId, monto }])
  }

  const removeMovimiento = (id: string) => {
    const mov = movimientos.find(m => m.id === id)
    if (!mov) return
    setMovimientos(prev => prev.filter(m => m.id !== id))
    setActivos(prev => prev.map(a => a.id === mov.activoId ? { ...a, monto: Math.max(0, a.monto - mov.monto) } : a))
  }

  // Config
  const updateConfig = (partial: Partial<Config>) =>
    setConfig(prev => ({ ...prev, ...partial }))

  // Cerrar mes
  const cerrarMes = () => {
    const ahora = new Date()
    const mes = ahora.toLocaleDateString('es-AR', { month: 'long', year: 'numeric' })
    setHistorial(prev => [{
      id: generateId(),
      mes,
      totalIngresos,
      totalGastos,
      sobranteARS,
      sobranteUSD,
      tipoCambio: config.tipoCambio,
    }, ...prev])
    setGastos([])
    setMovimientos([])
    setIngresos(prev => prev.filter(i => i.fijo))
  }

  const eliminarHistorial = (id: string) =>
    setHistorial(prev => prev.filter(h => h.id !== id))

  return (
    <AppContext.Provider value={{
      ingresos, gastos, categorias, activos, movimientos, config, historial,
      totalIngresos, totalGastos, sobranteARS, sobranteUSD, patrimonioUSD, totalInvertidoMes,
      addIngreso, removeIngreso,
      addGasto, removeGasto,
      addCategoria, updateCategoria, removeCategoria,
      addActivo, updateActivo, removeActivo,
      addMovimiento, addMovimientoNuevo, removeMovimiento,
      updateConfig,
      cerrarMes, eliminarHistorial,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
