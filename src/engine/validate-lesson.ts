import { moduleFor } from '@/physics/modules'
import type { EquationStep, EquationToken } from '@/schema/explanation'
import type { AnyLesson, Lesson } from '@/schema/lesson'
import type { SimulationModuleId } from '@/schema/simulation'
import { observedOptionId, deepEqual } from './verdict'

/**
 * Les invariants que les types n'expriment pas. Renvoie une liste d'erreurs lisibles,
 * vide si la leçon est valide. Exécuté en développement au démarrage et dans un test
 * qui parcourt tout le registre.
 */
export function validateLesson<M extends SimulationModuleId>(lesson: Lesson<M>): string[] {
  const errors: string[] = []
  const at = (path: string, message: string): void => {
    errors.push(`${lesson.id} › ${path} : ${message}`)
  }

  const unique = (path: string, ids: ReadonlyArray<string>): void => {
    const seen = new Set<string>()
    for (const id of ids) {
      if (seen.has(id)) at(path, `identifiant en double « ${id} »`)
      seen.add(id)
    }
  }

  if (lesson.exercises.length < 2 || lesson.exercises.length > 4) {
    at('exercises', `${lesson.exercises.length} exercice(s), il en faut de deux à quatre`)
  }
  unique('exercises', lesson.exercises.map((e) => e.id))
  lesson.exercises.forEach((exercise) => {
    const path = `exercises[${exercise.id}]`
    unique(`${path}.options`, exercise.options.map((o) => o.id))
    if (!exercise.options.some((o) => o.id === exercise.answerId)) at(path, `answerId « ${exercise.answerId} » n'est pas une option`)
    exercise.options
      .filter((o) => o.id !== exercise.answerId && !o.misconception)
      .forEach((o) => at(`${path}.options[${o.id}]`, 'une option fausse doit avoir une misconception'))
    if (exercise.correction.length === 0) at(path, 'la correction est vide')
  })

  if (lesson.concepts.length === 0) at('concepts', 'au moins un concept')
  unique('concepts', lesson.concepts)
  unique('sandbox.challenges', lesson.sandbox.challenges.map((c) => c.id))
  unique('sandbox.controls', lesson.sandbox.controls.map((c) => c.id))

  // Simulation et prédiction.
  const module = moduleFor(lesson.simulation)
  const params = lesson.simulation.params
  const bodyIdList = bodyIdsOf(params)
  unique('simulation.params.bodies', bodyIdList)
  const bodyIds = new Set(bodyIdList)

  const prediction = lesson.prediction
  unique('prediction.options', prediction.options.map((o) => o.id))
  prediction.options.forEach((option, i) => {
    prediction.options.slice(i + 1).forEach((other) => {
      if (deepEqual(option.expected, other.expected)) at('prediction.options', `« ${option.id} » et « ${other.id} » attendent la même valeur`)
    })
    const expected: unknown = option.expected
    if (typeof expected === 'object' && expected !== null && 'kind' in expected && expected.kind === 'body') {
      const id = 'id' in expected ? expected.id : undefined
      if (typeof id !== 'string' || !bodyIds.has(id)) at(`prediction.options[${option.id}]`, `corps inconnu « ${String(id)} »`)
    }
  })
  try {
    const result = module.simulate(params)
    const observables = module.observe(result, params)
    const confirmed = observedOptionId(prediction, observables)
    if (confirmed === null) at('prediction', 'aucune option ne correspond à ce que la simulation mesure avec les paramètres de la leçon')
  } catch (error) {
    at('simulation', `la simulation a échoué : ${error instanceof Error ? error.message : String(error)}`)
  }

  // Bac à sable.
  lesson.sandbox.controls.forEach((control) => {
    const path = `sandbox.controls[${control.id}]`
    if (control.kind === 'slider') {
      if (!(control.min < control.max)) at(path, 'min doit être inférieur à max')
      const targetBodyId = bodyIdOfRef(control.target)
      if (targetBodyId !== undefined && !bodyIds.has(targetBodyId)) at(path, `corps inconnu « ${targetBodyId} »`)
      const start = module.readNumeric(params, control.target)
      if (start < control.min || start > control.max) at(path, `la valeur de départ ${start} est hors de [${control.min}, ${control.max}]`)
      if (control.scale.kind === 'linear') {
        if (!(control.scale.step > 0)) at(path, 'le pas doit être positif')
        else {
          const ratio = (start - control.min) / control.scale.step
          if (Math.abs(ratio - Math.round(ratio)) > 1e-6) at(path, `la valeur de départ ${start} n'est pas un multiple du pas depuis min`)
        }
      } else {
        if (!(control.min > 0)) at(path, 'une réglette logarithmique exige min > 0')
        if (!(control.scale.digits >= 1)) at(path, 'digits doit valoir au moins 1')
      }
    }
  })

  // Équations.
  lesson.explanation.forEach((block, b) => {
    if (block.kind !== 'equation') return
    let line: ReadonlyArray<EquationToken> = []
    block.steps.forEach((step: EquationStep, s) => {
      const path = `explanation[${b}].steps[${s}]`
      switch (step.kind) {
        case 'write':
        case 'result':
          line = step.line.tokens
          if (line.length === 0) at(path, 'ligne vide')
          break
        case 'substitute':
          if (!hasSymbol(line, step.symbol)) at(path, `« ${step.symbol} » absent de la dernière ligne`)
          line = replaceSymbol(line, step.symbol, step.by)
          break
        case 'cancel':
          if (!cancellable(line, step.symbol)) at(path, `« ${step.symbol} » doit figurer au numérateur et au dénominateur d'une fraction`)
          break
      }
    })
    if (!block.steps.some((step) => step.kind === 'result')) at(`explanation[${b}]`, 'une équation doit se terminer par une étape result')
  })

  return errors
}

