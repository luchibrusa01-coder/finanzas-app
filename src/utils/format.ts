export function formatARS(n: number): string {
  return '$ ' + Math.round(n).toLocaleString('es-AR')
}

export function formatUSD(n: number): string {
  return 'U$S ' + n.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

export function generateId(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36)
}

export function calcFV(pv: number, pmt: number, years: number, annualRate = 0.10): number {
  const r = annualRate / 12
  const n = years * 12
  return pv * Math.pow(1 + r, n) + pmt * (Math.pow(1 + r, n) - 1) / r
}
