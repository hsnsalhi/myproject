import type { EquationStep, EquationToken } from '@/schema/explanation'

/**
 * Construction d'une équation terme par terme, comme le fait la main sur un tableau.
 * Pure : (étapes, avancement) → ce qu'il faut dessiner. Aucune notion de pixel ici.
 */

export type EquationNode =
  | { readonly kind: 'symbol'; readonly text: string; readonly meaning: string; readonly cancelled: boolean }
  | { readonly kind: 'operator'; readonly text: string }
  | { readonly kind: 'number'; readonly text: string; readonly unit?: string }
  | { readonly kind: 'fraction'; readonly numerator: ReadonlyArray<EquationNode>; readonly denominator: ReadonlyArray<EquationNode> }

export interface EquationProgress {
  /** Indice de l'étape en cours dans la liste. */
  readonly stepIndex: number
  /** Nombre de pressions faites dans cette étape (une pression par jeton pour « write »). */
  readonly presses: number
}

export interface EquationView {
  /** Les lignes terminées, dans l'ordre. */
  readonly history: ReadonlyArray<ReadonlyArray<EquationNode>>
  /** La ligne en cours de construction. */
  readonly current: ReadonlyArray<EquationNode>
  /** Combien de jetons feuilles de la ligne courante sont visibles. */
  readonly visibleLeaves: number
  /** La cotation à afficher sous la bande : le dernier symbole apparu. */
  readonly caption: { readonly symbol: string; readonly meaning: string } | null
  /** Le texte de l'étape, dès qu'elle est complète. */
  readonly text: string | null
  /** Vrai quand l'étape en cours est complète. */
  readonly stepComplete: boolean
  /** Vrai quand la dernière étape est complète. */
  readonly done: boolean
}

export function toNodes(tokens: ReadonlyArray<EquationToken>): EquationNode[] {
  return tokens.map((token): EquationNode => {
    switch (token.kind) {
      case 'symbol':
        return { kind: 'symbol', text: token.text, meaning: token.meaning, cancelled: false }
      case 'operator':
        return { kind: 'operator', text: token.text }
      case 'number':
        return token.unit === undefined
          ? { kind: 'number', text: token.text }
          : { kind: 'number', text: token.text, unit: token.unit }
      case 'fraction':
        return { kind: 'fraction', numerator: toNodes(token.numerator), denominator: toNodes(token.denominator) }
    }
  })
}

export function countLeaves(nodes: ReadonlyArray<EquationNode>): number {
  return nodes.reduce((n, node) => n + (node.kind === 'fraction' ? countLeaves(node.numerator) + countLeaves(node.denominator) : 1), 0)
}

/** Les feuilles dans l'ordre de lecture (numérateur avant dénominateur). */
export function leaves(nodes: ReadonlyArray<EquationNode>): EquationNode[] {
  return nodes.flatMap((node) => (node.kind === 'fraction' ? [...leaves(node.numerator), ...leaves(node.denominator)] : [node]))
}

function substitute(nodes: ReadonlyArray<EquationNode>, symbol: string, by: ReadonlyArray<EquationNode>): EquationNode[] {
  return nodes.flatMap((node): EquationNode[] => {
    if (node.kind === 'symbol' && node.text === symbol) return [...by]
    if (node.kind === 'fraction') {
      return [{ kind: 'fraction', numerator: substitute(node.numerator, symbol, by), denominator: substitute(node.denominator, symbol, by) }]
    }
    return [node]
  })
}

function cancel(nodes: ReadonlyArray<EquationNode>, symbol: string): EquationNode[] {
  return nodes.map((node): EquationNode => {
    if (node.kind === 'symbol' && node.text === symbol) return { ...node, cancelled: true }
    if (node.kind === 'fraction') return { kind: 'fraction', numerator: cancel(node.numerator, symbol), denominator: cancel(node.denominator, symbol) }
    return node
  })
}

/** Les opérateurs ne demandent pas de pression : ils apparaissent avec le jeton qui les suit. */
function countPressable(nodes: ReadonlyArray<EquationNode>): number {
  return leaves(nodes).filter((node) => node.kind !== 'operator').length
}

