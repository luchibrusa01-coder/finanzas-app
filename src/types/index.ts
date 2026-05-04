export interface Ingreso {
  id: string
  nombre: string
  monto: number
  fijo: boolean
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
  aporteMensual: number
}

export interface MovimientoInversion {
  id: string
  nombre: string
  activoId: string
  monto: number
}

export interface Config {
  tipoCambio: number
  nombreUsuario: string
}

export interface HistorialMes {
  id: string
  mes: string
  totalIngresos: number
  totalGastos: number
  sobranteARS: number
  sobranteUSD: number
  tipoCambio: number
}

export interface AppState {
  ingresos: Ingreso[]
  gastos: Gasto[]
  categorias: Categoria[]
  activos: Activo[]
  movimientos: MovimientoInversion[]
  config: Config
  historial: HistorialMes[]
}