export function validateAll(lessons: ReadonlyArray<AnyLesson>): string[] {
  const errors = lessons.flatMap((lesson) => validateLesson(lesson))
  const ids = lessons.map((l) => l.id)
  ids.forEach((id, i) => {
    if (ids.indexOf(id) !== i) errors.push(`registre : identifiant de leçon en double « ${id} »`)
  })
  return errors
}

/** Les identifiants de corps d'un jeu de paramètres, quel que soit le module (lecture structurelle, sans cast sur le générique). */
function bodyIdsOf(params: unknown): string[] {
  if (typeof params !== 'object' || params === null || !('bodies' in params)) return []
  const bodies: unknown = params.bodies
  if (!Array.isArray(bodies)) return []
  return bodies.flatMap((body: unknown) =>
    typeof body === 'object' && body !== null && 'id' in body && typeof body.id === 'string' ? [body.id] : [],
  )
}

function bodyIdOfRef(ref: unknown): string | undefined {
  if (typeof ref === 'object' && ref !== null && 'bodyId' in ref && typeof ref.bodyId === 'string') return ref.bodyId
  return undefined
}

function hasSymbol(tokens: ReadonlyArray<EquationToken>, symbol: string): boolean {
  return tokens.some((t) => (t.kind === 'symbol' && t.text === symbol) || (t.kind === 'fraction' && (hasSymbol(t.numerator, symbol) || hasSymbol(t.denominator, symbol))))
}

function replaceSymbol(tokens: ReadonlyArray<EquationToken>, symbol: string, by: ReadonlyArray<EquationToken>): EquationToken[] {
  return tokens.flatMap((t): EquationToken[] => {
    if (t.kind === 'symbol' && t.text === symbol) return [...by]
    if (t.kind === 'fraction') return [{ kind: 'fraction', numerator: replaceSymbol(t.numerator, symbol, by), denominator: replaceSymbol(t.denominator, symbol, by) }]
    return [t]
  })
}

function cancellable(tokens: ReadonlyArray<EquationToken>, symbol: string): boolean {
  return tokens.some((t) => t.kind === 'fraction' && ((hasSymbol(t.numerator, symbol) && hasSymbol(t.denominator, symbol)) || cancellable(t.numerator, symbol) || cancellable(t.denominator, symbol)))
}
