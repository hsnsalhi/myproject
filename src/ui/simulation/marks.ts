/**
 * Ce qu'une valeur d'observable « ordre d'arrivée » dit de chaque corps, pour dessiner
 * les repères : « 1 » sous celui qu'on croit premier, « 2 » sous les autres, « = » sous
 * tous en cas d'égalité. Lecture structurelle, pour ne pas lier le cadre à un module.
 */
export type Rank = '1' | '2' | '=' | null

export function ranksFor(value: unknown, bodyIds: ReadonlyArray<string>): Rank[] {
  if (typeof value !== 'object' || value === null || !('kind' in value)) return bodyIds.map(() => null)
  const kind = value.kind
  if (kind === 'tie') return bodyIds.map(() => '=')
  if (kind === 'body' && 'id' in value && typeof value.id === 'string') {
    const first = value.id
    return bodyIds.map((id) => (id === first ? '1' : '2'))
  }
  return bodyIds.map(() => null)
}
