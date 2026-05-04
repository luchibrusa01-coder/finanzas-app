'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { Ingreso, Gasto, Categoria, Activo, AsignacionInversion, Config, HistorialMes } from '@/types'
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
  asignaciones: AsignacionInversion[]
  config: Config
  historial: HistorialMes[]
  totalIngresos: number
  totalGastos: number
  sobranteARS: number
  sobranteUSD: number
  patrimonioUSD: number
  addIngreso: (nombre: string, monto: number) => void
  removeIngreso: (id: string) => void
  addGasto: (categoriaId: string, descripcion: string, monto: number) => void
  removeGasto: (id: string) => void
  addCategoria: (nombre: string) => void
  updateCategoria: (id: string, nombre: string) => void
  removeCategoria: (id: string) => boolean
  addActivo: (activo: Omit<Activo, 'id'>) => void
  updateActivo: (activo: Activo) => void
  removeActivo: (id: string) => void
  setAsignaciones: (a: AsignacionInversion[]) => void
  addAsignacion: (nombre: string, monto: number) => void
  removeAsignacion: (id: string) => void
  updateAsignacion: (id: string, nombre: string, monto: number) => void
  updateConfig: (partial: Partial<Config>) => void
  cerrarMes: () => void
  eliminarHistorial: (id: string) => void
}

const AppContext = createContext<AppContextType | null>(null)

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [ingresos, setIngresos] = useState<Ingreso[]>([])
  const [gastos, setGastos] = useState<Gasto[]>([])
  const [categorias, setCategorias] = useState<Categoria[]>(INITIAL_CATEGORIAS)
  const [activos, setActivos] = useState<Activo[]>([])
  const [asignaciones, setAsignaciones] = useState<AsignacionInversion[]>([])
  const [config, setConfig] = useState<Config>({ tipoCambio: 1400, nombreUsuario: '' })
  const [historial, setHistorial] = useState<HistorialMes[]>([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    try {
      const raw = localStorage.getItem('finanzas_v1')
      if (raw) {
        const s = JSON.parse(raw)
        if (s.ingresos) setIngresos(s.ingresos)
        if (s.gastos) setGastos(s.gastos)
        if (s.categorias) setCategorias(s.categorias)
        if (s.activos) setActivos(s.activos)
        if (s.asignaciones) setAsignaciones(s.asignaciones)
        if (s.config) setConfig(s.config)
        if (s.historial) setHistorial(s.historial)
      }
    } catch {}
    setLoaded(true)
  }, [])

  useEffect(() => {
    if (!loaded) return
    localStorage.setItem('finanzas_v1', JSON.stringify({
      ingresos, gastos, categorias, activos, asignaciones, config, historial,
    }))
  }, [ingresos, gastos, categorias, activos, asignaciones, config, historial, loaded])

  const totalIngresos = ingresos.reduce((s, i) => s + i.monto, 0)
  const totalGastos = gastos.reduce((s, g) => s + g.monto, 0)
  const sobranteARS = totalIngresos - totalGastos
  const sobranteUSD = sobranteARS > 0 ? sobranteARS / config.tipoCambio : 0
  const patrimonioUSD = activos.reduce((s, a) => s + a.monto, 0)

  const addIngreso = (nombre: string, monto: number) =>
    setIngresos(prev => [...prev, { id: generateId(), nombre, monto }])
  const removeIngreso = (id: string) =>
    setIngresos(prev => prev.filter(i => i.id !== id))

  const addGasto = (categoriaId: string, descripcion: string, monto: number) =>
    setGastos(prev => [...prev, { id: generateId(), categoriaId, descripcion, monto }])
  const removeGasto = (id: string) =>
    setGastos(prev => prev.filter(g => g.id !== id))

  const addCategoria = (nombre: string) =>
    setCategorias(prev => [...prev, { id: generateId(), nombre }])
  const updateCategoria = (id: string, nombre: string) =>
    setCategorias(prev => prev.map(c => c.id === id ? { ...c, nombre } : c))
  const removeCategoria = (id: string): boolean => {
    const inUse = gastos.some(g => g.categoriaId === id)
    if (inUse) return false
    setCategorias(prev => prev.filter(c => c.id !== id))
    return true
  }

  const addActivo = (activo: Omit<Activo, 'id'>) =>
    setActivos(prev => [...prev, { ...activo, id: generateId() }])
  const updateActivo = (activo: Activo) =>
    setActivos(prev => prev.map(a => a.id === activo.id ? activo : a))
  const removeActivo = (id: string) =>
    setActivos(prev => prev.filter(a => a.id !== id))

  const addAsignacion = (nombre: string, monto: number) =>
    setAsignaciones(prev => [...prev, { id: generateId(), nombre, monto }])
  const removeAsignacion = (id: string) =>
    setAsignaciones(prev => prev.filter(a => a.id !== id))
  const updateAsignacion = (id: string, nombre: string, monto: number) =>
    setAsignaciones(prev => prev.map(a => a.id === id ? { ...a, nombre, monto } : a))

  const updateConfig = (partial: Partial<Config>) =>
    setConfig(prev => ({ ...prev, ...partial }))

  const cerrarMes = () => {
    const ahora = new Date()
    const mes = ahora.toLocaleDateString('es-AR', { month: 'long', year: 'numeric' })
    const entrada: HistorialMes = {
      id: generateId(),
      mes,
      totalIngresos,
      totalGastos,
      sobranteARS,
      sobranteUSD,
      tipoCambio: config.tipoCambio,
    }
    setHistorial(prev => [entrada, ...prev])
    setGastos([])
  }

  const eliminarHistorial = (id: string) =>
    setHistorial(prev => prev.filter(h => h.id !== id))

  return (
    <AppContext.Provider value={{
      ingresos, gastos, categorias, activos, asignaciones, config, historial,
      totalIngresos, totalGastos, sobranteARS, sobranteUSD, patrimonioUSD,
      addIngreso, removeIngreso,
      addGasto, removeGasto,
      addCategoria, updateCategoria, removeCategoria,
      addActivo, updateActivo, removeActivo,
      setAsignaciones, addAsignacion, removeAsignacion, updateAsignacion,
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
