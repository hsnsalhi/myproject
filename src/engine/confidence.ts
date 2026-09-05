import type { Confidence, ConfidenceOutcome } from '@/schema/session'

/**
 * La seule table qui décide ce que produit un pari de confiance.
 *
 *   pari       | juste                          | faux
 *   -----------|--------------------------------|------------------------------
 *   c'est sûr  | récompense forte, rien à suivre | aucune sanction, remédiation immédiate
 *   je pense   | récompense normale             | correction, marqué à revoir
 *   au hasard  | récompense faible, à revoir     | correction, marqué à revoir
 *
 * Ni l'interface ni le contenu n'ont d'avis là-dessus.
 */
export function outcomeFor(confidence: Confidence, correct: boolean): ConfidenceOutcome {
  if (correct) {
    switch (confidence) {
      case 'sure':
        return { reward: 'strong', followUp: 'none' }
      case 'think':
        return { reward: 'normal', followUp: 'none' }
      case 'guess':
        return { reward: 'weak', followUp: 'review' }
    }
  }
  switch (confidence) {
    case 'sure':
      return { reward: 'none', followUp: 'remediate' }
    case 'think':
    case 'guess':
      return { reward: 'none', followUp: 'review' }
  }
}