/** Combien de feuilles sont visibles après `presses` pressions : chaque pression révèle un jeton et les opérateurs qui le précèdent. */
export function visibleLeafCount(nodes: ReadonlyArray<EquationNode>, presses: number): number {
  let shown = 0
  let revealed = 0
  for (const leaf of leaves(nodes)) {
    shown++
    if (leaf.kind !== 'operator') {
      revealed++
      if (revealed >= presses) break
    }
  }
  return shown
}

/** Nombre de pressions qu'une étape demande pour être complète. */
export function pressesNeeded(step: EquationStep): number {
  return step.kind === 'write' ? Math.max(1, countPressable(toNodes(step.line.tokens))) : 1
}

export const initialProgress: EquationProgress = { stepIndex: 0, presses: 1 }

/** Une pression de plus : un jeton de plus, ou l'étape suivante si celle-ci est complète. */
export function advance(steps: ReadonlyArray<EquationStep>, progress: EquationProgress): EquationProgress {
  const step = steps[progress.stepIndex]
  if (!step) return progress
  if (progress.presses < pressesNeeded(step)) return { stepIndex: progress.stepIndex, presses: progress.presses + 1 }
  if (progress.stepIndex + 1 >= steps.length) return progress
  return { stepIndex: progress.stepIndex + 1, presses: 1 }
}

export function equationView(steps: ReadonlyArray<EquationStep>, progress: EquationProgress): EquationView {
  const history: EquationNode[][] = []
  let current: EquationNode[] = []
  let caption: EquationView['caption'] = null
  let visibleLeaves = 0
  let text: string | null = null
  let stepComplete = false

  const lastIndex = Math.min(progress.stepIndex, steps.length - 1)
  for (let i = 0; i <= lastIndex; i++) {
    const step = steps[i]
    if (!step) break
    const isCurrent = i === lastIndex
    const presses = isCurrent ? progress.presses : pressesNeeded(step)
    switch (step.kind) {
      case 'write': {
        if (current.length > 0) history.push(current)
        current = toNodes(step.line.tokens)
        visibleLeaves = visibleLeafCount(current, presses)
        const shown = leaves(current).slice(0, visibleLeaves)
        const lastSymbol = [...shown].reverse().find((node) => node.kind === 'symbol')
        caption = lastSymbol && lastSymbol.kind === 'symbol' ? { symbol: lastSymbol.text, meaning: lastSymbol.meaning } : null
        stepComplete = presses >= pressesNeeded(step)
        break
      }
      case 'substitute': {
        current = substitute(current, step.symbol, toNodes(step.by))
        visibleLeaves = countLeaves(current)
        const firstSymbol = toNodes(step.by).find((node) => node.kind === 'symbol')
        caption = firstSymbol && firstSymbol.kind === 'symbol' ? { symbol: firstSymbol.text, meaning: firstSymbol.meaning } : null
        stepComplete = true
        break
      }
      case 'cancel': {
        current = cancel(current, step.symbol)
        visibleLeaves = countLeaves(current)
        caption = null
        stepComplete = true
        break
      }
      case 'result': {
        if (current.length > 0) history.push(current)
        current = toNodes(step.line.tokens)
        visibleLeaves = countLeaves(current)
        const lastSymbol = [...leaves(current)].reverse().find((node) => node.kind === 'symbol')
        caption = lastSymbol && lastSymbol.kind === 'symbol' ? { symbol: lastSymbol.text, meaning: lastSymbol.meaning } : null
        stepComplete = true
        break
      }
    }
    text = isCurrent && stepComplete ? step.text : null
  }

  return {
    history,
    current,
    visibleLeaves,
    caption,
    text,
    stepComplete,
    done: stepComplete && lastIndex === steps.length - 1,
  }
}

/** La ligne finale d'une liste d'étapes, pour la page de carnet. */
export function resultLine(steps: ReadonlyArray<EquationStep>): ReadonlyArray<EquationToken> | null {
  for (let i = steps.length - 1; i >= 0; i--) {
    const step = steps[i]
    if (step && step.kind === 'result') return step.line.tokens
  }
  return null
}
