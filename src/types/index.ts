export interface Ingreso {
  id: string
  nombre: string
  monto: number
}

export interface Categoria {
  id: string
  nombre: string
}

export interface Gasto {
  id: string
  categoriaId: string
  descripcion: string
  monto: number
}

export type TipoActivo = 'ETF/Acciones' | 'FCI/Bonos' | 'Crypto' | 'Inmueble' | 'Efectivo'

export interface Activo {
  id: string
  nombre: string
  monto: number
  tipo: TipoActivo
}

export interface AsignacionInversion {
  id: string
  nombre: string
  monto: number
}

export interface Config {
  tipoCambio: number
  nombreUsuario: string
}

export interface AppState {
  ingresos: Ingreso[]
  gastos: Gasto[]
  categorias: Categoria[]
  activos: Activo[]
  asignaciones: AsignacionInversion[]
  config: Config
}
