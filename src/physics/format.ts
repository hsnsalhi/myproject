/** Formatage des nombres à la française : virgule décimale, sans séparateur de milliers. */
export function formatNumber(value: number, decimals: number): string {
  if (!Number.isFinite(value)) return '—'
  return value.toFixed(decimals).replace('.', ',')
}

/** « 0,64 s » */
export function formatSeconds(seconds: number): string {
  return `${formatNumber(seconds, 2)} s`
}

/**
 * Formatage d'une valeur avec un nombre de chiffres significatifs, pour les réglettes
 * logarithmiques : 0,004 → « 0,004 », 0,117 → « 0,117 », 0,5 → « 0,500 ».
 */
export function formatSignificant(value: number, digits: number): string {
  if (!Number.isFinite(value)) return '—'
  if (value === 0) return '0'
  const magnitude = Math.floor(Math.log10(Math.abs(value)))
  const decimals = Math.max(0, digits - 1 - magnitude)
  return formatNumber(value, decimals)
}
