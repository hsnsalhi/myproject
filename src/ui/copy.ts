import type { Confidence } from '@/schema/session'

/**
 * Les textes fixes de l'interface, en français. Tout ce qui est propre à une leçon
 * vit dans le contenu, pas ici.
 */
export const copy = {
  steps: {
    hook: 'Accroche',
    prediction: 'Prédiction',
    observation: 'Observation',
    explanation: 'Explication',
    exercise: 'Exercice',
    correction: 'Correction',
    sandbox: 'Bac à sable',
    notebook: 'Carnet',
  },
  buttons: {
    continue: 'Continuer',
    predict: 'Poser ma prédiction',
    reviewFall: 'Revoir la chute',
    replay: 'Rejouer',
    slowMotion: (factor: number) => `Ralenti ×${factor}`,
    realTime: 'Temps réel',
    seeWhy: 'Voir pourquoi',
    nextTerm: 'Terme suivant',
    toExercises: 'Passer aux exercices',
    answer: 'Répondre',
    nextExercise: 'Exercice suivant',
    toSandbox: 'Passer au bac à sable',
    fillPage: 'Remplir la page',
    restart: 'Refaire la leçon',
  },
  confidence: {
    label: 'Ton pari',
    guess: 'au hasard',
    think: 'je pense',
    sure: 'c’est sûr',
  } satisfies { label: string } & Record<Confidence, string>,
  outcome: {
    sureRight: 'juste, et tu le savais',
    thinkRight: 'juste',
    guessRight: 'juste, mais au hasard : à revoir',
    right: 'juste',
    misconception: 'ce qui trompe',
  },
  reminder: (optionLabel: string, confidence: Confidence): string =>
    `Ta prédiction : ${lowerFirst(optionLabel)}. Tu avais dit : ${copy.confidence[confidence]}.`,
  notebook: {
    page: (n: number) => `Page ${n}`,
    predicted: (optionLabel: string, confidence: Confidence) =>
      `Tu avais prédit : ${lowerFirst(optionLabel)}. Tu avais dit : ${copy.confidence[confidence]}.`,
    observed: (text: string) => `Observé : ${text}.`,
    toReview: 'À revoir',
  },
  sandbox: {
    challenges: 'Trois défis, si tu veux',
    on: 'avec',
    off: 'sans',
  },
  clock: (seconds: string) => `t = ${seconds}`,
} as const

function lowerFirst(text: string): string {
  return text.length === 0 ? text : text.charAt(0).toLowerCase() + text.slice(1)
}

/** Date courte à la française : « 5 sept. 2026 ». */
export function formatDate(iso: string): string {
  const date = new Date(iso)
  const months = ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.']
  return `${date.getDate()} ${months[date.getMonth()] ?? ''} ${date.getFullYear()}`
}
