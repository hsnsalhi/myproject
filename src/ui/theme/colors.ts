/**
 * La palette « Crayon et encre ». Ce sont les seules couleurs de l'application ;
 * aucun hex ailleurs. Rôles fixés dans docs/jalon-1/proposition.md.
 */
export const colors = {
  /** Fond des écrans et des pages du carnet. */
  papier: '#F3F5F2',
  /** Lignes fines de la grille, pistes, filets, fond d'un bouton désactivé, plan sous la page. */
  trame: '#B5C2B9',
  /** Texte, remplissage d'un élément choisi, et la réalité simulée. */
  encre: '#17233B',
  /** Texte secondaire, unités, lignes renforcées de la grille. */
  graphite: '#5A6572',
  /** Ce que l'utilisateur a affirmé, et rien d'autre. */
  ocre: '#9E5E0A',
  /** Affordance d'interaction : poignée, interrupteur, point de la graduation courante. Jamais seul pour dire un état. */
  vertDeGris: '#0F7B7A',
} as const

export type ColorName = keyof typeof colors
