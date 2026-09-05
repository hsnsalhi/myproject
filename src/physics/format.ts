/**
 * Ces fonctions portent la directive worklet : la réglette les appelle sur le thread
 * d'interface pour afficher la valeur qui suit le doigt.
 */
/** Formatage des nombres à la française : virgule décimale, sans séparateur de milliers. */
export function formatNumber(value: number, decimals: number): string {
  'worklet'
  if (!Number.isFinite(value)) return '—'
  return value.toFixed(decimals).replace('.', ',')
}

/** « 0,64 s » */
export function formatSeconds(seconds: number): string {
  'worklet'
  return `${formatNumber(seconds, 2)} s`
}

/** « 0,00400 » → « 0,004 », « 100,0 » → « 100 », « 9,81 » inchangé. */
export function trimZeros(text: string): string {
  'worklet'
  if (text.indexOf(',') === -1) return text
  let end = text.length
  while (end > 0 && text.charAt(end - 1) === '0') end--
  if (text.charAt(end - 1) === ',') end--
  return text.slice(0, end)
}

/**
 * Formatage d'une valeur avec un nombre de chiffres significatifs, pour les réglettes
 * logarithmiques : 0,004 → « 0,004 », 0,117 → « 0,117 », 0,5 → « 0,500 ».
 */
export function formatSignificant(value: number, digits: number): string {
  'worklet'
  if (!Number.isFinite(value)) return '—'
  if (value === 0) return '0'
  const magnitude = Math.floor(Math.log10(Math.abs(value)))
  const decimals = Math.max(0, digits - 1 - magnitude)
  return trimZeros(formatNumber(value, decimals))
}
