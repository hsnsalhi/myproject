// src/schema/explanation.ts
export type EquationToken =
  | { readonly kind: 'symbol'; readonly text: string; readonly meaning: string }  // F, m, g, a : rendu en italique
  | { readonly kind: 'operator'; readonly text: '=' | '·' | '+' | '−' }
  | { readonly kind: 'number'; readonly text: string; readonly unit?: string }
  | { readonly kind: 'fraction'; readonly numerator: ReadonlyArray<EquationToken>; readonly denominator: ReadonlyArray<EquationToken> }

export interface EquationLine { readonly tokens: ReadonlyArray<EquationToken> }

/**
 * L'équation se construit devant l'utilisateur. `write` : une pression par jeton (les jetons d'une fraction comptent un par un).
 * `substitute`, `cancel`, `result` : une pression chacun. Le `text` s'affiche à la fin de l'étape.
 */
export type EquationStep =
  | { readonly kind: 'write'; readonly line: EquationLine; readonly text: string }
  | { readonly kind: 'substitute'; readonly symbol: string; readonly by: ReadonlyArray<EquationToken>; readonly text: string }
  | { readonly kind: 'cancel'; readonly symbol: string; readonly text: string }   // barre un symbole présent au numérateur et au dénominateur
  | { readonly kind: 'result'; readonly line: EquationLine; readonly text: string } // ligne finale, reprise sur la page de carnet

export type ExplanationBlock =
  | { readonly kind: 'text'; readonly text: string }
  | { readonly kind: 'equation'; readonly steps: ReadonlyArray<EquationStep> }
